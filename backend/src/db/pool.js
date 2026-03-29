import { config } from 'dotenv'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const backendRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
config({ path: join(backendRoot, '.env') })

const connectionString = process.env.DATABASE_URL

export const pool = connectionString
  ? new pg.Pool({
      connectionString,
      max: 10,
    })
  : null

export function requirePool() {
  if (!pool) {
    throw new Error('DATABASE_URL is not set. Configure PostgreSQL and run db:migrate.')
  }
  return pool
}
