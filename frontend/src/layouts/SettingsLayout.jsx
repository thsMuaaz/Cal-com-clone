import { NavLink, Outlet } from 'react-router-dom'
import './SettingsLayout.css'

const items = [
  { to: '/settings/profile', label: 'Profile', desc: 'Name, photo, and bio' },
  { to: '/settings/calendars', label: 'Calendars', desc: 'Connected calendars' },
  { to: '/settings/features', label: 'Features', desc: 'Labs and preferences' },
  { to: '/settings/notifications', label: 'Notifications', desc: 'Push and email' },
  { to: '/settings/out-of-office', label: 'Out of office', desc: 'Auto-replies and blocks' },
]

export function SettingsLayout() {
  return (
    <div className="settings-shell">
      <aside className="settings-shell__aside" aria-label="Settings sections">
        <div className="settings-shell__aside-head">
          <h1 className="settings-shell__aside-title">Settings</h1>
          <p className="settings-shell__aside-sub">Manage your account and scheduling</p>
        </div>
        <nav className="settings-shell__nav">
          {items.map(({ to, label, desc }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `settings-nav-item${isActive ? ' settings-nav-item--active' : ''}`
              }
            >
              <span className="settings-nav-item__label">{label}</span>
              <span className="settings-nav-item__desc">{desc}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="settings-shell__main">
        <Outlet />
      </div>
    </div>
  )
}
