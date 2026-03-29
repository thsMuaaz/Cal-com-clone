import cors from 'cors'
import express from 'express'
import { pool } from './db/pool.js'
import { availabilityRouter } from './routes/availability.js'
import { bookingsRouter } from './routes/bookings.js'
import { eventTypesRouter } from './routes/eventTypes.js'
import { slotsRouter } from './routes/slots.js'

if (!pool) {
  console.error('DATABASE_URL is required. Create backend/.env with your PostgreSQL connection string.')
  process.exit(1)
}

const app = express()
const PORT = Number(process.env.PORT) || 3000

app.use(
  cors({
    origin: [/localhost:\d+$/],
  }),
)
app.use(express.json())

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ ok: true, db: true })
  } catch (e) {
    console.error(e)
    res.status(503).json({ ok: false, db: false, error: 'Database unreachable' })
  }
})

app.use('/api/event-types', eventTypesRouter)
app.use('/api/availability', availabilityRouter)
app.use('/api/bookings', bookingsRouter)
app.use('/api/slots', slotsRouter)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: err.message ?? 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
