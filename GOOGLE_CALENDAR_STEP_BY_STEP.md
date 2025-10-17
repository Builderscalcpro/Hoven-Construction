# 📅 Google Calendar Setup - Step by Step with Screenshots Guide

## Overview
Your Google Calendar integration is **95% complete**. You just need to add OAuth credentials!

---

## 🎯 What You're Setting Up

This will allow your app to:
- ✅ Connect users' Google Calendars
- ✅ Show availability in real-time
- ✅ Prevent double-booking
- ✅ Auto-sync appointments
- ✅ Two-way calendar sync

---

## 📋 Step-by-Step Instructions

### STEP 1: Create Google Cloud Project (if you don't have one)

1. **Go to:** https://console.cloud.google.com/
2. **Click:** "Select a project" dropdown (top left)
3. **Click:** "NEW PROJECT"
4. **Enter:**
   - Project name: `Hoven Construction`
   - Organization: Leave as-is
5. **Click:** "CREATE"
6. **Wait:** ~30 seconds for project creation
7. **Select** your new project from the dropdown

---

### STEP 2: Enable Google Calendar API

1. **Go to:** https://console.cloud.google.com/apis/library
2. **Search for:** "Google Calendar API"
3. **Click on:** "Google Calendar API" result
4. **Click:** Blue "ENABLE" button
5. **Wait:** API enables (takes 5-10 seconds)

---

### STEP 3: Configure OAuth Consent Screen

1. **Go to:** https://console.cloud.google.com/apis/credentials/consent
2. **Select:** User Type
   - Choose "External" (for public use)
   - Or "Internal" (if you have Google Workspace)
3. **Click:** "CREATE"

**Fill out App Information:**
- App name: `Hoven Construction Calendar`
- User support email: `your-email@hovenconstruction.com`
- App logo: (optional, skip for now)
- Application home page: `https://hovenconstruction.com`
- Privacy policy: `https://hovenconstruction.com/privacy`
- Terms of service: `https://hovenconstruction.com/terms`

4. **Click:** "SAVE AND CONTINUE"

**Add Scopes:**
5. **Click:** "ADD OR REMOVE SCOPES"
6. **Filter for:** "calendar"
7. **Check these boxes:**
   - `.../auth/calendar.readonly` - View your calendars
   - `.../auth/calendar.events` - View and edit events
8. **Click:** "UPDATE"
9. **Click:** "SAVE AND CONTINUE"

**Add Test Users (if External):**
10. **Click:** "+ ADD USERS"
11. **Enter:** Your email address
12. **Click:** "ADD"
13. **Click:** "SAVE AND CONTINUE"

**Review:**
14. **Click:** "BACK TO DASHBOARD"

---

### STEP 4: Create OAuth 2.0 Credentials

1. **Go to:** https://console.cloud.google.com/apis/credentials
2. **Click:** "+ CREATE CREDENTIALS" (top of page)
3. **Select:** "OAuth client ID"

**Configure Client:**
4. **Application type:** Select "Web application"
5. **Name:** `Hoven Construction Web Client`

**Authorized JavaScript origins:**
6. **Click:** "+ ADD URI"
7. **Add:**
   ```
   http://localhost:5173
   ```
8. **Click:** "+ ADD URI" again
9. **Add:**
   ```
   https://hovenconstruction.com
   ```

**Authorized redirect URIs:**
10. **Click:** "+ ADD URI"
11. **Add:**
    ```
    http://localhost:5173/google-calendar-callback
    ```
12. **Click:** "+ ADD URI"
13. **Add:**
    ```
    https://hovenconstruction.com/google-calendar-callback
    ```
14. **Click:** "+ ADD URI"
15. **Add:**
    ```
    https://www.hovenconstruction.com/google-calendar-callback
    ```

16. **Click:** "CREATE"

**IMPORTANT - Save Your Credentials:**
17. A popup appears with:
    - **Your Client ID:** (looks like `123456-abc.apps.googleusercontent.com`)
    - **Your Client Secret:** (looks like `GOCSPX-abc123xyz`)
