import { Router } from 'express'
import { getAvailability, patchAvailability } from '../db/availability.js'

export const availabilityRouter = Router()

function validateDays(days) {
  if (!Array.isArray(days) || days.length !== 7) return false
  return days.every((day) => {
    if (typeof day?.enabled !== 'boolean' || !Array.isArray(day.ranges)) return false
    return day.ranges.every(
      (r) =>
        r &&
        typeof r.start === 'string' &&
        typeof r.end === 'string' &&
        /^\d{1,2}:\d{2}$/.test(r.start) &&
        /^\d{1,2}:\d{2}$/.test(r.end),
    )
  })
}

availabilityRouter.get('/', async (_req, res, next) => {
  try {
    const data = await getAvailability()
    res.json(data)
  } catch (e) {
    next(e)
  }
})

availabilityRouter.patch('/', async (req, res, next) => {
  try {
    const { weeklyEnabled, days } = req.body ?? {}
    if (weeklyEnabled !== undefined && typeof weeklyEnabled !== 'boolean') {
      return res.status(400).json({ error: 'weeklyEnabled must be a boolean' })
    }
    if (days !== undefined && !validateDays(days)) {
      return res.status(400).json({ error: 'days must be an array of 7 { enabled, ranges: [{start,end}] }' })
    }
    const out = await patchAvailability({ weeklyEnabled, days })
    res.json(out)
  } catch (e) {
    next(e)
  }
})
