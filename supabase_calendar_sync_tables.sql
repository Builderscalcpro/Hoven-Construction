-- Calendar Sync Status Table
CREATE TABLE IF NOT EXISTS calendar_sync_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_sync TIMESTAMP WITH TIME ZONE NOT NULL,
  sync_direction TEXT NOT NULL CHECK (sync_direction IN ('local_to_google', 'google_to_local', 'bidirectional')),
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'in_progress')),
  events_synced INTEGER DEFAULT 0,
  conflicts_resolved INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calendar Sync Conflicts Table
CREATE TABLE IF NOT EXISTS calendar_sync_conflicts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id TEXT NOT NULL,
  local_title TEXT,
  google_title TEXT,
  local_time TIMESTAMP WITH TIME ZONE,
  google_time TIMESTAMP WITH TIME ZONE,
  local_description TEXT,
  google_description TEXT,
  conflict_type TEXT NOT NULL CHECK (conflict_type IN ('time', 'title', 'description', 'deleted')),
  resolution TEXT CHECK (resolution IN ('use_local', 'use_google', 'merge')),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calendar Sync History Table
CREATE TABLE IF NOT EXISTS calendar_sync_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sync_status_id UUID REFERENCES calendar_sync_status(id) ON DELETE CASCADE,
  event_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('created', 'updated', 'deleted', 'conflict')),
  source TEXT NOT NULL CHECK (source IN ('local', 'google')),
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add google_event_id to appointments if not exists
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS google_event_id TEXT UNIQUE;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMP WITH TIME ZONE;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_calendar_sync_status_user ON calendar_sync_status(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_sync_conflicts_user ON calendar_sync_conflicts(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_sync_conflicts_resolved ON calendar_sync_conflicts(resolved_at);
CREATE INDEX IF NOT EXISTS idx_calendar_sync_history_user ON calendar_sync_history(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_google_event ON appointments(google_event_id);

-- Enable RLS
ALTER TABLE calendar_sync_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_sync_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_sync_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own sync status"
  ON calendar_sync_status FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sync status"
  ON calendar_sync_status FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sync status"
  ON calendar_sync_status FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own conflicts"
  ON calendar_sync_conflicts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conflicts"
  ON calendar_sync_conflicts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conflicts"
  ON calendar_sync_conflicts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own sync history"
  ON calendar_sync_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sync history"
  ON calendar_sync_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);
