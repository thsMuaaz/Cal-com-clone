import { useState } from 'react'
import { Toggle } from '../../components/Toggle'
import './settingsPages.css'

export function SettingsFeatures() {
  const [buffer, setBuffer] = useState(false)
  const [huddle, setHuddle] = useState(true)

  return (
    <div className="cal-set-page">
      <header className="cal-set-page__head">
        <h2 className="cal-set-page__title">Features</h2>
        <p className="cal-set-page__lead">Optional scheduling enhancements (UI preview only).</p>
      </header>

      <section className="cal-set-section cal-card">
        <div className="cal-set-row">
          <div>
            <h3 className="cal-set-section__title cal-set-section__title--inline">Buffer time</h3>
            <p className="cal-set-section__desc">Add padding between consecutive meetings.</p>
          </div>
          <Toggle id="feat-buffer" checked={buffer} onChange={setBuffer} label="" />
        </div>
      </section>

      <section className="cal-set-section cal-card">
        <div className="cal-set-row">
          <div>
            <h3 className="cal-set-section__title cal-set-section__title--inline">Instant meeting links</h3>
            <p className="cal-set-section__desc">Generate a video room link for each booking.</p>
          </div>
          <Toggle id="feat-huddle" checked={huddle} onChange={setHuddle} label="" />
        </div>
      </section>
    </div>
  )
}
