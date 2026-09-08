import fs from 'node:fs/promises'
import path from 'node:path'
import { prisma } from '../lib/prisma.js'
import { pixelateImage } from '../utils/pixelate.js'

export async function listCars(req, res) {
  const cars = await prisma.car.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'asc' },
  })
  res.json({ success: true, data: cars })
}

export async function uploadCar(req, res) {
  const name = String(req.body?.name ?? '').trim()
  const series = String(req.body?.series ?? '').trim()

  if (!name) {
    return res.status(400).json({ success: false, error: 'name is required' })
  }
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, error: 'An image file is required' })
  }

  // The original is kept on local disk for now; cloud storage (S3/Cloudinary)
  // is still pending.
  let pixelImageUrl = null
  let pixelationError = null

  try {
    const original = await fs.readFile(req.file.path)
    const { sprite, source, degradedReason } = await pixelateImage(
      original,
      req.file.mimetype,
    )
    const spriteName = `${req.file.filename}-sprite.png`
    await fs.writeFile(path.join(path.dirname(req.file.path), spriteName), sprite)
    pixelImageUrl = `/uploads/${spriteName}`

    // Gemini redraws the car; the local fallback only cuts the background out,
    // so say when the lower-quality route was used instead of failing silently.
    if (source === 'local') {
      pixelationError = `Used the free local fallback (lower quality): ${degradedReason}`
    }
  } catch (err) {
    // Deliberately non-fatal: losing the user's upload because the AI step
    // failed would be worse than saving the car with a placeholder sprite,
    // which the client already renders. Surfaced so the client can say so.
    pixelationError = err.message
    console.error('Pixelation failed:', err.message)
  }

  const car = await prisma.car.create({
    data: {
      userId: req.user.id,
      name,
      series: series || null,
      originalImageUrl: `/uploads/${req.file.filename}`,
      pixelImageUrl,
    },
  })

  res.status(201).json({ success: true, data: { ...car, pixelationError } })
}

export async function updateCar(req, res) {
  const { name, series } = req.body ?? {}

  const data = {}
  if (name !== undefined) {
    const trimmed = String(name).trim()
    if (!trimmed) {
      return res
        .status(400)
        .json({ success: false, error: 'name cannot be empty' })
    }
    data.name = trimmed
  }
  if (series !== undefined) {
    const trimmed = String(series).trim()
    data.series = trimmed || null
  }

  if (Object.keys(data).length === 0) {
    return res
      .status(400)
      .json({ success: false, error: 'Nothing to update' })
  }

  // Scoped by userId so one user cannot edit another user's car.
  const { count } = await prisma.car.updateMany({
    where: { id: req.params.id, userId: req.user.id },
    data,
  })
  if (count === 0) {
    return res.status(404).json({ success: false, error: 'Car not found' })
  }

  const car = await prisma.car.findUnique({ where: { id: req.params.id } })
  res.json({ success: true, data: car })
}

export async function deleteCar(req, res) {
  const { count } = await prisma.car.deleteMany({
    where: { id: req.params.id, userId: req.user.id },
  })
  if (count === 0) {
    return res.status(404).json({ success: false, error: 'Car not found' })
  }
  res.json({ success: true, data: { id: req.params.id } })
}
