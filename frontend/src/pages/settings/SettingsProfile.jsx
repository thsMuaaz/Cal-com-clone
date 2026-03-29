import { useState } from 'react'
import { Toggle } from '../../components/Toggle'
import './settingsPages.css'

export function SettingsProfile() {
  const [weekStart, setWeekStart] = useState(true)

  return (
    <div className="cal-set-page">
      <header className="cal-set-page__head">
        <h2 className="cal-set-page__title">Profile</h2>
        <p className="cal-set-page__lead">Manage how you appear to bookers and your default preferences.</p>
      </header>

      <section className="cal-set-section cal-card">
        <h3 className="cal-set-section__title">Personal</h3>
        <div className="cal-set-field">
          <label className="cal-set-label" htmlFor="display-name">
            Display name
          </label>
          <input id="display-name" className="cal-set-input" type="text" defaultValue="Alex Morgan" />
          <p className="cal-set-hint">Shown on your booking page and in emails.</p>
        </div>
        <div className="cal-set-field">
          <label className="cal-set-label" htmlFor="email">
            Email
          </label>
          <input id="email" className="cal-set-input" type="email" defaultValue="you@example.com" />
        </div>
        <div className="cal-set-field">
          <label className="cal-set-label" htmlFor="tz">
            Time zone
          </label>
          <select id="tz" className="cal-set-input" defaultValue="Europe/London">
            <option value="Europe/London">Europe / London</option>
            <option value="America/New_York">America / New York</option>
            <option value="Asia/Tokyo">Asia / Tokyo</option>
          </select>
        </div>
      </section>

      <section className="cal-set-section cal-card">
        <div className="cal-set-row">
          <div>
            <h3 className="cal-set-section__title cal-set-section__title--inline">Start week on Monday</h3>
            <p className="cal-set-section__desc">Applies to calendars and availability views.</p>
          </div>
          <Toggle id="week-start" checked={weekStart} onChange={setWeekStart} label="" />
        </div>
      </section>

      <div className="cal-set-actions">
        <button type="button" className="btn btn--primary">
          Save changes
        </button>
      </div>
    </div>
  )
}
