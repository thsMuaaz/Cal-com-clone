import { useCallback, useEffect, useState } from 'react'
import { apiJson } from '../api/client'
import './Bookings.css'

function formatWhen(iso) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export function Bookings() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiJson('/bookings')
      setItems(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e.message ?? 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="page-bookings">
      <header className="page-bookings__header">
        <h1 className="page-bookings__title">Bookings</h1>
        <p className="page-bookings__subtitle">See upcoming and past events across your event types.</p>
      </header>

      {error && <p className="bookings-msg bookings-msg--error" role="alert">{error}</p>}
      {loading ? (
        <p className="bookings-msg">Loading…</p>
      ) : items.length === 0 ? (
        <div className="bookings-empty">
          <p>No bookings yet — they will appear here once guests schedule.</p>
        </div>
      ) : (
        <ul className="bookings-list" aria-label="Bookings">
          {items.map((b) => (
            <li key={b.id} className="bookings-row">
              <div>
                <strong>{b.eventTitle}</strong>
                <span className="bookings-row__meta">{formatWhen(b.start)} · {b.durationMinutes}m</span>
              </div>
              <div className="bookings-row__guest">
                {b.guestName} · {b.guestEmail}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
