-- Complete OAuth Tokens Schema with RLS Policies

-- Google Calendar Tokens
CREATE TABLE IF NOT EXISTS google_calendar_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  scope TEXT,
  account_label TEXT,
  is_primary BOOLEAN DEFAULT false,
  sync_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, email)
);

ALTER TABLE google_calendar_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own google calendar tokens" ON google_calendar_tokens;
CREATE POLICY "Users can view own google calendar tokens" ON google_calendar_tokens FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own google calendar tokens" ON google_calendar_tokens;
CREATE POLICY "Users can insert own google calendar tokens" ON google_calendar_tokens FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own google calendar tokens" ON google_calendar_tokens;
CREATE POLICY "Users can update own google calendar tokens" ON google_calendar_tokens FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own google calendar tokens" ON google_calendar_tokens;
CREATE POLICY "Users can delete own google calendar tokens" ON google_calendar_tokens FOR DELETE USING (auth.uid() = user_id);

-- Outlook Calendar Tokens
CREATE TABLE IF NOT EXISTS outlook_calendar_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  scope TEXT,
  account_label TEXT,
  is_primary BOOLEAN DEFAULT false,
  sync_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, email)
);

ALTER TABLE outlook_calendar_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own outlook tokens" ON outlook_calendar_tokens;
CREATE POLICY "Users can view own outlook tokens" ON outlook_calendar_tokens FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own outlook tokens" ON outlook_calendar_tokens;
CREATE POLICY "Users can insert own outlook tokens" ON outlook_calendar_tokens FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own outlook tokens" ON outlook_calendar_tokens;
CREATE POLICY "Users can update own outlook tokens" ON outlook_calendar_tokens FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own outlook tokens" ON outlook_calendar_tokens;
CREATE POLICY "Users can delete own outlook tokens" ON outlook_calendar_tokens FOR DELETE USING (auth.uid() = user_id);

-- Apple Calendar Tokens
CREATE TABLE IF NOT EXISTS apple_calendar_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  apple_id TEXT NOT NULL,
  app_specific_password TEXT NOT NULL,
  account_label TEXT,
  is_primary BOOLEAN DEFAULT false,
  sync_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, apple_id)
);

ALTER TABLE apple_calendar_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own apple tokens" ON apple_calendar_tokens;
CREATE POLICY "Users can view own apple tokens" ON apple_calendar_tokens FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own apple tokens" ON apple_calendar_tokens;
CREATE POLICY "Users can insert own apple tokens" ON apple_calendar_tokens FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own apple tokens" ON apple_calendar_tokens;
CREATE POLICY "Users can update own apple tokens" ON apple_calendar_tokens FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own apple tokens" ON apple_calendar_tokens;
CREATE POLICY "Users can delete own apple tokens" ON apple_calendar_tokens FOR DELETE USING (auth.uid() = user_id);

-- Google Business Tokens
CREATE TABLE IF NOT EXISTS google_business_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_name TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  scope TEXT,
  account_label TEXT,
  is_primary BOOLEAN DEFAULT false,
  sync_enabled BOOLEAN DEFAULT true,
  location_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, account_name)
);

ALTER TABLE google_business_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own google business tokens" ON google_business_tokens;
CREATE POLICY "Users can view own google business tokens" ON google_business_tokens FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own google business tokens" ON google_business_tokens;
CREATE POLICY "Users can insert own google business tokens" ON google_business_tokens FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own google business tokens" ON google_business_tokens;
CREATE POLICY "Users can update own google business tokens" ON google_business_tokens FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own google business tokens" ON google_business_tokens;
CREATE POLICY "Users can delete own google business tokens" ON google_business_tokens FOR DELETE USING (auth.uid() = user_id);
