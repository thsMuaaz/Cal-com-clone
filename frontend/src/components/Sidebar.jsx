import { NavLink, useLocation } from 'react-router-dom'
import { useTheme } from '../context/useTheme.js'
import { IconClock, IconInbox, IconLink, IconPhone, IconSettings } from './NavIcons.jsx'
import './Sidebar.css'

const scheduling = [
  { to: '/event-types', label: 'Event types', NavIcon: IconLink },
  { to: '/bookings', label: 'Bookings', NavIcon: IconInbox },
  { to: '/availability', label: 'Availability', NavIcon: IconClock },
  { to: '/call-history', label: 'Call history', NavIcon: IconPhone },
]

export function Sidebar() {
  const { theme, setTheme } = useTheme()
  const { pathname } = useLocation()

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__logo" aria-hidden />
        <div className="sidebar__brand-text">
          <span className="sidebar__name">Cal Scheduler</span>
          <span className="sidebar__tagline">Scheduling</span>
        </div>
      </div>

      <div className="sidebar__user cal-card">
        <div className="sidebar__user-avatar" aria-hidden>
          <span>AM</span>
        </div>
        <div className="sidebar__user-meta">
          <span className="sidebar__user-name">Alex Morgan</span>
          <span className="sidebar__user-email">you@example.com</span>
        </div>
      </div>

      <div className="sidebar__middle">
        <div className="sidebar__section">
          <span className="sidebar__section-label">Scheduling</span>
          <nav className="sidebar__nav" aria-label="Scheduling">
            {scheduling.map((item) => {
              const IconComp = item.NavIcon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
                  }
                >
                  <span className="sidebar__link-icon" aria-hidden>
                    <IconComp />
                  </span>
                  {item.label}
                </NavLink>
              )
            })}
          </nav>
        </div>

        <div className="sidebar__section">
          <span className="sidebar__section-label">Account</span>
          <nav className="sidebar__nav" aria-label="Account">
            <NavLink
              to="/settings/profile"
              className={() =>
                `sidebar__link${
                  pathname.startsWith('/settings') ? ' sidebar__link--active' : ''
                }`
              }
            >
              <span className="sidebar__link-icon" aria-hidden>
                <IconSettings />
              </span>
              Settings
            </NavLink>
          </nav>
        </div>
      </div>

      <div className="sidebar__theme" role="group" aria-label="Color theme">
        <span className="sidebar__theme-label" id="theme-label">
          Appearance
        </span>
        <div className="sidebar__theme-options">
          <button
            type="button"
            className={`sidebar__theme-btn${theme === 'light' ? ' sidebar__theme-btn--active' : ''}`}
            onClick={() => setTheme('light')}
            aria-pressed={theme === 'light'}
            aria-labelledby="theme-label"
          >
            <span className="sidebar__theme-icon" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            </span>
            Light
          </button>
          <button
            type="button"
            className={`sidebar__theme-btn${theme === 'dark' ? ' sidebar__theme-btn--active' : ''}`}
            onClick={() => setTheme('dark')}
            aria-pressed={theme === 'dark'}
            aria-labelledby="theme-label"
          >
            <span className="sidebar__theme-icon" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </span>
            Dark
          </button>
        </div>
      </div>
    </aside>
  )
}
