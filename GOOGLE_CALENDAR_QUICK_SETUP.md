# ⚡ Google Calendar - 5 Minute Setup

## Current Status
✅ Database configured  
✅ Edge functions deployed  
✅ Frontend components ready  
❌ **Need OAuth credentials**

---

## 🎯 What You Need to Do

### 1️⃣ Get Google Credentials (3 minutes)

**Go to:** https://console.cloud.google.com/apis/credentials

**Click:** "Create Credentials" → "OAuth client ID"

**Configure:**
- Application type: **Web application**
- Name: **Hoven Construction**
- Authorized redirect URIs:
  ```
  http://localhost:5173/google-calendar-callback
  https://hovenconstruction.com/google-calendar-callback
  ```

**Result:** You'll get:
- Client ID: `123456789-abc.apps.googleusercontent.com`
- Client Secret: `GOCSPX-abc123xyz`

---

### 2️⃣ Add to Supabase (1 minute)

**Go to:** https://supabase.com/dashboard/project/bmkqdwgcpjhmabadmilx/settings/vault

**Add 3 secrets:**

| Secret Name | Value |
|-------------|-------|
| `GOOGLE_CLIENT_ID` | Your Client ID |
| `GOOGLE_CLIENT_SECRET` | Your Client Secret |
| `VITE_GOOGLE_CLIENT_ID` | Your Client ID (same as above) |

---

### 3️⃣ Update Local .env (30 seconds)

Add to `.env.local`:
```env
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
```

**Restart dev server:**
```bash
npm run dev
```

---

## ✅ Test It

1. Go to: http://localhost:5173/calendar
2. Click "Connect Google Calendar"
3. Authorize with Google
4. Done! ✨

---

## 🚨 Quick Fixes

**"redirect_uri_mismatch"**
→ Add exact URL to Google Console

**"Client ID not configured"**
→ Restart dev server after adding .env.local

**"API not enabled"**
→ Enable Google Calendar API at:
https://console.cloud.google.com/apis/library/calendar-json.googleapis.com

---

## 📞 Already Have Credentials?

If you already created OAuth credentials before:

1. Find them at: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID
3. Copy the Client ID and Secret
4. Add redirect URIs if missing
5. Follow steps 2️⃣ and 3️⃣ above

---

**That's it! 5 minutes and you're done.** 🎉
