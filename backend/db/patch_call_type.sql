-- Add call type (audio / video) for event types — run after schema.sql
ALTER TABLE event_types ADD COLUMN IF NOT EXISTS call_type TEXT NOT NULL DEFAULT 'video';
