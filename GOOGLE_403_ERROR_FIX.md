# 🔴 FIXING GOOGLE 403 ERROR

## The 403 error means Google is blocking access. Here's how to fix it:

---

## ✅ STEP 1: Check OAuth Consent Screen

1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. **Publishing Status** must be one of:
   - **Testing** (add your email as test user)
   - **In Production** (requires verification for sensitive scopes)

### If in TESTING mode:
- Click **"Add Users"** under "Test users"
- Add YOUR email address (the one you'll use to sign in)
- Save

---

## ✅ STEP 2: Verify Scopes Are Correct

Your app should request ONLY these scopes:
```
https://www.googleapis.com/auth/calendar
https://www.googleapis.com/auth/calendar.events
https://www.googleapis.com/auth/business.manage
```

**DO NOT request:**
- Sensitive scopes without verification
- Drive, Gmail, or other unrelated APIs

---

## ✅ STEP 3: Check Redirect URIs Match EXACTLY

In Google Cloud Console → Credentials → OAuth 2.0 Client:

**Authorized JavaScript origins:**
```
http://localhost:5173
https://heinhoven.com
```

**Authorized redirect URIs:**
```
http://localhost:5173/google-calendar-callback
http://localhost:5173/google-business-callback
https://heinhoven.com/google-calendar-callback
https://heinhoven.com/google-business-callback
```

⚠️ **NO trailing slashes!**

---

## ✅ STEP 4: Enable Required APIs

Go to: https://console.cloud.google.com/apis/library

Enable these APIs:
- ✅ Google Calendar API
- ✅ Google My Business API
- ✅ Google Business Profile API

---

## ✅ STEP 5: Clear Browser Cache

1. Open DevTools (F12)
2. Right-click refresh button → "Empty Cache and Hard Reload"
3. Or use Incognito/Private window

---

## 🧪 QUICK TEST

After making changes above:
1. Restart dev server: `npm run dev`
2. Go to Calendar Dashboard
3. Click "Connect Google Calendar"
4. You should see Google's consent screen (not 403)

---

## 🆘 STILL GETTING 403?

**Check the exact error in browser console:**
```
F12 → Console tab → Look for error details
```

Common causes:
- ❌ App not in Testing mode with your email added
- ❌ Requesting unverified sensitive scopes
- ❌ API not enabled
- ❌ Wrong project selected in Cloud Console
