import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import {
  deleteEventType,
  getEventTypeById,
  getEventTypeBySlug,
  insertEventType,
  isUniqueViolation,
  listEventTypes,
  updateEventType,
} from '../db/eventTypes.js'

export const eventTypesRouter = Router()

function slugify(s) {
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'event'
}

eventTypesRouter.get('/', async (_req, res, next) => {
  try {
    const items = await listEventTypes()
    res.json(items)
  } catch (e) {
    next(e)
  }
})

eventTypesRouter.get('/slug/:slug', async (req, res, next) => {
  try {
    const found = await getEventTypeBySlug(req.params.slug)
    if (!found) return res.status(404).json({ error: 'Event type not found' })
    res.json(found)
  } catch (e) {
    next(e)
  }
})

eventTypesRouter.post('/', async (req, res, next) => {
  try {
    const { title, slug, durationMinutes, description, callType } = req.body ?? {}
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'title is required' })
    }
    const dur = Number(durationMinutes)
    if (!Number.isFinite(dur) || dur < 5 || dur > 24 * 60) {
      return res.status(400).json({ error: 'durationMinutes must be between 5 and 1440' })
    }
    if (callType !== undefined && callType !== 'audio' && callType !== 'video') {
      return res.status(400).json({ error: 'callType must be audio or video' })
    }
    const finalSlug = slug ? slugify(slug) : slugify(title)
    const existing = await getEventTypeBySlug(finalSlug)
    if (existing) return res.status(409).json({ error: 'Slug already exists' })
    const created = await insertEventType({
      id: randomUUID(),
      title: title.trim(),
      slug: finalSlug,
      durationMinutes: Math.round(dur),
      description: typeof description === 'string' ? description.trim() : '',
      callType: callType === 'audio' ? 'audio' : 'video',
    })
    res.status(201).json(created)
  } catch (e) {
    if (isUniqueViolation(e)) return res.status(409).json({ error: 'Slug already exists' })
    next(e)
  }
})

eventTypesRouter.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, slug, durationMinutes, description, callType } = req.body ?? {}
    const current = await getEventTypeById(id)
    if (!current) return res.status(404).json({ error: 'Not found' })
    const fields = {}
    if (title !== undefined) fields.title = String(title).trim()
    if (slug !== undefined) fields.slug = slugify(slug)
    if (durationMinutes !== undefined) {
      const dur = Number(durationMinutes)
      if (!Number.isFinite(dur) || dur < 5 || dur > 24 * 60) {
        return res.status(400).json({ error: 'Invalid duration' })
      }
      fields.durationMinutes = Math.round(dur)
    }
    if (description !== undefined) fields.description = String(description).trim()
    if (callType !== undefined) {
      if (callType !== 'audio' && callType !== 'video') {
        return res.status(400).json({ error: 'callType must be audio or video' })
      }
      fields.callType = callType
    }
    if (fields.slug !== undefined) {
      const clash = await getEventTypeBySlug(fields.slug)
      if (clash && clash.id !== id) return res.status(409).json({ error: 'Slug already exists' })
    }
    let updated
    try {
      updated = await updateEventType(id, fields)
    } catch (e) {
      if (isUniqueViolation(e)) return res.status(409).json({ error: 'Slug already exists' })
      throw e
    }
    if (!updated) return res.status(404).json({ error: 'Not found' })
    res.json(updated)
  } catch (e) {
    next(e)
  }
})

eventTypesRouter.delete('/:id', async (req, res, next) => {
  try {
    const ok = await deleteEventType(req.params.id)
    if (!ok) return res.status(404).json({ error: 'Not found' })
    res.status(204).end()
  } catch (e) {
    next(e)
  }
})
