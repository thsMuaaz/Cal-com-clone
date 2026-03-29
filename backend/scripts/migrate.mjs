import { config } from 'dotenv'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
config({ path: join(root, '.env') })

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('Set DATABASE_URL (e.g. in backend/.env)')
    process.exit(1)
  }
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
  try {
    const schema = await readFile(join(root, 'db', 'schema.sql'), 'utf8')
    await pool.query(schema)
    console.log('Schema applied successfully.')
    try {
      const patch = await readFile(join(root, 'db', 'patch_call_type.sql'), 'utf8')
      await pool.query(patch)
      console.log('Patch patch_call_type.sql applied.')
    } catch (e) {
      if (e.code !== 'ENOENT') throw e
    }
  } finally {
    await pool.end()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
