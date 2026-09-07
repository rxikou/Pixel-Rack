import { prisma } from '../lib/prisma.js'

export async function getProfile(req, res) {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } })
  if (!user) {
    return res.status(404).json({ success: false, error: 'Profile not found' })
  }
  res.json({ success: true, data: user })
}

export async function upsertProfile(req, res) {
  const { username } = req.body
  if (!username) {
    return res.status(400).json({ success: false, error: 'username is required' })
  }

  const user = await prisma.user.upsert({
    where: { id: req.user.id },
    update: { username },
    create: { id: req.user.id, email: req.user.email, username },
  })

  res.json({ success: true, data: user })
}
