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

// CORS_ORIGINS is a comma separated allowlist of the sites allowed to call
// this API, e.g. "https://pixelrack.vercel.app". Left unset it allows any
// origin, which is fine locally but should always be set on a deployment.
const allowedOrigins = (process.env.CORS_ORIGINS ?? '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

app.use(
  cors({
    origin(origin, callback) {
      // No Origin header means a same-origin or non-browser caller (curl, a
      // health check), which CORS does not apply to.
      if (!origin || allowedOrigins.length === 0) return callback(null, true)
      callback(null, allowedOrigins.includes(origin))
    },
  }),
)
app.use(express.json())

// Serves original uploads from local disk until cloud storage is wired up.
const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
app.use('/uploads', express.static(path.join(serverRoot, 'temp_uploads')))

app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok' } })
})

// Which optional features this deployment has switched on. The client reads
// this rather than keeping its own copy of the flag, so the two cannot drift
// and promise something the API will refuse.
app.get('/api/config', (req, res) => {
  res.json({
    success: true,
    data: { pixelationEnabled: process.env.PIXELATION_ENABLED === 'true' },
  })
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
