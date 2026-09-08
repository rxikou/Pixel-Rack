import { prisma } from '../lib/prisma.js'

/** Every filled slot in a scene, with the car that occupies it. */
export async function listPlacements(req, res) {
  const environment = await prisma.environment.findUnique({
    where: { id: req.params.environmentId },
  })
  if (!environment) {
    return res.status(404).json({ success: false, error: 'Environment not found' })
  }

  const placements = await prisma.placement.findMany({
    where: { userId: req.user.id, environmentId: environment.id },
    include: { car: true },
    orderBy: { slotIndex: 'asc' },
  })

  res.json({
    success: true,
    data: { environment, placements },
  })
}

/**
 * Put a car in a slot, or clear the slot when carId is null.
 *
 * A car may only appear once per scene, so placing one that is already in
 * another slot moves it rather than duplicating it.
 */
export async function setPlacement(req, res) {
  const { environmentId } = req.params
  const slotIndex = Number(req.params.slotIndex)
  const carId = req.body?.carId ?? null

  const environment = await prisma.environment.findUnique({
    where: { id: environmentId },
  })
  if (!environment) {
    return res.status(404).json({ success: false, error: 'Environment not found' })
  }
  if (!Number.isInteger(slotIndex) || slotIndex < 0 || slotIndex >= environment.slots) {
    return res.status(400).json({
      success: false,
      error: `slotIndex must be between 0 and ${environment.slots - 1}`,
    })
  }

  if (carId === null) {
    await prisma.placement.deleteMany({
      where: { userId: req.user.id, environmentId, slotIndex },
    })
    return res.json({ success: true, data: { slotIndex, car: null } })
  }

  // Scoped by userId so a car belonging to someone else cannot be placed.
  const car = await prisma.car.findFirst({
    where: { id: carId, userId: req.user.id },
  })
  if (!car) {
    return res.status(404).json({ success: false, error: 'Car not found' })
  }

  const placement = await prisma.$transaction(async (tx) => {
    // Free the slot, and pull this car out of any other slot in this scene.
    await tx.placement.deleteMany({
      where: {
        userId: req.user.id,
        environmentId,
        OR: [{ slotIndex }, { carId }],
      },
    })
    return tx.placement.create({
      data: { userId: req.user.id, environmentId, slotIndex, carId },
      include: { car: true },
    })
  })

  res.json({ success: true, data: placement })
}
