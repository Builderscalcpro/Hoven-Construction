# Google OAuth Complete Setup Guide

## ✅ What You Have
- **Google Business Client Secret**: `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` (configured in Supabase)

## ⚠️ What You Need
- Google Business Profile Client ID
- Google Calendar Client ID  
- Google API Key

---

## Step 1: Google Cloud Console Setup

### A. Create/Access Your Project
1. Go to https://console.cloud.google.com/
2. Select your project or create new one: "Hein Hoven Construction"

### B. Enable Required APIs
1. Go to **APIs & Services** > **Library**
2. Enable these APIs:
   - ✅ Google Calendar API
   - ✅ Google Business Profile API
   - ✅ Google People API (for profile info)

### C. Create OAuth 2.0 Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** > **OAuth client ID**
3. Application type: **Web application**
4. Name: "Hein Hoven Construction Web App"

### D. Configure Authorized Redirect URIs
Add these exact URIs:
```
http://localhost:5173/calendar-callback
http://localhost:5173/google-calendar-callback
http://localhost:5173/google-business-callback
https://heinhoven.com/calendar-callback
https://heinhoven.com/google-calendar-callback
https://heinhoven.com/google-business-callback
```

### E. Get Your Client ID
After creating, you'll see:
- **Client ID**: `xxxxx.apps.googleusercontent.com` ← Copy this
- **Client Secret**: You already have this!

### F. Create API Key
1. Go to **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** > **API key**
3. Copy the key (starts with `AIza...`)
4. Click **Restrict Key** and limit to:
   - Google Calendar API
   - Google Business Profile API

---

## Step 2: Update Your .env File

Create a `.env` file in your project root:

```bash
# Supabase (Already Configured)
VITE_SUPABASE_URL=https://qdxondojktchkjbbrtaq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Google Calendar OAuth
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=YOUR_API_KEY_HERE

# Google Business Profile
VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com

# Analytics (Already Configured)
VITE_GA_MEASUREMENT_ID=G-VB8WCV9VEW

# App Config
VITE_APP_DOMAIN=heinhoven.com
VITE_APP_NAME=Hein Hoven Construction
```

---

## Step 3: Test the Integration

### Test Google Calendar
1. Run `npm run dev`
2. Go to http://localhost:5173/calendar-dashboard
3. Click "Connect Google Calendar"
4. Authorize and verify sync works

### Test Google Business Profile
1. Go to Admin Dashboard
2. Navigate to Google Business section
3. Click "Connect Google Business Profile"
4. Authorize and verify reviews sync

---

## Troubleshooting

### "redirect_uri_mismatch" Error
- Double-check redirect URIs in Google Console match exactly
- Include both localhost and production domains
- No trailing slashes

### "Access Denied" Error
- Ensure APIs are enabled in Google Cloud Console
- Check OAuth consent screen is configured
- Verify user email is added to test users (if app is in testing mode)

### Calendar Not Syncing
- Check browser console for errors
- Verify API key has Calendar API enabled
- Ensure webhooks are set up in Supabase Edge Functions

---

## Security Notes

✅ **Client Secret is stored securely** in Supabase Edge Functions (not in frontend)
✅ **Client ID and API Key** are safe to use in frontend (public values)
⚠️ **Never commit .env file** to version control

---

## Next Steps After Setup

1. ✅ Calendar sync will activate automatically
2. ✅ Google Business reviews will sync hourly
3. ✅ Bidirectional calendar sync engine will start
4. ✅ Appointment bookings will create calendar events

**System will be 100% operational!**
