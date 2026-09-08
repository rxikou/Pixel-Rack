import { prisma } from '../lib/prisma.js'

export async function listEnvironments(req, res) {
  const environments = await prisma.environment.findMany({
    orderBy: { sortOrder: 'asc' },
  })
  res.json({ success: true, data: environments })
}
