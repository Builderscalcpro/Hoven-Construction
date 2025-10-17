# Calendar Connection Troubleshooting Guide

## Overview
This guide helps diagnose and fix calendar connection issues for Google Calendar, Outlook Calendar, and Apple Calendar.

## Common Issues and Solutions

### Issue 1: OAuth Redirect Mismatch
**Symptom:** Calendar connection fails after clicking "Connect"

**Solution:**
1. Check that redirect URI is set to: `https://yourdomain.com/calendar-callback`
2. For Google: Update in Google Cloud Console → APIs & Services → Credentials
3. For Outlook: Update in Azure Portal → App Registrations → Authentication

### Issue 2: Missing Calendar Connections Table
**Symptom:** Database errors when trying to connect

**Solution:**
The `calendar_connections` table has been created with proper RLS policies. If issues persist, run diagnostics.

### Issue 3: Edge Functions Not Responding
**Symptom:** Connection button doesn't work or times out

**Solution:**
1. Check edge function logs in Supabase dashboard
2. Verify environment variables are set:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `MICROSOFT_CLIENT_ID`
3. Test edge functions in Supabase dashboard

### Issue 4: Callback Handler Not Found
**Symptom:** 404 error after OAuth redirect

**Solution:**
The unified `/calendar-callback` route has been added. Ensure:
1. Route exists in App.tsx
2. CalendarCallback.tsx component is properly imported
3. Provider state is passed in OAuth URL

## Using the Diagnostics Tool

### Access Diagnostics
1. Navigate to `/calendar`
2. Click the "Diagnostics" tab
3. Click "Run Diagnostics"

### What It Checks
- ✅ User authentication status
- ✅ Calendar connections table accessibility
- ✅ Google Calendar tokens
- ✅ Outlook Calendar tokens
- ✅ Apple Calendar tokens
- ✅ Edge functions accessibility

### Interpreting Results
- **Pass (Green)**: Everything working correctly
- **Warn (Yellow)**: Feature available but not configured
- **Fail (Red)**: Critical issue that needs fixing

## Step-by-Step Connection Process

### Google Calendar
1. Click "Connect Google Calendar"
2. Redirected to Google OAuth consent screen
3. Grant permissions
4. Redirected back to `/calendar-callback?code=...&state=...`
5. Edge function exchanges code for tokens
6. Tokens stored in `google_calendar_tokens` table
7. Connection recorded in `calendar_connections` table

### Outlook Calendar
1. Click "Connect Outlook Calendar"
2. Redirected to Microsoft OAuth consent screen
3. Grant permissions
4. Redirected back to `/calendar-callback?code=...&state=...`
5. Edge function exchanges code for tokens
6. Tokens stored in `outlook_calendar_tokens` table
7. Connection recorded in `calendar_connections` table

### Apple Calendar
1. Click "Configure Apple Calendar"
2. Enter Apple ID and app-specific password
3. System validates credentials via CalDAV
4. Connection stored in `apple_calendar_tokens` table

## Debugging Tips

### Check Browser Console
Look for errors during OAuth flow:
```javascript
// Common errors
- "Failed to connect google: Network error"
- "OAuth error: access_denied"
- "No authorization code received"
```

### Check Network Tab
1. Open DevTools → Network
2. Click connect button
3. Look for failed requests to:
   - `/functions/v1/google-calendar-auth`
   - `/functions/v1/outlook-calendar-auth`

### Check Edge Function Logs
1. Go to Supabase Dashboard
2. Edge Functions → Select function
3. View logs for errors

### Verify OAuth Configuration
**Google:**
- Client ID matches `.env` file
- Redirect URI: `https://yourdomain.com/calendar-callback`
- APIs enabled: Google Calendar API

**Microsoft:**
- Client ID matches `.env` file
- Redirect URI: `https://yourdomain.com/calendar-callback`
- API permissions: Calendars.ReadWrite

## Manual Testing

### Test Edge Function Directly
```javascript
const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
  body: { 
    action: 'getAuthUrl', 
    redirectUri: 'https://yourdomain.com/calendar-callback',
    userId: 'user-id-here'
  }
});
console.log(data, error);
```

### Test Database Connection
```javascript
const { data, error } = await supabase
  .from('calendar_connections')
  .select('*')
  .eq('user_id', 'user-id-here');
console.log(data, error);
```

## Getting Help

If issues persist after following this guide:
1. Run diagnostics and save results
2. Check browser console for errors
3. Check edge function logs
4. Verify OAuth credentials in cloud consoles
5. Ensure redirect URIs match exactly

## Recent Fixes Applied

✅ Created unified `/calendar-callback` route
✅ Fixed redirect URI mismatch (was using wrong path)
✅ Added comprehensive diagnostics component
✅ Improved error handling with detailed messages
✅ Added provider state to OAuth flow
✅ Created calendar_connections table with RLS policies
