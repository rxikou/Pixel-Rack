import { GoogleGenAI } from '@google/genai'
import sharp from 'sharp'

// Target sprite resolution. Kept small on purpose: the client renders it with
// `image-rendering: pixelated`, so the browser does the crisp upscaling and we
// store a genuinely low-resolution sprite rather than a blurry large one.
export const SPRITE_WIDTH = 64
export const SPRITE_HEIGHT = 48

// Number of colours the sprite is reduced to. This is what produces the flat,
// banded 16-bit look while still preserving each car's real hue.
export const SPRITE_COLOURS = 32

// Palette from style.md, handed to Gemini so generated sprites sit in the same
// visual family as the UI without forcing every car to those exact colours.
const STYLE_PALETTE = ['#0F172A', '#1E293B', '#38BDF8', '#F472B6', '#4ADE80', '#F8FAFC']

const PROMPT = [
  'Convert this photo of a die-cast toy car into a 16-bit retro pixel art sprite.',
  'Requirements:',
  '- Remove the background completely and output the car on a plain transparent or flat single-colour background.',
  '- Show the car in a clean side-on profile view, facing right, centred in frame.',
  '- Preserve the real body colour and recognisable details of the car.',
  '- Use hard-edged pixel blocks with no anti-aliasing, gradients, blur, or drop shadows.',
  '- Keep the sprite readable at small sizes; avoid fine detail and text.',
  `- Keep the overall style consistent with this UI palette: ${STYLE_PALETTE.join(', ')}.`,
  'Output only the image.',
].join('\n')

/**
 * Stage 2 of the pipeline, and deterministic on its own: downscale to the
 * sprite canvas with nearest-neighbour (no smoothing) and reduce to a limited
 * palette. Exported separately so it can be tested without calling Gemini.
 */
export async function quantizeToSprite(imageBuffer) {
  return sharp(imageBuffer)
    .resize(SPRITE_WIDTH, SPRITE_HEIGHT, {
      fit: 'contain',
      kernel: 'nearest',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ palette: true, colours: SPRITE_COLOURS, dither: 0 })
    .toBuffer()
}

/**
 * Stage 1: ask Gemini to normalise background, angle and style. Returns a PNG
 * buffer, or throws if the API is unavailable or returns no image.
 */
export async function generatePixelArt(imageBuffer, mimeType = 'image/png') {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey || apiKey === 'placeholder_key') {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  const ai = new GoogleGenAI({ apiKey })
  const interaction = await ai.interactions.create({
    model: process.env.GEMINI_IMAGE_MODEL || 'gemini-3.1-flash-image',
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
 * Full two-stage pipeline: Gemini normalises the photo, sharp locks the result
 * to a fixed sprite canvas and limited palette so every car lines up on the
 * rack grid regardless of how the AI framed it.
 */
export async function pixelateImage(imageBuffer, mimeType = 'image/png') {
  const generated = await generatePixelArt(imageBuffer, mimeType)
  return quantizeToSprite(generated)
}