18. **Copy both** to a safe place (you'll need them next)
19. **Click:** "OK"

---

### STEP 5: Add Credentials to Supabase

1. **Go to:** https://supabase.com/dashboard/project/bmkqdwgcpjhmabadmilx/settings/vault

2. **Add Secret #1:**
   - Click: "New secret"
   - Name: `GOOGLE_CLIENT_ID`
   - Value: Paste your Client ID from Step 4
   - Click: "Save"

3. **Add Secret #2:**
   - Click: "New secret"
   - Name: `GOOGLE_CLIENT_SECRET`
   - Value: Paste your Client Secret from Step 4
   - Click: "Save"

4. **Add Secret #3:**
   - Click: "New secret"
   - Name: `VITE_GOOGLE_CLIENT_ID`
   - Value: Paste your Client ID again (same as Secret #1)
   - Click: "Save"

---

### STEP 6: Update Local Environment File

1. **Open your project** in code editor
2. **Find or create** `.env.local` file in root directory
3. **Add this line:**
   ```env
   VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
   ```
4. **Replace** `YOUR_CLIENT_ID_HERE` with your actual Client ID
5. **Save** the file

**Example:**
```env
VITE_GOOGLE_CLIENT_ID=123456789-abc123xyz.apps.googleusercontent.com
```

---

### STEP 7: Restart Development Server

**In your terminal:**
1. **Stop** current server: Press `Ctrl+C`
2. **Start** again: Run `npm run dev`
3. **Wait** for "Local: http://localhost:5173/"

---

### STEP 8: Test the Integration

1. **Open browser:** http://localhost:5173/calendar
2. **Click:** "Connect Google Calendar" button
3. **You should see:** Google OAuth consent screen
4. **Select:** Your Google account
5. **Review permissions** and click "Continue"
6. **You'll be redirected** back to your app
7. **Success!** You should see "Connected" status

---

## ✅ Verification Checklist

- [ ] Google Cloud project created
- [ ] Google Calendar API enabled
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 Client ID created
- [ ] Redirect URIs added (3 total)
- [ ] Client ID and Secret copied
- [ ] 3 Supabase secrets added
- [ ] .env.local file updated
- [ ] Dev server restarted
- [ ] Successfully connected calendar in app

---

## 🚨 Common Issues & Fixes

### Issue: "redirect_uri_mismatch"
**Cause:** Redirect URI doesn't match Google Console  
**Fix:** 
1. Go to Google Console credentials
2. Click your OAuth client
3. Verify redirect URIs match exactly:
   - `http://localhost:5173/google-calendar-callback`
   - `https://hovenconstruction.com/google-calendar-callback`

### Issue: "Client ID not configured"
**Cause:** Environment variable not loaded  
**Fix:**
1. Check `.env.local` has `VITE_GOOGLE_CLIENT_ID`
2. Restart dev server completely
3. Clear browser cache

### Issue: "Access blocked: This app's request is invalid"
**Cause:** OAuth consent screen incomplete  
**Fix:**
1. Complete all required fields in consent screen
2. Add yourself as test user
3. Ensure Calendar API is enabled

### Issue: "API not enabled"
**Cause:** Google Calendar API not activated  
**Fix:**
1. Go to: https://console.cloud.google.com/apis/library
2. Search "Google Calendar API"
3. Click "ENABLE"

---

## 📞 Need Help?

**Quick Links:**
- Google Console: https://console.cloud.google.com/
- Supabase Secrets: https://supabase.com/dashboard/project/bmkqdwgcpjhmabadmilx/settings/vault
- Test Calendar: http://localhost:5173/calendar

**Documentation:**
- `GOOGLE_CALENDAR_QUICK_SETUP.md` - 5-minute version
- `GOOGLE_CALENDAR_CREDENTIALS_SETUP.md` - Detailed guide
- `GOOGLE_OAUTH_REDIRECT_URLS.md` - Redirect URI reference

---

## 🎉 What Happens Next?

Once configured:
1. Users can connect their Google Calendar
2. System checks availability automatically
3. Appointments sync both ways
4. No more double-booking!
5. Professional calendar management

**You're almost there! Just follow the steps above.** 🚀
