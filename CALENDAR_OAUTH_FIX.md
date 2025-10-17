# Calendar OAuth Connection Fix

## Issue Fixed
The Google Calendar and Outlook Calendar OAuth connections were failing with "Edge Function returned a non-2xx status code" error.

## Root Cause
The edge functions `google-calendar-auth` and `outlook-calendar-auth` were not properly handling the different action types that the frontend was requesting:
- `getAuthUrl` - Generate OAuth authorization URL
- `exchangeCode` - Exchange authorization code for tokens
- `handleCallback` - Handle OAuth callback
- `refreshToken` - Refresh expired access tokens

## Changes Made

### 1. Updated `google-calendar-auth` Edge Function
- Added proper action routing for all OAuth flow steps
- Implemented `getAuthUrl` action to generate OAuth URLs
- Implemented `exchangeCode` and `handleCallback` actions for token exchange
- Implemented `refreshToken` action for token refresh
- Added proper error handling for each action
- Fixed redirect URI handling to use request origin

### 2. Updated `outlook-calendar-auth` Edge Function
- Added proper action routing for all OAuth flow steps
- Implemented `getAuthUrl` action to generate OAuth URLs
- Implemented `exchangeCode` and `handleCallback` actions for token exchange
- Implemented `refreshToken` action for token refresh
- Added proper error handling for each action
- Fixed redirect URI handling to use request origin

## How It Works Now

### Google Calendar Connection Flow
1. User clicks "Connect Google Calendar"
2. Frontend calls `google-calendar-auth` with `action: 'getAuthUrl'`
3. Edge function generates OAuth URL and returns it
4. User is redirected to Google for authorization
5. Google redirects back with authorization code
6. Frontend calls `google-calendar-auth` with `action: 'exchangeCode'` and the code
7. Edge function exchanges code for access/refresh tokens
8. Tokens are stored in `google_calendar_tokens` table

### Outlook Calendar Connection Flow
1. User clicks "Connect Outlook Calendar"
2. Frontend calls `outlook-calendar-auth` with `action: 'getAuthUrl'`
3. Edge function generates OAuth URL and returns it
4. User is redirected to Microsoft for authorization
5. Microsoft redirects back with authorization code
6. Frontend calls `outlook-calendar-auth` with `action: 'exchangeCode'` and the code
7. Edge function exchanges code for access/refresh tokens
8. Tokens are stored in `outlook_calendar_tokens` table

### Token Refresh Flow
When tokens expire:
1. Frontend detects expired token
2. Calls edge function with `action: 'refreshToken'` and refresh token
3. Edge function gets new access token from OAuth provider
4. New token is returned and stored

## Testing the Fix

### Test Google Calendar Connection
1. Go to `/oauth-connections` or `/calendar`
2. Click "Connect Google Calendar"
3. You should be redirected to Google OAuth consent screen
4. After authorizing, you should be redirected back successfully
5. Check that connection shows as "Connected"

### Test Outlook Calendar Connection
1. Go to `/oauth-connections` or `/calendar`
2. Click "Connect Outlook Calendar"
3. You should be redirected to Microsoft OAuth consent screen
4. After authorizing, you should be redirected back successfully
5. Check that connection shows as "Connected"

## Verify in Supabase Dashboard

### Check Edge Function Logs
1. Go to Supabase Dashboard → Edge Functions
2. Select `google-calendar-auth` or `outlook-calendar-auth`
3. View logs to see successful OAuth exchanges
4. Look for 200 status codes

### Check Database Tables
```sql
-- Check Google Calendar tokens
SELECT * FROM google_calendar_tokens;

-- Check Outlook Calendar tokens
SELECT * FROM outlook_calendar_tokens;
```

## Error Handling
Both functions now return proper error responses:
- 400 Bad Request - Missing required parameters
- 401 Unauthorized - Invalid credentials
- 500 Internal Server Error - Server-side errors

All errors include descriptive messages for debugging.

## Next Steps
After connecting calendars:
1. Test calendar sync functionality
2. Test event creation
3. Test availability checking
4. Verify bidirectional sync works
5. Test token refresh after expiration

## Related Files
- `supabase/functions/google-calendar-auth/index.ts`
- `supabase/functions/outlook-calendar-auth/index.ts`
- `src/lib/googleCalendarService.ts`
- `src/lib/outlookCalendarService.ts`
- `src/components/CalendarProviderConnect.tsx`
- `src/pages/CalendarCallback.tsx`
