# Google Calendar Connection Fix Guide

## Issue: Google Calendar Not Connected

This guide will help you troubleshoot and fix Google Calendar connection issues.

---

## Quick Diagnostics Checklist

### 1. ✅ Check Environment Variables
Ensure these are set in your `.env` file:
```env
VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=AIzaSyAO8kN_Je2kfLgq8FtE2r7gb03stDJ5sPw
```

### 2. ✅ Check Supabase Secrets
Run these commands to verify Supabase secrets:
```bash
# Check if secrets are set
supabase secrets list

# Set secrets if missing
supabase secrets set GOOGLE_CLIENT_ID="your_client_id.apps.googleusercontent.com"
supabase secrets set GOOGLE_CLIENT_SECRET="GOCSPX-your_secret_here"
```

### 3. ✅ Verify OAuth Redirect URIs
In Google Cloud Console (https://console.cloud.google.com/apis/credentials):
- Go to your OAuth 2.0 Client ID
- Add these Authorized redirect URIs:
  - `http://localhost:5173/calendar-callback`
  - `http://localhost:5173/google-calendar-callback`
  - `https://hovenconstruction.com/calendar-callback`
  - `https://hovenconstruction.com/google-calendar-callback`

### 4. ✅ Enable Required APIs
In Google Cloud Console, enable:
- Google Calendar API
- Google People API (for profile info)

---

## Step-by-Step Fix

### Step 1: Get Google OAuth Credentials

1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID (if not exists)
3. Application type: Web application
4. Add redirect URIs (see above)
5. Copy Client ID and Client Secret

### Step 2: Update Environment Variables

Create/update `.env` file:
```env
VITE_GOOGLE_CLIENT_ID=123456789.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=AIzaSyAO8kN_Je2kfLgq8FtE2r7gb03stDJ5sPw
```

### Step 3: Set Supabase Secrets

```bash
supabase secrets set GOOGLE_CLIENT_ID="123456789.apps.googleusercontent.com"
supabase secrets set GOOGLE_CLIENT_SECRET="GOCSPX-your_secret_here"
```

### Step 4: Redeploy Edge Functions

```bash
# Redeploy the auth function
supabase functions deploy google-calendar-auth

# Test the function
curl -X POST https://qdxondojktchkjbbrtaq.supabase.co/functions/v1/google-calendar-auth \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"action":"getAuthUrl"}'
```

### Step 5: Test Connection

1. Restart your dev server: `npm run dev`
2. Navigate to Calendar Dashboard
3. Click "Connect Calendar"
4. Authorize with Google
5. Should redirect back with success

---

## Common Issues & Solutions

### Issue: "OAuth credentials not configured"
**Solution**: Supabase secrets not set. Run:
```bash
supabase secrets set GOOGLE_CLIENT_ID="your_id"
supabase secrets set GOOGLE_CLIENT_SECRET="your_secret"
supabase functions deploy google-calendar-auth
```

### Issue: "redirect_uri_mismatch"
**Solution**: Add exact redirect URI to Google Console
- Must match exactly (including http/https, port, path)
- No trailing slashes

### Issue: "Access blocked: This app's request is invalid"
**Solution**: 
1. Check OAuth consent screen is configured
2. Add test users if app is in testing mode
3. Verify scopes are correct

### Issue: "Failed to get authorization URL"
**Solution**: Check browser console for errors
- Verify edge function is deployed
- Check Supabase function logs
- Ensure CORS headers are correct

---

## Testing the Connection

### Manual Test Flow:
1. Open browser DevTools (F12)
2. Go to Calendar page
3. Click "Connect Calendar"
4. Watch Network tab for:
   - Call to `google-calendar-auth` function
   - Redirect to Google OAuth
   - Callback with code parameter
   - Token exchange

### Check Database:
```sql
-- Verify tokens are saved
SELECT user_id, calendar_id, is_primary, sync_enabled, created_at
FROM google_calendar_tokens
WHERE user_id = 'your_user_id';
```

---

## Quick Connect Component

Use the new `GoogleCalendarQuickConnect` component for easier setup:

```tsx
import { GoogleCalendarQuickConnect } from '@/components/GoogleCalendarQuickConnect';

<GoogleCalendarQuickConnect />
```

This component provides:
- One-click connection
- Real-time diagnostics
- Error messages with solutions
- Connection status indicator

---

## Support Resources

- [Google OAuth Setup Guide](./GOOGLE_OAUTH_COMPLETE_SETUP.md)
- [Calendar Setup Checklist](./CALENDAR_SETUP_CHECKLIST.md)
- [Edge Functions Testing](./EDGE_FUNCTIONS_TESTING_GUIDE.md)
- [Supabase Secrets](./SUPABASE_SECRETS_SETUP.md)

---

## Still Having Issues?

1. Check Supabase function logs:
   - Go to Supabase Dashboard → Edge Functions → Logs
   - Look for errors in `google-calendar-auth`

2. Verify API quotas:
   - Google Cloud Console → APIs & Services → Quotas
   - Ensure Calendar API quota not exceeded

3. Test with curl:
```bash
# Test auth URL generation
curl -X POST https://qdxondojktchkjbbrtaq.supabase.co/functions/v1/google-calendar-auth \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"action":"getAuthUrl"}'
```

---

**Last Updated**: October 8, 2025
