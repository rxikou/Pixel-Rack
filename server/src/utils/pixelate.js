import { execFile } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { GoogleGenAI } from '@google/genai'
import sharp from 'sharp'
import { generateWithCloudflare } from './providers/cloudflare.js'

const execFileAsync = promisify(execFile)
const here = path.dirname(fileURLToPath(import.meta.url))
const WORKER = path.join(here, 'removeBackgroundWorker.js')

// Sprite canvas. Generates a crisp, detailed 16-bit retro sprite
// that scales cleanly on the rack shelves and environment scenes.
export const SPRITE_WIDTH = 320
export const SPRITE_HEIGHT = 240

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
  'Redraw this photo of a die-cast toy car as a crisp 16-bit pixel art side-profile video game sprite.',
  'Do not downsample or filter the photo. Completely redraw the vehicle as clean, authentic retro pixel artwork.',
  'Strict visual requirements:',
  '- Orientation: Exact horizontal side-view profile (facing right). The car must be completely horizontal, centered, and fill the frame.',
  '- Scale & Framing: Render the car as large as possible, occupying 90% to 95% of the frame width so body panels and wheels are prominently visible.',
  '- Background: Place the car on a solid, pure plain white background (#FFFFFF) with absolutely zero shadows, zero reflections, and no ground plane or horizon lines under the wheels.',
  '- Art style: Flat solid color blocks, chunky dark outlines around the car body and wheels, no color gradients, no photographic textures, no blur, and no anti-aliasing.',
  '- Details: Simplify details to body panels, windows, headlights, and wheels. Eliminate fine text, license plates, and sponsor decals.',
  '- Color fidelity: Preserve the actual primary paint color and wheel rim color from the real die-cast car so the model is immediately recognizable.',
  '- Isolation: Ignore any packaging, plastic blister cards, cardboard graphics, fingers, tables, or photo backdrops. Draw only the isolated car.',
  'Output only the single isolated car image on a pure solid white background.',
].join('\n')

/**
 * Strips a solid background locally using border flood-fill.
 * Runs deterministically in Node on CPU to avoid spending extra AI credits.
 */
export async function stripBackgroundFloodFill(imageBuffer, tolerance = 48) {
  const { data, info } = await sharp(imageBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height, channels } = info
  // Sample top-left corner as reference background color
  const bg = [data[0], data[1], data[2]]

  const isBackground = (i) =>
    Math.abs(data[i] - bg[0]) <= tolerance &&
    Math.abs(data[i + 1] - bg[1]) <= tolerance &&
    Math.abs(data[i + 2] - bg[2]) <= tolerance

  const seen = new Uint8Array(width * height)
  const stack = []

  // Seed flood fill from all perimeter pixels
  for (let x = 0; x < width; x++) {
    stack.push([x, 0], [x, height - 1])
  }
  for (let y = 0; y < height; y++) {
    stack.push([0, y], [width - 1, y])
  }

  while (stack.length) {
    const [x, y] = stack.pop()
    if (x < 0 || y < 0 || x >= width || y >= height) continue
    const p = y * width + x
    if (seen[p]) continue
    if (!isBackground(p * channels)) continue
    seen[p] = 1
    data[p * channels + 3] = 0 // Punch transparent
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
  }

  return sharp(data, { raw: { width, height, channels } })
    .png()
    .toBuffer()
}

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
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [
      {
        role: 'user',
        parts: [
          { text: PROMPT },
          { inlineData: { mimeType, data: imageBuffer.toString('base64') } },
        ],
      },
    ],
    config: {
      responseModalities: ['IMAGE'],
    },
  })

  // The image part sits inside response.candidates[0].content.parts
  const parts = response?.candidates?.[0]?.content?.parts ?? []
  const imagePart = parts.find((p) => p.inlineData?.mimeType?.startsWith('image/'))
  if (!imagePart?.inlineData?.data) {
    throw new Error('Gemini returned no image')
  }
  return Buffer.from(imagePart.inlineData.data, 'base64')
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

  const sprite = await sharp(source)
    .resize(SPRITE_WIDTH, SPRITE_HEIGHT, {
      fit: 'contain',
      kernel,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ palette: true, colours: SPRITE_COLOURS, dither: 0 })
    .toBuffer()

  // Trim any excess transparent letterboxing so the car sprite fills its element
  // tightly without wasting vertical or horizontal space.
  try {
    return await sharp(sprite).trim({ threshold: 1 }).toBuffer()
  } catch {
    return sprite
  }
}

/**
 * Full pipeline. Gemini redraws the car when configured; otherwise it falls
 * back to local background removal so the app still works without billing,
 * at lower visual quality. Returns the sprite plus which route produced it.
 */
export async function pixelateImage(imageBuffer, mimeType = 'image/png') {
  // Defaults to Gemini for output quality; it is billed per image and needs
  // active credits. `cloudflare` swaps in free SD img2img, `local` forces the
  // no-redraw fallback. Any failure falls through to local so an upload is
  // never lost.
  const provider = (process.env.PIXELATION_PROVIDER || 'gemini').toLowerCase()

  try {
    if (provider === 'cloudflare') {
      const drawn = await generateWithCloudflare(imageBuffer)
      return {
        sprite: await quantizeToSprite(drawn, { kernel: 'nearest' }),
        source: 'cloudflare',
      }
    }
    if (provider === 'local') {
      throw new Error('PIXELATION_PROVIDER is set to local')
    }
    const drawn = await generatePixelArt(imageBuffer, mimeType)
    // Strip the solid background locally using flood fill without spending AI credits
    const transparentDrawn = await stripBackgroundFloodFill(drawn)
    return {
      sprite: await quantizeToSprite(transparentDrawn, { kernel: 'nearest' }),
      source: 'gemini',
    }
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
