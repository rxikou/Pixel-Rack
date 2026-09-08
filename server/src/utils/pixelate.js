import { execFile } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { GoogleGenAI } from '@google/genai'
import sharp from 'sharp'

const execFileAsync = promisify(execFile)
const here = path.dirname(fileURLToPath(import.meta.url))
const WORKER = path.join(here, 'removeBackgroundWorker.js')

// Sprite canvas. The client upscales with `image-rendering: pixelated`, so we
// store a genuinely low-resolution sprite rather than a blurry large one.
export const SPRITE_WIDTH = 96
export const SPRITE_HEIGHT = 72

// Colour cap. Measured, not guessed: sharp only actually quantizes at low
// values here. At `colours: 32` a test sprite still came out with 49 distinct
// colours (no reduction at all); 16 reduces to ~14 and gives the flat banding
// that reads as 16-bit. Raising this back toward 32 silently disables it.
export const SPRITE_COLOURS = 16

const REMOVAL_TIMEOUT_MS = Number(process.env.BG_REMOVAL_TIMEOUT_MS || 60_000)

// Cheapest image model by default; override if you want a newer one. Image
// generation has no free tier, so this is billed per image.
const GEMINI_MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image'

const PROMPT = [
  'Redraw this photo of a die-cast toy car as a hand-drawn 16-bit pixel art game sprite.',
  'Do not simply pixelate or downscale the photo. Redraw it as clean sprite artwork.',
  'Requirements:',
  '- Side-on profile view, facing right, car centred and filling the frame.',
  '- Flat blocks of solid colour. No gradients, no photographic shading, no blur, no anti-aliasing.',
  '- A clear darker outline around the car body and around each wheel.',
  '- Simplify detail so it stays readable at small size: body, windows, wheels only. No text, no logos.',
  '- Keep the real body colour of the toy car so it is still recognisable.',
  '- Ignore any packaging, blister plastic, cardboard backing, printed artwork, hands or background. Draw only the physical toy car itself.',
  '- Place the sprite on a fully transparent background.',
  'Output only the image.',
].join('\n')

/**
 * Preferred stage 1: have Gemini genuinely redraw the photo as sprite art.
 * Resizing and colour reduction cannot produce drawn-looking pixel art from a
 * photograph, so this is the only step that achieves that style.
 */
export async function generatePixelArt(imageBuffer, mimeType = 'image/png') {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey || apiKey === 'placeholder_key') {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  const ai = new GoogleGenAI({ apiKey })
  const interaction = await ai.interactions.create({
    model: GEMINI_MODEL,
    input: [
      { type: 'text', text: PROMPT },
      { type: 'image', mime_type: mimeType, data: imageBuffer.toString('base64') },
    ],
  })

  const image = interaction?.output_image
  if (!image?.data) {
    throw new Error('Gemini returned no image')
  }
  return Buffer.from(image.data, 'base64')
}

/**
 * Fallback stage 1: strip the background locally. Free and offline, but it
 * only cuts the car out, it does not redraw it, so the result looks like a
 * pixelated photo rather than drawn sprite art.
 *
 * Runs in a child process because @imgly/background-removal-node pins an older
 * sharp; loading it in-process alongside our sharp crashes libvips.
 */
export async function removeCarBackground(imageBuffer) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'pixelrack-'))
  const inputPath = path.join(dir, `${crypto.randomUUID()}.png`)
  const outputPath = path.join(dir, `${crypto.randomUUID()}-cut.png`)

  try {
    await sharp(imageBuffer).png().toFile(inputPath)
    await execFileAsync(process.execPath, [WORKER, inputPath, outputPath], {
      timeout: REMOVAL_TIMEOUT_MS,
    })
    return await fs.readFile(outputPath)
  } finally {
    await fs.rm(dir, { recursive: true, force: true })
  }
}

/**
 * Stage 2, deterministic and independently testable: trim, fit to the sprite
 * canvas and cap the palette so every car lines up on the rack grid.
 *
 * `kernel` matters: Gemini output is already flat art, so nearest preserves
 * its hard edges. A photograph needs an averaging kernel instead, since
 * nearest samples single pixels and keeps camera noise.
 */
export async function quantizeToSprite(imageBuffer, { kernel = 'nearest' } = {}) {
  // Crop away the transparent margin first, otherwise the car keeps the
  // original framing and a distant shot renders as a few pixels.
  let source = imageBuffer
  try {
    source = await sharp(imageBuffer).trim({ threshold: 1 }).toBuffer()
  } catch {
    // trim throws when there is nothing to crop; the original is then correct.
  }

  return sharp(source)
    .resize(SPRITE_WIDTH, SPRITE_HEIGHT, {
      fit: 'contain',
      kernel,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ palette: true, colours: SPRITE_COLOURS, dither: 0 })
    .toBuffer()
}

/**
 * Full pipeline. Gemini redraws the car when configured; otherwise it falls
 * back to local background removal so the app still works without billing,
 * at lower visual quality. Returns the sprite plus which route produced it.
 */
export async function pixelateImage(imageBuffer, mimeType = 'image/png') {
  try {
    const drawn = await generatePixelArt(imageBuffer, mimeType)
    return { sprite: await quantizeToSprite(drawn, { kernel: 'nearest' }), source: 'gemini' }
  } catch (err) {
    // The SDK retries some failures (e.g. 429) and the retry can fail with an
    // opaque "TypeError: unusable" once the request body has been consumed,
    // masking the real cause. Log the full error and give the user a message
    // that points at the usual culprits rather than that noise.
    console.error('Gemini pixelation failed, using local fallback:', err)
    const opaque = /unusable|fetch failed/i.test(err.message ?? '')
    const reason = opaque
      ? 'Gemini call failed (check the API key and that billing/credits are active)'
      : err.message

    const cutout = await removeCarBackground(imageBuffer)
    return {
      sprite: await quantizeToSprite(cutout, { kernel: 'lanczos3' }),
      source: 'local',
      degradedReason: reason,
    }
  }
}
