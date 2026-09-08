import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const here = path.dirname(fileURLToPath(import.meta.url))
const serverRoot = path.resolve(here, '../..')
const repoRoot = path.resolve(serverRoot, '..')

// DATABASE_URL and the NEON_AUTH_* values are managed by the Neon CLI in the
// repo-root .env.local, which `neon deploy` regenerates - never hand-edit it.
// Loaded first so it wins (dotenv does not overwrite already-set vars).
dotenv.config({ path: path.join(repoRoot, '.env.local'), quiet: true })

// App-specific settings (PORT, AWS_*, BG_REMOVAL_TIMEOUT_MS) live in server/.env.
dotenv.config({ path: path.join(serverRoot, '.env'), quiet: true })
