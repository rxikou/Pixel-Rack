import { Router } from 'express'
import {
  listCars,
  uploadCar,
  updateCar,
  deleteCar,
} from '../controllers/car.controller.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { requirePixelation } from '../middleware/requirePixelation.js'
import { upload } from '../middleware/upload.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

const router = Router()

router.use(requireAuth)

router.get('/', asyncHandler(listCars))
// requirePixelation sits ahead of multer so a disabled build rejects the
// request without accepting the file at all.
router.post(
  '/upload',
  requirePixelation,
  upload.single('image'),
  asyncHandler(uploadCar),
)
router.patch('/:id', asyncHandler(updateCar))
router.delete('/:id', asyncHandler(deleteCar))

export default router
