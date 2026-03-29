import './settingsPages.css'

export function SettingsCalendars() {
  return (
    <div className="cal-set-page">
      <header className="cal-set-page__head">
        <h2 className="cal-set-page__title">Calendars</h2>
        <p className="cal-set-page__lead">Connect calendars to check for conflicts and add events.</p>
      </header>

      <section className="cal-set-section cal-card">
        <h3 className="cal-set-section__title">Connected accounts</h3>
        <ul className="cal-set-list">
          <li className="cal-set-list__row">
            <div className="cal-set-list__icon cal-set-list__icon--g" aria-hidden>
              G
            </div>
            <div className="cal-set-list__body">
              <span className="cal-set-list__name">Google Calendar</span>
              <span className="cal-set-list__meta">Not connected</span>
            </div>
            <button type="button" className="btn btn--ghost btn--sm">
              Connect
            </button>
          </li>
          <li className="cal-set-list__row">
            <div className="cal-set-list__icon cal-set-list__icon--o" aria-hidden>
              O
            </div>
            <div className="cal-set-list__body">
              <span className="cal-set-list__name">Outlook Calendar</span>
              <span className="cal-set-list__meta">Not connected</span>
            </div>
            <button type="button" className="btn btn--ghost btn--sm">
              Connect
            </button>
          </li>
        </ul>
      </section>

      <section className="cal-set-section cal-card">
        <h3 className="cal-set-section__title">Add to calendar</h3>
        <p className="cal-set-section__desc">
          When a booking is created, we can add it to your primary calendar (coming soon).
        </p>
      </section>
    </div>
  )
}
