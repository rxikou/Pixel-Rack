import { prisma } from '../lib/prisma.js'

// Public: lets the client check a username before it creates an auth account,
// so a taken name cannot strand a user with credentials but no profile.
export async function checkUsername(req, res) {
  const username = String(req.query.username ?? '').trim()
  if (!username) {
    return res
      .status(400)
      .json({ success: false, error: 'username query param is required' })
  }

  const existing = await prisma.user.findUnique({ where: { username } })
  res.json({ success: true, data: { available: !existing } })
}

export async function getProfile(req, res) {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } })
  if (!user) {
    return res.status(404).json({ success: false, error: 'Profile not found' })
  }
  res.json({ success: true, data: user })
}

export async function upsertProfile(req, res) {
  const username = String(req.body?.username ?? '').trim()
  if (!username) {
    return res.status(400).json({ success: false, error: 'username is required' })
  }

  try {
    const user = await prisma.user.upsert({
      where: { id: req.user.id },
      update: { username },
      create: { id: req.user.id, email: req.user.email, username },
    })
    res.json({ success: true, data: user })
  } catch (err) {
    // P2002 = unique constraint violation (username or email already taken).
    if (err.code === 'P2002') {
      return res
        .status(409)
        .json({ success: false, error: 'That username is already taken' })
    }
    throw err
  }
}
