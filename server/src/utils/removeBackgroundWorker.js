// Runs as its own process on purpose. @imgly/background-removal-node pins
// sharp ~0.32, and loading that alongside the server's sharp 0.35 puts two
// libvips builds in one process, which crashes with GLib type errors on
// Windows. Isolating it in a child process is what keeps both usable.
//
// Usage: node removeBackgroundWorker.js <inputPath> <outputPath>
import fs from 'node:fs/promises'
import { removeBackground } from '@imgly/background-removal-node'

const [, , inputPath, outputPath] = process.argv

if (!inputPath || !outputPath) {
  console.error('Usage: removeBackgroundWorker.js <input> <output>')
  process.exit(2)
}

try {
  const source = await fs.readFile(inputPath)
  // The MIME type is required; without it the library reports
  // "Unsupported format" and exits.
  const blob = await removeBackground(new Blob([source], { type: 'image/png' }))
  await fs.writeFile(outputPath, Buffer.from(await blob.arrayBuffer()))
  process.exit(0)
} catch (err) {
  console.error(err?.message ?? String(err))
  process.exit(1)
}
