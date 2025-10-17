-- Migration to support multiple accounts per provider
-- This allows users to connect multiple Google Calendar accounts, multiple Outlook accounts, etc.

-- Add account_label column to identify different accounts
ALTER TABLE google_calendar_tokens 
ADD COLUMN IF NOT EXISTS account_label TEXT,
ADD COLUMN IF NOT EXISTS sync_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT false;

ALTER TABLE outlook_calendar_tokens 
ADD COLUMN IF NOT EXISTS account_label TEXT,
ADD COLUMN IF NOT EXISTS sync_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT false;

ALTER TABLE apple_calendar_tokens 
ADD COLUMN IF NOT EXISTS account_label TEXT,
ADD COLUMN IF NOT EXISTS sync_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT false;

ALTER TABLE google_business_tokens 
ADD COLUMN IF NOT EXISTS account_label TEXT,
ADD COLUMN IF NOT EXISTS sync_enabled BOOLEAN DEFAULT true;

-- Remove unique constraint on user_id to allow multiple accounts
-- Note: You may need to drop existing constraints first
-- ALTER TABLE google_calendar_tokens DROP CONSTRAINT IF EXISTS google_calendar_tokens_user_id_key;
-- ALTER TABLE outlook_calendar_tokens DROP CONSTRAINT IF EXISTS outlook_calendar_tokens_user_id_key;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_google_calendar_tokens_user_primary 
ON google_calendar_tokens(user_id, is_primary);

CREATE INDEX IF NOT EXISTS idx_outlook_calendar_tokens_user_primary 
ON outlook_calendar_tokens(user_id, is_primary);

CREATE INDEX IF NOT EXISTS idx_apple_calendar_tokens_user_primary 
ON apple_calendar_tokens(user_id, is_primary);

-- Function to ensure only one primary account per provider per user
CREATE OR REPLACE FUNCTION ensure_single_primary_account()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary = true THEN
    -- Set all other accounts for this user to non-primary
    EXECUTE format('UPDATE %I SET is_primary = false WHERE user_id = $1 AND id != $2', TG_TABLE_NAME)
    USING NEW.user_id, NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for each table
DROP TRIGGER IF EXISTS ensure_primary_google_calendar ON google_calendar_tokens;
CREATE TRIGGER ensure_primary_google_calendar
  AFTER INSERT OR UPDATE OF is_primary ON google_calendar_tokens
  FOR EACH ROW EXECUTE FUNCTION ensure_single_primary_account();

DROP TRIGGER IF EXISTS ensure_primary_outlook_calendar ON outlook_calendar_tokens;
CREATE TRIGGER ensure_primary_outlook_calendar
  AFTER INSERT OR UPDATE OF is_primary ON outlook_calendar_tokens
  FOR EACH ROW EXECUTE FUNCTION ensure_single_primary_account();

DROP TRIGGER IF EXISTS ensure_primary_apple_calendar ON apple_calendar_tokens;
CREATE TRIGGER ensure_primary_apple_calendar
  AFTER INSERT OR UPDATE OF is_primary ON apple_calendar_tokens
  FOR EACH ROW EXECUTE FUNCTION ensure_single_primary_account();
