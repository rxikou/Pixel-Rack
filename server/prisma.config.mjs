import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import { defineConfig, env } from 'prisma/config'

const here = path.dirname(fileURLToPath(import.meta.url))

// DATABASE_URL_UNPOOLED comes from the Neon-managed repo-root .env.local.
dotenv.config({ path: path.resolve(here, '..', '.env.local'), quiet: true })
dotenv.config({ path: path.resolve(here, '.env'), quiet: true })

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL_UNPOOLED'),
  },
})
