import { Router } from 'express'
import {
  checkUsername,
  getProfile,
  upsertProfile,
} from '../controllers/user.controller.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

const router = Router()

// Public - must be registered before the requireAuth guard below.
router.get('/username-available', asyncHandler(checkUsername))

router.use(requireAuth)
router.get('/me', asyncHandler(getProfile))
router.put('/me', asyncHandler(upsertProfile))

export default router
