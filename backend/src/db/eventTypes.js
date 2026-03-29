import { requirePool } from './pool.js'

function mapRow(row) {
  const ct = row.call_type
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    durationMinutes: row.duration_minutes,
    description: row.description ?? '',
    callType: ct === 'audio' ? 'audio' : 'video',
  }
}

export async function listEventTypes() {
  const pool = requirePool()
  const { rows } = await pool.query(
    `SELECT id, title, slug, duration_minutes, description, call_type
     FROM event_types
     ORDER BY created_at ASC`,
  )
  return rows.map(mapRow)
}

export async function getEventTypeBySlug(slug) {
  const pool = requirePool()
  const { rows } = await pool.query(
    `SELECT id, title, slug, duration_minutes, description, call_type
     FROM event_types WHERE slug = $1`,
    [slug],
  )
  return rows[0] ? mapRow(rows[0]) : null
}

export async function getEventTypeById(id) {
  const pool = requirePool()
  const { rows } = await pool.query(
    `SELECT id, title, slug, duration_minutes, description, call_type
     FROM event_types WHERE id = $1`,
    [id],
  )
  return rows[0] ? mapRow(rows[0]) : null
}

export async function insertEventType({ id, title, slug, durationMinutes, description, callType }) {
  const pool = requirePool()
  const ct = callType === 'audio' ? 'audio' : 'video'
  const { rows } = await pool.query(
    `INSERT INTO event_types (id, title, slug, duration_minutes, description, call_type)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, title, slug, duration_minutes, description, call_type`,
    [id, title, slug, durationMinutes, description ?? '', ct],
  )
  return mapRow(rows[0])
}

export async function updateEventType(id, fields) {
  const pool = requirePool()
  const sets = []
  const vals = []
  let i = 1
  if (fields.title !== undefined) {
    sets.push(`title = $${i++}`)
    vals.push(fields.title)
  }
  if (fields.slug !== undefined) {
    sets.push(`slug = $${i++}`)
    vals.push(fields.slug)
  }
  if (fields.durationMinutes !== undefined) {
    sets.push(`duration_minutes = $${i++}`)
    vals.push(fields.durationMinutes)
  }
  if (fields.description !== undefined) {
    sets.push(`description = $${i++}`)
    vals.push(fields.description)
  }
  if (fields.callType !== undefined) {
    sets.push(`call_type = $${i++}`)
    vals.push(fields.callType === 'audio' ? 'audio' : 'video')
  }
  if (!sets.length) return getEventTypeById(id)
  vals.push(id)
  const { rows } = await pool.query(
    `UPDATE event_types SET ${sets.join(', ')}
     WHERE id = $${i}
     RETURNING id, title, slug, duration_minutes, description, call_type`,
    vals,
  )
  return rows[0] ? mapRow(rows[0]) : null
}

export async function deleteEventType(id) {
  const pool = requirePool()
  const { rowCount } = await pool.query(`DELETE FROM event_types WHERE id = $1`, [id])
  return rowCount > 0
}

export function isUniqueViolation(err) {
  return err?.code === '23505'
}
