import { useState } from 'react'
import { Toggle } from '../../components/Toggle'
import './settingsPages.css'

export function SettingsOutOfOffice() {
  const [enabled, setEnabled] = useState(false)

  return (
    <div className="cal-set-page">
      <header className="cal-set-page__head">
        <h2 className="cal-set-page__title">Out of office</h2>
        <p className="cal-set-page__lead">Block your calendar and optionally send an auto-reply to bookers.</p>
      </header>

      <section className="cal-set-section cal-card">
        <div className="cal-set-row">
          <div>
            <h3 className="cal-set-section__title cal-set-section__title--inline">Out of office mode</h3>
            <p className="cal-set-section__desc">When on, new bookings won’t be accepted during the range below.</p>
          </div>
          <Toggle id="ooo-enabled" checked={enabled} onChange={setEnabled} label="" />
        </div>
        {enabled && (
          <div className="cal-set-field cal-set-mt">
            <label className="cal-set-label" htmlFor="ooo-msg">
              Message to bookers
            </label>
            <textarea
              id="ooo-msg"
              className="cal-set-input cal-set-textarea"
              rows={3}
              placeholder="I’m away until Jan 15 and will respond when I’m back."
            />
          </div>
        )}
      </section>

      <section className="cal-set-section cal-card">
        <h3 className="cal-set-section__title">Date range</h3>
        <div className="cal-set-inline-fields">
          <div className="cal-set-field">
            <label className="cal-set-label" htmlFor="ooo-start">
              Start
            </label>
            <input id="ooo-start" className="cal-set-input" type="date" />
          </div>
          <div className="cal-set-field">
            <label className="cal-set-label" htmlFor="ooo-end">
              End
            </label>
            <input id="ooo-end" className="cal-set-input" type="date" />
          </div>
        </div>
      </section>
    </div>
  )
}
