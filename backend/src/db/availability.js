import { requirePool } from './pool.js'

export async function getAvailability() {
  const pool = requirePool()
  const { rows } = await pool.query(
    `SELECT weekly_enabled, days FROM availability_settings WHERE id = 1`,
  )
  if (!rows[0]) {
    return {
      weeklyEnabled: true,
      days: Array.from({ length: 7 }, () => ({ enabled: false, ranges: [] })),
    }
  }
  const row = rows[0]
  const days = Array.isArray(row.days) ? row.days : JSON.parse(JSON.stringify(row.days))
  return {
    weeklyEnabled: row.weekly_enabled,
    days,
  }
}

export async function patchAvailability({ weeklyEnabled, days }) {
  const pool = requirePool()
  const current = await getAvailability()
  const next = {
    weeklyEnabled: weeklyEnabled !== undefined ? weeklyEnabled : current.weeklyEnabled,
    days: days !== undefined ? days : current.days,
  }
  await pool.query(`UPDATE availability_settings SET weekly_enabled = $1, days = $2::jsonb WHERE id = 1`, [
    next.weeklyEnabled,
    JSON.stringify(next.days),
  ])
  return next
}
