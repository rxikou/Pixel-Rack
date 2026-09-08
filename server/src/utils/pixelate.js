import { execFile } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import sharp from 'sharp'

const execFileAsync = promisify(execFile)
const here = path.dirname(fileURLToPath(import.meta.url))
const WORKER = path.join(here, 'removeBackgroundWorker.js')

// Target sprite resolution. Kept small on purpose: the client renders it with
// `image-rendering: pixelated`, so the browser does the crisp upscaling and we
// store a genuinely low-resolution sprite rather than a blurry large one.
export const SPRITE_WIDTH = 64
export const SPRITE_HEIGHT = 48

// Colour cap for the sprite. Measured, not guessed: sharp only actually
// quantizes at low values here. At `colours: 32` a test sprite still came out
// with 49 distinct colours (no reduction at all); at 16 it reduces to ~14 and
// produces the flat banding that reads as 16-bit. Raising this back toward 32
// silently disables the quantization.
export const SPRITE_COLOURS = 16

// Background removal is model inference on CPU; a few seconds is normal, but
// it must not be able to hang an upload request forever.
const REMOVAL_TIMEOUT_MS = Number(process.env.BG_REMOVAL_TIMEOUT_MS || 60_000)

/**
 * Stage 1: strip the photo background, leaving just the car on transparency.
 *
 * Runs in a child process because @imgly/background-removal-node pins an older
 * sharp; loading it in-process alongside our sharp crashes libvips.
 */
export async function removeCarBackground(imageBuffer) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'pixelrack-'))
  const inputPath = path.join(dir, `${crypto.randomUUID()}.png`)
  const outputPath = path.join(dir, `${crypto.randomUUID()}-cut.png`)

  try {
    // Normalise to PNG first so the worker always gets a format it can read.
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
 * Stage 2, deterministic and independently testable: downscale to the sprite
 * canvas with nearest-neighbour (no smoothing) and reduce to a limited palette.
 */
export async function quantizeToSprite(imageBuffer) {
  // Crop away the transparent margin left by background removal first.
  // Without this the car keeps the original photo's framing, so a car shot
  // from far away renders as a few pixels while a close-up fills the canvas.
  // Trimming normalises every car to fill the sprite consistently.
  let source = imageBuffer
  try {
    source = await sharp(imageBuffer).trim({ threshold: 1 }).toBuffer()
  } catch {
    // trim throws when there is nothing to crop (e.g. a fully uniform image);
    // falling back to the untrimmed buffer is correct in that case.
  }

  return sharp(source)
    .resize(SPRITE_WIDTH, SPRITE_HEIGHT, {
      fit: 'contain',
      kernel: 'nearest',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ palette: true, colours: SPRITE_COLOURS, dither: 0 })
    .toBuffer()
}

/**
 * Full pipeline: cut the car out of its photo, then lock it to a fixed sprite
 * canvas and limited palette so every car lines up on the rack grid.
 */
export async function pixelateImage(imageBuffer) {
  const cutout = await removeCarBackground(imageBuffer)
  return quantizeToSprite(cutout)
}
