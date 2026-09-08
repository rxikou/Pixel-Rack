import { Router } from 'express'
import { listEnvironments } from '../controllers/environment.controller.js'
import {
  listPlacements,
  setPlacement,
} from '../controllers/placement.controller.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

const router = Router()

// Public: the environment list is the same for everyone.
router.get('/', asyncHandler(listEnvironments))

// Placements belong to a user, so everything below needs auth.
router.get('/:environmentId/placements', requireAuth, asyncHandler(listPlacements))
router.put(
  '/:environmentId/placements/:slotIndex',
  requireAuth,
  asyncHandler(setPlacement),
)

export default router
