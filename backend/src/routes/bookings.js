import { Router } from 'express'
import { getEventTypeById } from '../db/eventTypes.js'
import { hasOverlappingBooking, insertBookingEnriched, listBookingsEnriched } from '../db/bookings.js'

export const bookingsRouter = Router()

bookingsRouter.get('/', async (req, res, next) => {
  try {
    const { upcoming } = req.query
    const now = Date.now()
    let list = await listBookingsEnriched()
    if (upcoming === 'true') list = list.filter((b) => new Date(b.start).getTime() >= now)
    if (upcoming === 'false') list = list.filter((b) => new Date(b.start).getTime() < now)
    list.sort((a, b) => new Date(a.start) - new Date(b.start))
    res.json(list)
  } catch (e) {
    next(e)
  }
})

bookingsRouter.post('/', async (req, res, next) => {
  try {
    const { eventTypeId, start, guestName, guestEmail } = req.body ?? {}
    if (!eventTypeId || !start || !guestName || !guestEmail) {
      return res.status(400).json({ error: 'eventTypeId, start, guestName, and guestEmail are required' })
    }
    const startDate = new Date(start)
    if (Number.isNaN(startDate.getTime())) {
      return res.status(400).json({ error: 'Invalid start datetime' })
    }
    const et = await getEventTypeById(eventTypeId)
    if (!et) return res.status(404).json({ error: 'Event type not found' })
    const end = new Date(startDate.getTime() + et.durationMinutes * 60 * 1000)
    const conflict = await hasOverlappingBooking(startDate, end)
    if (conflict) {
      return res.status(409).json({ error: 'Time slot no longer available' })
    }
    const created = await insertBookingEnriched({
      eventTypeId,
      start: startDate.toISOString(),
      guestName: String(guestName).trim(),
      guestEmail: String(guestEmail).trim(),
    })
    res.status(201).json(created)
  } catch (e) {
    next(e)
  }
})
