import { createRemoteJWKSet, jwtVerify } from 'jose'

// Built lazily so the module can be imported before env vars are loaded.
let jwks = null

function getJwks() {
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(process.env.NEON_AUTH_JWKS_URL))
  }
  return jwks
}

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ success: false, error: 'Missing auth token' })
  }

  try {
    const { payload } = await jwtVerify(token, getJwks(), {
      issuer: new URL(process.env.NEON_AUTH_BASE_URL).origin,
    })
    req.user = { id: payload.sub, email: payload.email }
    next()
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired token' })
  }
}
