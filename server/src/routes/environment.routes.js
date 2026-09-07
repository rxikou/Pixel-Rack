import { Router } from 'express'
import { listEnvironments } from '../controllers/environment.controller.js'

const router = Router()

router.get('/', listEnvironments)

export default router
