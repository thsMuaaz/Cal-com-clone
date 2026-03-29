import './TimeSlots.css'

/**
 * Vertical list of bookable time buttons (Cal.com-style).
 */
export function TimeSlots({ slots, selectedTime, onSelect, loading, emptyMessage }) {
  if (loading) {
    return (
      <div className="time-slots time-slots--loading" aria-busy="true" aria-label="Loading times">
        <p className="time-slots__label">Time</p>
        <div className="time-slots__skeleton" aria-hidden>
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="time-slots__skeleton-bar" />
          ))}
        </div>
        <p className="time-slots__hint time-slots__hint--loading">Finding open slots…</p>
      </div>
    )
  }

  if (!slots?.length) {
    return (
      <div className="time-slots">
        <p className="time-slots__hint">{emptyMessage ?? 'No times available'}</p>
      </div>
    )
  }

  return (
    <div className="time-slots">
      <p className="time-slots__label">Time</p>
      <ul className="time-slots__list" role="list">
        {slots.map((slot) => {
          const key = typeof slot === 'string' ? slot : slot.start ?? slot.time ?? String(slot)
          const label = typeof slot === 'string' ? slot : slot.label ?? slot.start ?? key
          const selected = selectedTime === key
          return (
            <li key={key}>
              <button
                type="button"
                className={`time-slots__btn${selected ? ' time-slots__btn--active' : ''}`}
                onClick={() => onSelect?.(slot)}
              >
                {label}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
