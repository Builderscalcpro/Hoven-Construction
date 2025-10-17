# Google OAuth Redirect URIs Configuration

## OAuth Client ID
`309881425631-rlso29r8fj72194v07n1j5eo5sspa7ck`

## Required Redirect URIs

Add these exact URIs to your Google Cloud Console OAuth 2.0 Client:

### For Development (localhost)
```
http://localhost:5173/google-business-callback
http://localhost:5173/google-calendar-callback
http://localhost:5173/calendar-callback
```

### For Production (Supabase)
```
https://njxhcmqtbkzvqpbqxfpn.supabase.co/google-business-callback
https://njxhcmqtbkzvqpbqxfpn.supabase.co/google-calendar-callback
https://njxhcmqtbkzvqpbqxfpn.supabase.co/calendar-callback
```

### For Custom Domain (if configured)
```
https://yourdomain.com/google-business-callback
https://yourdomain.com/google-calendar-callback
https://yourdomain.com/calendar-callback
```

## Step-by-Step Instructions

### 1. Access Google Cloud Console
1. Go to: https://console.cloud.google.com/apis/credentials
2. Find OAuth 2.0 Client ID: `309881425631-rlso29r8fj72194v07n1j5eo5sspa7ck`
3. Click on it to edit

### 2. Add Authorized Redirect URIs
1. Scroll to "Authorized redirect URIs" section
2. Click "ADD URI" for each URI listed above
3. Add all development URIs (localhost:5173)
4. Add all production URIs (supabase.co)
5. Click "SAVE" at the bottom

### 3. Verify APIs are Enabled
Ensure these APIs are enabled in your project:
- ✅ Google Business Profile API
- ✅ Google My Business API
- ✅ Google Calendar API

Go to: https://console.cloud.google.com/apis/library
Search and enable each API if not already enabled.

### 4. Complete OAuth Authorization

After adding redirect URIs, complete the OAuth flow:

1. **Navigate to Admin Dashboard**
   - Go to: http://localhost:5173/admin
   - Or your production URL

2. **Find Google Business Section**
   - Look for "Google Business Profile" or "Reviews Management"
   - Click "Connect Google Business Profile"

3. **Complete Authorization**
   - You'll be redirected to Google sign-in
   - Select the Google account with your business
   - Grant permissions for:
     - View business information
     - Manage and respond to reviews
     - View business locations

4. **Verify Connection**
   - After authorization, you'll be redirected back
   - Check for "Connected" status
   - Reviews should start syncing automatically

## Troubleshooting

### "Redirect URI Mismatch" Error
- Ensure URIs match EXACTLY (including http vs https)
- Check for trailing slashes (don't add them)
- Verify port number (5173 for development)

### "Access Blocked" Error
- Ensure OAuth consent screen is configured
- Add test users if app is in testing mode
- Or publish app for production use

### "Scope Not Authorized" Error
- Check that Google Business Profile API is enabled
- Verify OAuth consent screen includes business.manage scope

## Current Status
- ✅ Client ID configured in .env
- ✅ Edge functions deployed
- ✅ Frontend components ready
- ⏳ Waiting for redirect URIs to be added
- ⏳ Waiting for OAuth authorization

## Next Steps
1. Add all redirect URIs to Google Cloud Console
2. Complete OAuth authorization flow
3. Verify reviews are syncing
4. Test review response functionality