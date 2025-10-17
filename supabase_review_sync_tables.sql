-- Review Sync Configuration Table
CREATE TABLE IF NOT EXISTS review_sync_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  auto_sync_enabled BOOLEAN DEFAULT false,
  sync_frequency_minutes INTEGER DEFAULT 60,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  email_notifications BOOLEAN DEFAULT false,
  notification_email TEXT,
  sms_notifications BOOLEAN DEFAULT false,
  notification_phone TEXT,
  auto_respond_enabled BOOLEAN DEFAULT false,
  business_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Review Sync Logs Table
CREATE TABLE IF NOT EXISTS review_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'partial')),
  reviews_synced INTEGER DEFAULT 0,
  error_message TEXT,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Review Responses Table
CREATE TABLE IF NOT EXISTS review_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id TEXT NOT NULL,
  response_text TEXT NOT NULL,
  auto_generated BOOLEAN DEFAULT false,
  posted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE review_sync_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own sync config"
  ON review_sync_config FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own sync logs"
  ON review_sync_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view review responses"
  ON review_responses FOR SELECT
  USING (true);

-- Indexes
CREATE INDEX idx_review_sync_config_user ON review_sync_config(user_id);
CREATE INDEX idx_review_sync_logs_user ON review_sync_logs(user_id, synced_at DESC);
CREATE INDEX idx_review_responses_review ON review_responses(review_id);
