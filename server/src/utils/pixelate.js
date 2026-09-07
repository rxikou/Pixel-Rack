/**
 * Two-stage pixelation pipeline:
 * 1. Gemini normalizes background/angle/style from the source photo.
 * 2. sharp quantizes colors to the style.md palette and resizes to a fixed canvas.
 */
export async function pixelateImage(_imageBuffer) {
  throw new Error('Not implemented')
}
