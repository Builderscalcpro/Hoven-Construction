# OAuth Database Setup Guide

## Issue
The OAuth Connection Manager shows "No accounts connected" for all providers because the database tables don't exist or RLS policies are blocking access.

## Solution

### Step 1: Run the SQL Migration
Execute the SQL file `supabase_oauth_tokens_complete.sql` in your Supabase SQL Editor:

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase_oauth_tokens_complete.sql`
4. Paste and run the SQL

This will create:
- `google_calendar_tokens` table
- `outlook_calendar_tokens` table
- `apple_calendar_tokens` table
- `google_business_tokens` table
- All necessary RLS (Row Level Security) policies

### Step 2: Verify Tables Were Created
Run this query to check if tables exist:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'google_calendar_tokens',
  'outlook_calendar_tokens', 
  'apple_calendar_tokens',
  'google_business_tokens'
);
```

### Step 3: Test RLS Policies
After authentication, run this to verify you can access your data:
```sql
SELECT * FROM google_calendar_tokens WHERE user_id = auth.uid();
```

## What the Migration Does

### Creates Tables With:
- `user_id` - Links to authenticated user
- `email` or `account_name` - Account identifier
- `access_token` - OAuth access token
- `refresh_token` - OAuth refresh token (for token renewal)
- `expires_at` - Token expiration timestamp
- `account_label` - Custom label for the account
- `is_primary` - Mark one account as primary
- `sync_enabled` - Enable/disable sync for this account

### RLS Policies:
- Users can only view their own tokens
- Users can only insert tokens for themselves
- Users can only update their own tokens
- Users can only delete their own tokens

## Troubleshooting

### Still Seeing "No accounts connected"?
1. Check browser console for errors
2. Verify you're logged in (check `user` object in AuthContext)
3. Run SQL query to check if tables exist
4. Verify RLS policies are enabled

### Database Errors?
Check the browser console for specific error messages:
- "relation does not exist" = Tables not created
- "permission denied" = RLS policies blocking access
- "null value in column user_id" = User not authenticated

### Need to Reset?
To drop all tables and start fresh:
```sql
DROP TABLE IF EXISTS google_calendar_tokens CASCADE;
DROP TABLE IF EXISTS outlook_calendar_tokens CASCADE;
DROP TABLE IF EXISTS apple_calendar_tokens CASCADE;
DROP TABLE IF EXISTS google_business_tokens CASCADE;
```

Then re-run the migration SQL.
