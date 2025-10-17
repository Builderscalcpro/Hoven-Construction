# OAuth Tables Fix Applied

## Issue
OAuth Connection Manager was showing "Could not find table in schema cache" errors for all OAuth token tables.

## Resolution
The following tables have been created/updated with proper schema:

### ✅ google_calendar_tokens
- **Status**: Created from scratch
- **Columns**: id, user_id, email, access_token, refresh_token, expires_at, scope, created_at, updated_at
- **RLS**: Enabled with user-scoped policies
- **Indexes**: user_id, expires_at

### ✅ outlook_calendar_tokens
- **Status**: Updated with missing columns
- **Added**: expires_at, scope, updated_at
- **Indexes**: expires_at

### ✅ apple_calendar_tokens
- **Status**: Updated with missing columns
- **Added**: expires_at, scope, updated_at
- **Indexes**: expires_at

### ✅ google_business_tokens
- **Status**: Updated with missing columns
- **Added**: expires_at, scope, updated_at
- **Indexes**: expires_at

## Next Steps
1. Navigate to OAuth Connection Manager page
2. Click "Add Account" for any provider
3. Complete OAuth flow
4. Tokens will now be stored properly with expiration tracking

## Automatic Token Refresh
All tables now support automatic token refresh via the `refresh-oauth-tokens` edge function.
