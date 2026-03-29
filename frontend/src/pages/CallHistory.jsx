import { IconMic, IconVideo } from '../components/NavIcons'
import './CallHistory.css'

const MOCK_CALLS = [
  {
    id: '1',
    guest: 'Sarah Chen',
    event: '30 Min Meeting',
    callType: 'video',
    duration: '28 min',
    at: 'Mar 26, 2026 · 2:00 PM',
    status: 'Completed',
  },
  {
    id: '2',
    guest: 'Jordan Lee',
    event: '30 Min Meeting',
    callType: 'audio',
    duration: '30 min',
    at: 'Mar 24, 2026 · 10:30 AM',
    status: 'Completed',
  },
  {
    id: '3',
    guest: 'Priya Patel',
    event: 'Intro call',
    callType: 'video',
    duration: '15 min',
    at: 'Mar 22, 2026 · 4:15 PM',
    status: 'No-show',
  },
]

export function CallHistory() {
  return (
    <div className="page-call-history">
      <header className="page-call-history__header">
        <div>
          <h1 className="cal-page-title">Call history</h1>
          <p className="cal-page-desc">
            Past video and audio sessions from your bookings. Data is illustrative until call tracking is connected.
          </p>
        </div>
      </header>

      <div className="call-history-table-wrap cal-card">
        <table className="call-history-table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Event</th>
              <th>Type</th>
              <th>Duration</th>
              <th>When</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_CALLS.map((row) => (
              <tr key={row.id}>
                <td className="call-history-table__guest">{row.guest}</td>
                <td>{row.event}</td>
                <td>
                  <span
                    className={`call-history-type call-history-type--${row.callType}`}
                  >
                    {row.callType === 'video' ? (
                      <>
                        <IconVideo size={14} /> Video
                      </>
                    ) : (
                      <>
                        <IconMic size={14} /> Audio
                      </>
                    )}
                  </span>
                </td>
                <td>{row.duration}</td>
                <td className="call-history-table__muted">{row.at}</td>
                <td>
                  <span
                    className={`call-history-status call-history-status--${row.status === 'Completed' ? 'ok' : 'bad'}`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
