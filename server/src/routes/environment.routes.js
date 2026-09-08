import { Router } from 'express'
import { listEnvironments } from '../controllers/environment.controller.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

const router = Router()

router.get('/', asyncHandler(listEnvironments))

export default router
