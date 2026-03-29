import { Router } from 'express'
import { listBookingIntervalsOverlappingRange } from '../db/bookings.js'
import { getAvailability } from '../db/availability.js'
import { getEventTypeBySlug } from '../db/eventTypes.js'
import { formatSlotLabel, rangesOverlap, slotsForDay } from '../slots.js'

export const slotsRouter = Router()

slotsRouter.get('/', async (req, res, next) => {
  try {
    const { slug, date } = req.query
    if (!slug || !date) {
      return res.status(400).json({ error: 'Query params slug and date (YYYY-MM-DD) are required' })
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date))) {
      return res.status(400).json({ error: 'date must be YYYY-MM-DD' })
    }

    const availability = await getAvailability()
    if (!availability.weeklyEnabled) {
      return res.json({ slots: [] })
    }

    const et = await getEventTypeBySlug(slug)
    if (!et) return res.status(404).json({ error: 'Event type not found' })

    const [y, mo, d] = String(date).split('-').map((x) => parseInt(x, 10))
    const dayDate = new Date(y, mo - 1, d)
    if (Number.isNaN(dayDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date' })
    }

    const dow = dayDate.getDay()
    const dayConfig = availability.days[dow]
    const step = Math.min(30, et.durationMinutes)
    const candidates = slotsForDay(dayConfig, dayDate, step)

    const dayStart = new Date(y, mo - 1, d, 0, 0, 0, 0)
    const dayEnd = new Date(y, mo - 1, d + 1, 0, 0, 0, 0)
    const bookingIntervals = await listBookingIntervalsOverlappingRange(dayStart, dayEnd)

    const slots = []
    for (const slotStart of candidates) {
      const slotEnd = new Date(slotStart.getTime() + et.durationMinutes * 60 * 1000)
      let blocked = false
      for (const b of bookingIntervals) {
        const bs = b.startMs
        const be = bs + b.durationMinutes * 60 * 1000
        if (rangesOverlap(slotStart.getTime(), slotEnd.getTime(), bs, be)) {
          blocked = true
          break
        }
      }
      if (!blocked) {
        slots.push({
          label: formatSlotLabel(slotStart),
          start: slotStart.toISOString(),
        })
      }
    }

    const now = new Date()
    const filtered = slots.filter((s) => new Date(s.start).getTime() >= now.getTime() - 60 * 1000)

    res.json({ slots: filtered })
  } catch (e) {
    next(e)
  }
})
