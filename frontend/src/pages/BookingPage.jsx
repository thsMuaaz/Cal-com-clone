import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiJson } from '../api/client'
import { IconMic, IconVideo } from '../components/NavIcons.jsx'
import { Calendar } from '../components/Calendar'
import { TimeSlots } from '../components/TimeSlots'
import './BookingPage.css'

function toYmd(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function BookingPage() {
  const { slug } = useParams()
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [selectedTime, setSelectedTime] = useState(null)

  const [eventType, setEventType] = useState(null)
  const [slots, setSlots] = useState([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [pageError, setPageError] = useState(null)
  const [slotsError, setSlotsError] = useState(null)
  const [bookingError, setBookingError] = useState(null)
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [booking, setBooking] = useState(false)
  const [bookedMsg, setBookedMsg] = useState(null)

  const minDate = useMemo(() => {
    const t = new Date()
    return new Date(t.getFullYear(), t.getMonth(), t.getDate())
  }, [])

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    ;(async () => {
      setPageError(null)
      try {
        const et = await apiJson(`/event-types/slug/${encodeURIComponent(slug)}`)
        if (!cancelled) setEventType(et)
      } catch (e) {
        if (!cancelled) setPageError(e.message ?? 'Event not found')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug])

  const loadSlots = useCallback(async () => {
    if (!slug || !eventType) return
    setSlotsLoading(true)
    setSlotsError(null)
    setBookedMsg(null)
    setBookingError(null)
    try {
      const dateStr = toYmd(selectedDate)
      const q = new URLSearchParams({ slug, date: dateStr })
      const data = await apiJson(`/slots?${q.toString()}`)
      const list = Array.isArray(data?.slots) ? data.slots : []
      setSlots(list)
      setSelectedTime(null)
    } catch (e) {
      setSlots([])
      setSlotsError(e.message ?? 'Could not load times')
    } finally {
      setSlotsLoading(false)
    }
  }, [slug, eventType, selectedDate])

  useEffect(() => {
    loadSlots()
  }, [loadSlots])

  async function handleBook(e) {
    e.preventDefault()
    if (!eventType || !selectedTime) return
    const start = typeof selectedTime === 'object' && selectedTime?.start ? selectedTime.start : null
    if (!start) return
    setBooking(true)
    setBookedMsg(null)
    setBookingError(null)
    try {
      await apiJson('/bookings', {
        method: 'POST',
        body: {
          eventTypeId: eventType.id,
          start,
          guestName: guestName.trim(),
          guestEmail: guestEmail.trim(),
        },
      })
      setBookedMsg("You're booked — check your email for details.")
      await loadSlots()
    } catch (err) {
      setBookedMsg(null)
      setBookingError(err.message ?? 'Booking failed')
    } finally {
      setBooking(false)
    }
  }

  if (pageError) {
    return (
      <div className="booking-page">
        <div className="booking-page__inner booking-page__inner--narrow">
          <p className="booking-page__error" role="alert">{pageError}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="booking-page">
      <div className="booking-page__inner">
        <section className="booking-page__col booking-page__col--info booking-page__col--animate">
          <div className="booking-host">
            <div className="booking-host__avatar" aria-hidden />
            <p className="booking-host__name">Host</p>
          </div>
          <h1 className="booking-page__title">{eventType?.title ?? 'Loading…'}</h1>
          {eventType && (
            <p className="booking-page__call-row">
              <span
                className={`cal-badge booking-page__call-badge${eventType.callType === 'audio' ? ' cal-badge--audio' : ' cal-badge--video'}`}
              >
                {eventType.callType === 'audio' ? (
                  <>
                    <IconMic size={14} /> Audio call
                  </>
                ) : (
                  <>
                    <IconVideo size={14} /> Video call
                  </>
                )}
              </span>
            </p>
          )}
          <p className="booking-page__meta">{eventType ? `${eventType.durationMinutes}m` : '—'}</p>
          <p className="booking-page__slug">
            Event: <code>{slug ?? '…'}</code>
          </p>
          <p className="booking-page__desc">
            {eventType?.description || 'Pick a time that works for you.'}
          </p>
        </section>

        <section
          className="booking-page__col booking-page__col--calendar booking-page__col--animate"
          aria-label="Pick a date"
        >
          <Calendar
            month={viewMonth}
            onMonthChange={setViewMonth}
            selectedDate={selectedDate}
            onSelectDate={(d) => {
              setSelectedDate(d)
              setSelectedTime(null)
            }}
            minDate={minDate}
          />
        </section>

        <section
          className="booking-page__col booking-page__col--slots booking-page__col--animate"
          aria-label="Pick a time"
        >
          <TimeSlots
            slots={slots}
            selectedTime={
              selectedTime && typeof selectedTime === 'object'
                ? selectedTime.start
                : selectedTime
            }
            onSelect={(slot) => setSelectedTime(slot)}
            loading={slotsLoading}
            emptyMessage={slotsError || 'No times available'}
          />
          {bookingError && (
            <p className="booking-page__inline-error" role="alert">{bookingError}</p>
          )}

          {eventType && (
            <form className="booking-form" onSubmit={handleBook}>
              <label className="booking-form__field">
                <span>Name</span>
                <input
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  autoComplete="name"
                />
              </label>
              <label className="booking-form__field">
                <span>Email</span>
                <input
                  required
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  autoComplete="email"
                />
              </label>
              <button
                type="submit"
                className="booking-form__submit"
                disabled={booking || !selectedTime}
              >
                {booking ? 'Booking…' : 'Confirm'}
              </button>
              {bookedMsg && <p className="booking-form__success">{bookedMsg}</p>}
            </form>
          )}
        </section>
      </div>
    </div>
  )
}
