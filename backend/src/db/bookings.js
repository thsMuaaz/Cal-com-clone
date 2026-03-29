import { randomUUID } from 'node:crypto'
import { requirePool } from './pool.js'

export async function listBookingsEnriched() {
  const pool = requirePool()
  const { rows } = await pool.query(
    `SELECT
       b.id,
       b.event_type_id AS "eventTypeId",
       b.start_at AS start,
       b.guest_name AS "guestName",
       b.guest_email AS "guestEmail",
       b.created_at AS "createdAt",
       et.title AS "eventTitle",
       et.slug AS "eventSlug",
       et.duration_minutes AS "durationMinutes"
     FROM bookings b
     JOIN event_types et ON et.id = b.event_type_id
     ORDER BY b.start_at ASC`,
  )
  return rows.map((r) => ({
    id: r.id,
    eventTypeId: r.eventTypeId,
    start: new Date(r.start).toISOString(),
    guestName: r.guestName,
    guestEmail: r.guestEmail,
    createdAt: new Date(r.createdAt).toISOString(),
    eventTitle: r.eventTitle,
    eventSlug: r.eventSlug,
    durationMinutes: r.durationMinutes,
  }))
}

/**
 * True if any booking interval overlaps [startDate, endDate) (half-open).
 */
export async function hasOverlappingBooking(startDate, endDate) {
  const pool = requirePool()
  const { rows } = await pool.query(
    `SELECT 1
     FROM bookings b
     JOIN event_types et ON et.id = b.event_type_id
     WHERE b.start_at < $2
       AND b.start_at + (et.duration_minutes || ' minutes')::interval > $1
     LIMIT 1`,
    [startDate, endDate],
  )
  return rows.length > 0
}

export async function insertBookingEnriched({ eventTypeId, start, guestName, guestEmail }) {
  const pool = requirePool()
  const id = randomUUID()
  const { rows } = await pool.query(
    `WITH ins AS (
       INSERT INTO bookings (id, event_type_id, start_at, guest_name, guest_email)
       VALUES ($1, $2, $3::timestamptz, $4, $5)
       RETURNING id, event_type_id, start_at, guest_name, guest_email, created_at
     )
     SELECT
       ins.id,
       ins.event_type_id AS "eventTypeId",
       ins.start_at AS start,
       ins.guest_name AS "guestName",
       ins.guest_email AS "guestEmail",
       ins.created_at AS "createdAt",
       et.title AS "eventTitle",
       et.slug AS "eventSlug",
       et.duration_minutes AS "durationMinutes"
     FROM ins
     JOIN event_types et ON et.id = ins.event_type_id`,
    [id, eventTypeId, start, guestName, guestEmail],
  )
  const r = rows[0]
  return {
    id: r.id,
    eventTypeId: r.eventTypeId,
    start: new Date(r.start).toISOString(),
    guestName: r.guestName,
    guestEmail: r.guestEmail,
    createdAt: new Date(r.createdAt).toISOString(),
    eventTitle: r.eventTitle,
    eventSlug: r.eventSlug,
    durationMinutes: r.durationMinutes,
  }
}

/**
 * Booking intervals that overlap [dayStart, dayEnd) for slot blocking.
 */
export async function listBookingIntervalsOverlappingRange(dayStart, dayEnd) {
  const pool = requirePool()
  const { rows } = await pool.query(
    `SELECT b.start_at AS start, et.duration_minutes AS "durationMinutes"
     FROM bookings b
     JOIN event_types et ON et.id = b.event_type_id
     WHERE b.start_at < $2
       AND b.start_at + (et.duration_minutes || ' minutes')::interval > $1`,
    [dayStart, dayEnd],
  )
  return rows.map((r) => ({
    startMs: new Date(r.start).getTime(),
    durationMinutes: r.durationMinutes,
  }))
}
