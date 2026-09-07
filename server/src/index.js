import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import authRoutes from './routes/auth.routes.js'
import carRoutes from './routes/car.routes.js'
import environmentRoutes from './routes/environment.routes.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok' } })
})

app.use('/api/auth', authRoutes)
app.use('/api/cars', carRoutes)
app.use('/api/environments', environmentRoutes)

app.use(errorHandler)

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`PixelRack API listening on port ${port}`)
})

export default app
