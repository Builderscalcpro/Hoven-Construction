# Google OAuth Flow Not Responding - Troubleshooting Guide

## Issue
The Google Business Profile OAuth flow is not responding even though `VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID` has been added to `.env`.

## Quick Fix Checklist

### 1. ⚠️ RESTART YOUR DEV SERVER (Most Common Issue)
Environment variables are only loaded when Vite starts. After adding the variable:
```bash
# Stop your dev server (Ctrl+C)
# Then restart it:
npm run dev
```

### 2. ✅ Verify the Client ID Format
Your Client ID should look like:
```
309881425631-rlso29r8fj72194v07n1j5eo5sspa7ck.apps.googleusercontent.com
```

**NOT** an API Key (which starts with `AIza`):
```
❌ AIzaSyBnpiJlKgyjWClfB-_72fIsQSO9yHze-V8  (This is an API Key, not a Client ID)
```

### 3. Check Your .env File
Open your `.env` file and verify:
```env
VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
```

- No quotes around the value
- No spaces before or after the `=`
- The file is named exactly `.env` (not `.env.txt` or `.env.local`)
- The file is in the project root directory (same level as `package.json`)

### 4. Verify in Browser Console
After restarting the dev server, open browser console and type:
```javascript
console.log(import.meta.env.VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID)
```

If it shows `undefined`, the variable is not loaded correctly.

### 5. Configure Redirect URIs in Google Cloud Console
Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials):

1. Select your OAuth 2.0 Client ID
2. Add these Authorized redirect URIs:
   ```
   http://localhost:5173/google-business-callback
   https://yourdomain.com/google-business-callback
   ```
3. Click **Save**

### 6. Enable Required APIs
In Google Cloud Console, enable:
- Google My Business API
- Google Business Profile API

## Testing the Fix

1. Navigate to `/google-oauth-setup` in your app
2. You should see "✅ Client ID is configured in .env"
3. The "Connect with Google" button should be enabled
4. Clicking it should redirect to Google's OAuth consent screen

## Still Not Working?

Run the diagnostic tool:
1. Go to `/admin-setup` in your app
2. Look for the Google Business Profile section
3. Check the status indicators

## Common Errors

### "Client ID not configured"
- Dev server not restarted
- Wrong file name or location
- Variable name typo

### Button is disabled
- Client ID is undefined
- Check browser console for the variable value

### Redirect URI mismatch error
- Add the callback URL to Google Cloud Console
- Make sure the URL exactly matches (including http/https)

## Need the Client ID?

Get it from [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
1. Go to APIs & Services → Credentials
2. Find your OAuth 2.0 Client ID
3. Copy the Client ID (ends with `.apps.googleusercontent.com`)
4. Paste it into your `.env` file
5. **Restart your dev server**
