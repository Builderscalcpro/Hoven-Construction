# Google Calendar Sync - Troubleshooting Guide

## Issue Resolution

The Google Calendar sync issue has been addressed with the following improvements:

### 1. Database Table Verified
- ✅ `google_calendar_tokens` table exists and is properly configured
- ✅ RLS policies are in place
- ✅ Multi-calendar support enabled

### 2. Enhanced Error Handling
- ✅ Improved callback page with detailed error messages
- ✅ Step-by-step status updates during OAuth flow
- ✅ Better logging for debugging

### 3. Diagnostics Tool Added
- ✅ New "Diagnostics" tab in Calendar Dashboard (`/calendar`)
- ✅ Automated checks for:
  - User authentication status
  - Token storage and retrieval
  - Token expiry status
  - Edge function connectivity
  - Environment variable configuration

## How to Troubleshoot

### Step 1: Run Diagnostics
1. Navigate to `/calendar`
2. Click on the "Diagnostics" tab
3. Click "Run Diagnostics" button
4. Review all checks - they should show green checkmarks

### Step 2: Common Issues and Fixes

#### Issue: "No tokens found"
**Solution:** User needs to connect Google Calendar
- Go to Calendar Dashboard
- Click "Connect Calendar"
- Complete OAuth flow

#### Issue: "Token expired"
**Solution:** Tokens will auto-refresh, but you can reconnect:
- Disconnect and reconnect Google Calendar
- System will automatically refresh on next API call

#### Issue: "Edge function not responding"
**Solution:** Check Supabase edge functions
- Verify `google-calendar-auth` function is deployed
- Check function logs in Supabase dashboard

#### Issue: "Missing VITE_GOOGLE_CLIENT_ID"
**Solution:** Add to `.env` file:
```
VITE_GOOGLE_CLIENT_ID=your_client_id_here
```

### Step 3: Check OAuth Configuration
Ensure these are set in Supabase:
- `GOOGLE_CLIENT_ID` (secret)
- `GOOGLE_CLIENT_SECRET` (secret)

Ensure this is in your `.env`:
- `VITE_GOOGLE_CLIENT_ID`

### Step 4: Verify Redirect URI
In Google Cloud Console, authorized redirect URIs should include:
- `http://localhost:5173/google-calendar-callback` (development)
- `https://yourdomain.com/google-calendar-callback` (production)

## Testing the Fix

1. **Clear existing tokens** (if any issues):
```sql
DELETE FROM google_calendar_tokens WHERE user_id = 'your_user_id';
```

2. **Reconnect Google Calendar**:
- Go to `/calendar`
- Click "Connect Calendar"
- Authorize with Google
- Should redirect back successfully

3. **Verify in Diagnostics**:
- All checks should pass
- Token should be stored
- Token should not be expired

## Additional Features

### Multi-Calendar Support
Users can now connect multiple Google Calendars:
- Go to Calendar Dashboard → Connections tab
- Use CalendarPicker to add additional calendars
- Toggle sync and availability settings per calendar

### Real-Time Diagnostics
The diagnostics tool provides instant feedback on:
- Authentication status
- Token validity
- API connectivity
- Configuration issues

## Support

If issues persist after running diagnostics:
1. Check browser console for detailed error messages
2. Review Supabase edge function logs
3. Verify all environment variables are set correctly
4. Test OAuth flow in incognito mode to rule out cached data
