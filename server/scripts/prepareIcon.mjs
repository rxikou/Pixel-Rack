/**
 * Turns a generated icon (pixel art on a flat white/magenta background) into a
 * trimmed, transparent PNG sized for the UI.
 *
 * Usage: node scripts/prepareIcon.mjs <input> <output> [size]
 *
 * Background removal is a flood fill from the image edges, NOT a global
 * "delete every white pixel". Several icons contain white or near-white
 * artwork (the rack icon has white cars, the house has cream walls), and a
 * global key would punch holes straight through them.
 */
import path from 'node:path'
import sharp from 'sharp'

const TOLERANCE = 32 // how far from the corner colour still counts as background

async function prepareIcon(inputPath, outputPath, size = 64) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height, channels } = info
  // Sample the corner: whatever colour the background actually is.
  const bg = [data[0], data[1], data[2]]

  const isBackground = (i) =>
    Math.abs(data[i] - bg[0]) <= TOLERANCE &&
    Math.abs(data[i + 1] - bg[1]) <= TOLERANCE &&
    Math.abs(data[i + 2] - bg[2]) <= TOLERANCE

  // Iterative flood fill from every border pixel.
  const seen = new Uint8Array(width * height)
  const stack = []
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
    data[p * channels + 3] = 0 // punch it transparent
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
  }

  const cleared = await sharp(data, { raw: { width, height, channels } })
    .png()
    .toBuffer()

  const info2 = await sharp(cleared)
    .trim({ threshold: 1 }) // crop to the artwork
    .resize(size, size, {
      fit: 'contain',
      kernel: 'nearest', // already pixel art: keep the hard edges
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(outputPath)

  return { transparentPixels: seen.reduce((a, b) => a + b, 0), out: info2 }
}

const [, , input, output, size] = process.argv
if (!input || !output) {
  console.error('Usage: node scripts/prepareIcon.mjs <input> <output> [size]')
  process.exit(2)
}

const result = await prepareIcon(input, output, Number(size) || 64)
console.log(
  `${path.basename(output)} -> ${result.out.width}x${result.out.height}, ` +
    `${result.transparentPixels} px cleared, ${result.out.size} bytes`,
)
