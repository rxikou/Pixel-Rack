import '../src/lib/loadEnv.js'
import { prisma } from '../src/lib/prisma.js'

// Ids are stable strings, not UUIDs: the client maps them to a scene renderer.
const environments = [
  { id: 'rack', name: 'Wooden Rack', isPremium: false, sortOrder: 1 },
  { id: 'garage', name: 'Virtual Garage', isPremium: false, sortOrder: 2 },
  { id: 'konbini', name: '7-11 Japan', isPremium: true, sortOrder: 3 },
]

async function main() {
  for (const env of environments) {
    await prisma.environment.upsert({
      where: { id: env.id },
      update: { name: env.name, isPremium: env.isPremium, sortOrder: env.sortOrder },
      create: env,
    })
  }
  console.log(`Seeded ${environments.length} environments.`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
