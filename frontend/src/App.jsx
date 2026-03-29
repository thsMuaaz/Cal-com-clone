import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from './layouts/AdminLayout'
import { SettingsLayout } from './layouts/SettingsLayout'
import { Availability } from './pages/Availability'
import { BookingPage } from './pages/BookingPage'
import { Bookings } from './pages/Bookings'
import { CallHistory } from './pages/CallHistory'
import { EventTypes } from './pages/EventTypes'
import { SettingsCalendars } from './pages/settings/SettingsCalendars'
import { SettingsFeatures } from './pages/settings/SettingsFeatures'
import { SettingsNotifications } from './pages/settings/SettingsNotifications'
import { SettingsOutOfOffice } from './pages/settings/SettingsOutOfOffice'
import { SettingsProfile } from './pages/settings/SettingsProfile'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/book/:slug" element={<BookingPage />} />
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="event-types" replace />} />
          <Route path="event-types" element={<EventTypes />} />
          <Route path="availability" element={<Availability />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="call-history" element={<CallHistory />} />
          <Route path="settings" element={<SettingsLayout />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<SettingsProfile />} />
            <Route path="calendars" element={<SettingsCalendars />} />
            <Route path="features" element={<SettingsFeatures />} />
            <Route path="notifications" element={<SettingsNotifications />} />
            <Route path="out-of-office" element={<SettingsOutOfOffice />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/event-types" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
