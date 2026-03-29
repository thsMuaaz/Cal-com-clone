-- Cal clone schema (PostgreSQL)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS event_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  duration_minutes INT NOT NULL CHECK (duration_minutes >= 5 AND duration_minutes <= 1440),
  description TEXT NOT NULL DEFAULT '',
  call_type TEXT NOT NULL DEFAULT 'video',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS availability_settings (
  id SMALLINT PRIMARY KEY CHECK (id = 1),
  weekly_enabled BOOLEAN NOT NULL DEFAULT true,
  days JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type_id UUID NOT NULL REFERENCES event_types (id) ON DELETE CASCADE,
  start_at TIMESTAMPTZ NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_start_at ON bookings (start_at);
CREATE INDEX IF NOT EXISTS idx_bookings_event_type ON bookings (event_type_id);

-- Default weekly availability (Mon–Fri 9–5, weekends off)
INSERT INTO availability_settings (id, weekly_enabled, days)
SELECT
  1,
  true,
  '[
    {"enabled":false,"ranges":[]},
    {"enabled":true,"ranges":[{"start":"09:00","end":"17:00"}]},
    {"enabled":true,"ranges":[{"start":"09:00","end":"17:00"}]},
    {"enabled":true,"ranges":[{"start":"09:00","end":"17:00"}]},
    {"enabled":true,"ranges":[{"start":"09:00","end":"17:00"}]},
    {"enabled":true,"ranges":[{"start":"09:00","end":"17:00"}]},
    {"enabled":false,"ranges":[]}
  ]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM availability_settings WHERE id = 1);

INSERT INTO event_types (title, slug, duration_minutes, description)
SELECT '30 Min Meeting', '30min', 30, 'One-on-one session'
WHERE NOT EXISTS (SELECT 1 FROM event_types WHERE slug = '30min');
