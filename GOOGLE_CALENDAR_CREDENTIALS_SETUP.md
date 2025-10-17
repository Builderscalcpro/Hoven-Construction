# 🗓️ Google Calendar OAuth Setup Guide

## Quick Start: Add Your Credentials

Follow these steps to enable Google Calendar integration:

---

## Step 1: Get Your Google OAuth Credentials

### A. Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Create a new project or select existing one
3. Name it something like "Hoven Construction Calendar"

### B. Enable Google Calendar API
1. Go to: https://console.cloud.google.com/apis/library
2. Search for "Google Calendar API"
3. Click on it and press **ENABLE**

### C. Create OAuth 2.0 Credentials
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. If prompted, configure OAuth consent screen:
   - User Type: **External** (or Internal if G Suite)
   - App name: **Hoven Construction**
   - User support email: your email
   - Developer contact: your email
   - Add scopes: `calendar.readonly`, `calendar.events`
   - Add test users (your email)
   - Click **Save and Continue**

4. Back to Create OAuth client ID:
   - Application type: **Web application**
   - Name: **Hoven Construction Web Client**

### D. Add Authorized Redirect URIs
Add these URLs (click **+ ADD URI** for each):

**For Development:**
```
http://localhost:5173/google-calendar-callback
```

**For Production:**
```
https://hovenconstruction.com/google-calendar-callback
https://www.hovenconstruction.com/google-calendar-callback
```

5. Click **CREATE**
6. **SAVE** your Client ID and Client Secret (you'll need these next)

---

## Step 2: Configure Supabase Secrets

### Option A: Using Supabase Dashboard (Recommended)
1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/vault
2. Click **New Secret** for each:

**Secret 1:**
- Name: `GOOGLE_CLIENT_ID`
- Value: `YOUR_CLIENT_ID_FROM_GOOGLE.apps.googleusercontent.com`

**Secret 2:**
- Name: `GOOGLE_CLIENT_SECRET`
- Value: `YOUR_CLIENT_SECRET_FROM_GOOGLE`

**Secret 3:**
- Name: `VITE_GOOGLE_CLIENT_ID`
- Value: `YOUR_CLIENT_ID_FROM_GOOGLE.apps.googleusercontent.com`

3. Click **Save** for each

### Option B: Using Supabase CLI
```bash
# Set backend secrets
supabase secrets set GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
supabase secrets set GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE

# Set frontend secret
supabase secrets set VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
```

---

## Step 3: Update Local Environment

Create or update `.env.local` in your project root:

```env
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
```

**Important:** Restart your development server after adding this!

```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## Step 4: Verify Setup

### Test the Connection:
1. Start your app: `npm run dev`
2. Go to: http://localhost:5173/calendar
3. Click **"Connect Google Calendar"**
4. You should see Google's OAuth consent screen
5. Authorize the app
6. You'll be redirected back with "Connected!" status

---

## 🎯 What You'll Get

Once configured, users can:
- ✅ Connect their Google Calendar with one click
- ✅ View all calendar events in the app
- ✅ Automatically check availability for bookings
- ✅ Sync new appointments to Google Calendar
- ✅ Prevent double-booking conflicts
- ✅ Manage availability and working hours

---

## 🔒 Security Notes

- ✅ Tokens stored securely in Supabase database
- ✅ Row Level Security (RLS) protects user data
- ✅ Automatic token refresh (no re-auth needed)
- ✅ OAuth 2.0 standard authentication
- ✅ HTTPS-only in production

---

## 🚨 Troubleshooting

### Error: "redirect_uri_mismatch"
**Fix:** Check Google Console redirect URIs match exactly:
- `http://localhost:5173/google-calendar-callback` (dev)
- `https://hovenconstruction.com/google-calendar-callback` (prod)

### Error: "Client ID not configured"
**Fix:** 
1. Verify `.env.local` has `VITE_GOOGLE_CLIENT_ID`
2. Restart dev server: `npm run dev`
3. Check Supabase secrets are set

### Error: "Access blocked: This app's request is invalid"
**Fix:**
1. Complete OAuth consent screen setup
2. Add your email as a test user
3. Enable Google Calendar API

### Calendar not syncing
**Fix:**
1. Check user is authenticated
2. Verify tokens in `google_calendar_tokens` table
3. Check Edge function logs in Supabase

---

## 📍 Key Files

- **Frontend:** `src/components/GoogleCalendarSetup.tsx`
- **Callback:** `src/pages/GoogleCalendarCallback.tsx`
- **Service:** `src/lib/googleCalendarService.ts`
- **Edge Function:** `supabase/functions/google-calendar-auth/index.ts`

---

## ✅ Checklist

- [ ] Google Cloud project created
- [ ] Google Calendar API enabled
- [ ] OAuth 2.0 Client ID created
- [ ] Redirect URIs added (dev + prod)
- [ ] Client ID copied
- [ ] Client Secret copied
- [ ] Supabase secrets configured (3 secrets)
- [ ] `.env.local` file updated
- [ ] Dev server restarted
- [ ] Tested OAuth flow
- [ ] Successfully connected calendar

---

## 🆘 Need More Help?

See also:
- `GOOGLE_OAUTH_COMPLETE_SETUP.md` - Complete OAuth guide
- `GOOGLE_CALENDAR_SETUP_COMPLETE.md` - Feature documentation
- `CALENDAR_SETUP_CHECKLIST.md` - Detailed checklist

**Google Calendar is ready to go once you add your credentials!** 🚀
