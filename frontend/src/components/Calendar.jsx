import { useMemo } from 'react'
import './Calendar.css'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function addMonths(d, n) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1)
}

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isToday(d) {
  const t = new Date()
  return sameDay(d, t)
}

/**
 * Month grid. `month` is any date within the visible month.
 * `onMonthChange` receives the first day of the new visible month.
 */
export function Calendar({ month, selectedDate, onSelectDate, onMonthChange, minDate }) {
  const view = startOfMonth(month ?? new Date())

  const { label, cells } = useMemo(() => {
    const first = view
    const year = first.getFullYear()
    const monthIndex = first.getMonth()
    const startWeekday = first.getDay()
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()

    const cells = []
    for (let i = 0; i < startWeekday; i++) {
      cells.push({ key: `pad-${i}`, day: null })
    }
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push({
        key: `${year}-${monthIndex}-${day}`,
        day: new Date(year, monthIndex, day),
      })
    }
    while (cells.length % 7 !== 0) {
      cells.push({ key: `trail-${cells.length}`, day: null })
    }

    const label = first.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    return { label, cells }
  }, [view])

  const min = minDate ? new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()) : null

  return (
    <div className="calendar">
      <div className="calendar__header">
        <button
          type="button"
          className="calendar__nav"
          aria-label="Previous month"
          onClick={() => onMonthChange?.(addMonths(view, -1))}
        >
          ‹
        </button>
        <span className="calendar__title">{label}</span>
        <button
          type="button"
          className="calendar__nav"
          aria-label="Next month"
          onClick={() => onMonthChange?.(addMonths(view, 1))}
        >
          ›
        </button>
      </div>
      <div className="calendar__weekdays" aria-hidden>
        {WEEKDAYS.map((w) => (
          <span key={w} className="calendar__weekday">
            {w}
          </span>
        ))}
      </div>
      <div className="calendar__grid" role="grid" aria-label="Calendar">
        {cells.map((c) => {
          if (!c.day) {
            return <div key={c.key} className="calendar__cell calendar__cell--empty" />
          }
          const disabled = min && c.day < min
          const selected = selectedDate && sameDay(c.day, selectedDate)
          const today = isToday(c.day)
          return (
            <button
              key={c.key}
              type="button"
              role="gridcell"
              disabled={disabled}
              className={[
                'calendar__cell',
                'calendar__day',
                today ? 'calendar__day--today' : '',
                selected ? 'calendar__day--selected' : '',
                disabled ? 'calendar__day--disabled' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => !disabled && onSelectDate?.(c.day)}
            >
              {c.day.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
