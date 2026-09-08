import './lib/loadEnv.js'

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import cors from 'cors'

import userRoutes from './routes/user.routes.js'
import carRoutes from './routes/car.routes.js'
import environmentRoutes from './routes/environment.routes.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(cors())
app.use(express.json())

// Serves original uploads from local disk until cloud storage is wired up.
const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
app.use('/uploads', express.static(path.join(serverRoot, 'temp_uploads')))

app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok' } })
})

app.use('/api/users', userRoutes)
app.use('/api/cars', carRoutes)
app.use('/api/environments', environmentRoutes)

app.use(errorHandler)

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`PixelRack API listening on port ${port}`)
})

export default app
