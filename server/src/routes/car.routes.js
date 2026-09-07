import { Router } from 'express'
import {
  listCars,
  uploadCar,
  updateCar,
  deleteCar,
} from '../controllers/car.controller.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { upload } from '../middleware/upload.js'

const router = Router()

router.use(requireAuth)

router.get('/', listCars)
router.post('/upload', upload.single('image'), uploadCar)
router.patch('/:id', updateCar)
router.delete('/:id', deleteCar)

export default router
