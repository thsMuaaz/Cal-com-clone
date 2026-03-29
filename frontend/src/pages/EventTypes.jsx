import { useCallback, useEffect, useState } from 'react'
import { apiJson } from '../api/client'
import { IconMic, IconVideo } from '../components/NavIcons.jsx'
import { Modal } from '../components/Modal'
import './EventTypes.css'

export function EventTypes() {
  const [modalOpen, setModalOpen] = useState(false)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    durationMinutes: 30,
    slug: '',
    description: '',
    callType: 'video',
  })

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiJson('/event-types')
      setItems(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e.message ?? 'Failed to load event types')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function handleCreate(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const body = {
        title: form.title.trim(),
        durationMinutes: Number(form.durationMinutes) || 30,
        description: form.description.trim(),
        callType: form.callType === 'audio' ? 'audio' : 'video',
      }
      if (form.slug.trim()) body.slug = form.slug.trim()
      await apiJson('/event-types', { method: 'POST', body })
      setModalOpen(false)
      setForm({ title: '', durationMinutes: 30, slug: '', description: '', callType: 'video' })
      await load()
    } catch (err) {
      setError(err.message ?? 'Could not create event type')
    } finally {
      setSaving(false)
    }
  }

  function copyLink(slug) {
    const url = `${window.location.origin}/book/${slug}`
    navigator.clipboard.writeText(url).catch(() => {})
  }

  return (
    <div className="page-event-types">
      <header className="page-event-types__header">
        <div>
          <h1 className="page-event-types__title cal-page-title">Event types</h1>
          <p className="page-event-types__subtitle cal-page-desc">
            Create event types with video or audio — same idea as Cal.com.
          </p>
        </div>
        <button type="button" className="btn btn--primary" onClick={() => setModalOpen(true)}>
          New event type
        </button>
      </header>

      {error && !modalOpen && <p className="muted" role="alert">{error}</p>}
      {loading ? (
        <p className="muted">Loading…</p>
      ) : (
        <section className="event-grid" aria-label="Event types">
          {items.map((et) => (
            <article key={et.id} className="event-card">
              <div className="event-card__top">
                <div className="event-card__badges">
                  <span className="event-card__badge">One-on-one</span>
                  <span
                    className={`cal-badge event-card__call${et.callType === 'audio' ? ' cal-badge--audio' : ' cal-badge--video'}`}
                  >
                    {et.callType === 'audio' ? (
                      <>
                        <IconMic size={14} /> Audio
                      </>
                    ) : (
                      <>
                        <IconVideo size={14} /> Video
                      </>
                    )}
                  </span>
                </div>
                <h2 className="event-card__title">{et.title}</h2>
                <p className="event-card__meta">{et.durationMinutes}m</p>
              </div>
              <p className="event-card__desc">{et.description || 'No description.'}</p>
              <div className="event-card__actions">
                <button type="button" className="btn btn--ghost" onClick={() => copyLink(et.slug)}>
                  Copy link
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New event type"
        footer={
          <>
            <button type="button" className="btn btn--ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" form="new-event-type-form" className="btn btn--primary" disabled={saving}>
              {saving ? 'Saving…' : 'Create'}
            </button>
          </>
        }
      >
        <form id="new-event-type-form" className="event-type-form" onSubmit={handleCreate}>
          {error && <p className="muted" role="alert">{error}</p>}
          <label className="event-type-form__field">
            <span>Title</span>
            <input
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="30 Min Meeting"
            />
          </label>
          <label className="event-type-form__field">
            <span>Duration (minutes)</span>
            <input
              type="number"
              min={5}
              max={1440}
              value={form.durationMinutes}
              onChange={(e) => setForm((f) => ({ ...f, durationMinutes: e.target.value }))}
            />
          </label>
          <div className="event-type-form__field">
            <span className="event-type-form__label-text">Location / call type</span>
            <div className="cal-segment" role="group" aria-label="Call type">
              <button
                type="button"
                className={`cal-segment__btn${form.callType === 'video' ? ' cal-segment__btn--active' : ''}`}
                onClick={() => setForm((f) => ({ ...f, callType: 'video' }))}
              >
                <IconVideo size={14} /> Video
              </button>
              <button
                type="button"
                className={`cal-segment__btn${form.callType === 'audio' ? ' cal-segment__btn--active' : ''}`}
                onClick={() => setForm((f) => ({ ...f, callType: 'audio' }))}
              >
                <IconMic size={14} /> Audio
              </button>
            </div>
            <p className="event-type-form__hint">Guests see this on the booking page.</p>
          </div>
          <label className="event-type-form__field">
            <span>URL slug (optional)</span>
            <input
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="my-meeting"
            />
          </label>
          <label className="event-type-form__field">
            <span>Description</span>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </label>
        </form>
      </Modal>
    </div>
  )
}
