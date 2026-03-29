import { useCallback, useEffect, useState } from 'react'
import { apiJson } from '../api/client'
import { Toggle } from '../components/Toggle'
import './Availability.css'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function formatRanges(ranges) {
  if (!ranges?.length) return 'Unavailable'
  return ranges.map((r) => `${r.start} – ${r.end}`).join(', ')
}

export function Availability() {
  const [weeklyEnabled, setWeeklyEnabled] = useState(true)
  const [days, setDays] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiJson('/availability')
      setWeeklyEnabled(Boolean(data.weeklyEnabled))
      setDays(Array.isArray(data.days) ? data.days : [])
    } catch (e) {
      setError(e.message ?? 'Failed to load availability')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function handleToggle(next) {
    setWeeklyEnabled(next)
    setError(null)
    try {
      await apiJson('/availability', {
        method: 'PATCH',
        body: { weeklyEnabled: next },
      })
    } catch (e) {
      setError(e.message ?? 'Could not update')
      setWeeklyEnabled(!next)
    }
  }

  return (
    <div className="page-availability">
      <header className="page-availability__header">
        <h1 className="page-availability__title">Availability</h1>
        <p className="page-availability__subtitle">
          Configure times when you are available for bookings.
        </p>
      </header>

      {error && <p className="availability-banner" role="alert">{error}</p>}
      {loading ? (
        <p className="muted">Loading…</p>
      ) : (
        <section className="availability-card" aria-label="Weekly hours">
          <div className="availability-card__head">
            <span className="availability-card__head-title">Weekly hours</span>
            <Toggle
              id="avail-toggle"
              label="Enabled"
              checked={weeklyEnabled}
              onChange={handleToggle}
            />
          </div>
          <ul className="availability-list">
            {DAYS.map((day, i) => {
              const cfg = days?.[i]
              return (
                <li key={day} className="availability-row">
                  <span className="availability-row__day">{day}</span>
                  <span className="availability-row__slots">
                    <span className="availability-chip availability-chip--readonly">
                      {cfg?.enabled ? formatRanges(cfg.ranges) : 'Unavailable'}
                    </span>
                  </span>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </div>
  )
}
