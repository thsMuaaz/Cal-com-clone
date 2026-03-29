import { useState } from 'react'
import { Toggle } from '../../components/Toggle'
import './settingsPages.css'

export function SettingsNotifications() {
  const [push, setPush] = useState(true)
  const [emailBook, setEmailBook] = useState(true)
  const [emailRemind, setEmailRemind] = useState(false)

  return (
    <div className="cal-set-page">
      <header className="cal-set-page__head">
        <h2 className="cal-set-page__title">Notifications</h2>
        <p className="cal-set-page__lead">Choose how you get updates about bookings and reminders.</p>
      </header>

      <section className="cal-set-section cal-card">
        <h3 className="cal-set-section__title">Push notifications</h3>
        <div className="cal-set-row">
          <div>
            <p className="cal-set-section__desc">Browser notifications for new bookings and changes.</p>
          </div>
          <Toggle id="notif-push" checked={push} onChange={setPush} label="" />
        </div>
        <button type="button" className="btn btn--ghost btn--sm cal-set-mt">
          Enable in browser
        </button>
      </section>

      <section className="cal-set-section cal-card">
        <h3 className="cal-set-section__title">Email</h3>
        <div className="cal-set-row">
          <div>
            <span className="cal-set-inline-title">Booking confirmations</span>
            <p className="cal-set-section__desc">When someone books a time with you.</p>
          </div>
          <Toggle id="notif-email-book" checked={emailBook} onChange={setEmailBook} label="" />
        </div>
        <div className="cal-set-row cal-set-row--border">
          <div>
            <span className="cal-set-inline-title">24h reminders</span>
            <p className="cal-set-section__desc">Send you and guests a reminder before the event.</p>
          </div>
          <Toggle id="notif-email-remind" checked={emailRemind} onChange={setEmailRemind} label="" />
        </div>
      </section>
    </div>
  )
}
