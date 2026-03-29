import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import './AdminLayout.css'

export function AdminLayout() {
  const { pathname } = useLocation()

  return (
    <div className="admin-shell">
      <Sidebar />
      <main className="admin-main admin-main--enter" key={pathname}>
        <Outlet />
      </main>
    </div>
  )
}
