# 🔐 COMPLETE SUPABASE REDIRECT URLs CONFIGURATION
## For hovenconstruction.com

**Last Updated:** October 6, 2025

---

## 📍 WHERE TO UPDATE

1. Go to: https://supabase.com/dashboard
2. Select your project: **bmkqdwgcpjhmabadmilx**
3. Click: **Authentication** → **URL Configuration**

---

## 🌐 SITE URL

Set the **Site URL** to:
```
https://hovenconstruction.com
```

---

## 🔗 REDIRECT URLs (Copy ALL of these)

### Production URLs (hovenconstruction.com)
```
https://hovenconstruction.com/*
https://hovenconstruction.com/auth/callback
https://hovenconstruction.com/calendar-callback
https://hovenconstruction.com/google-calendar-callback
https://hovenconstruction.com/google-business-callback
```

### Development URLs (localhost)
```
http://localhost:5173/*
http://localhost:5173/auth/callback
http://localhost:5173/calendar-callback
http://localhost:5173/google-calendar-callback
http://localhost:5173/google-business-callback
```

### Supabase Edge Function URL
```
https://bmkqdwgcpjhmabadmilx.supabase.co/functions/v1/google-calendar-auth
```

---

## 📋 COMPLETE LIST (Copy & Paste Ready)

```
https://hovenconstruction.com/*
https://hovenconstruction.com/auth/callback
https://hovenconstruction.com/calendar-callback
https://hovenconstruction.com/google-calendar-callback
https://hovenconstruction.com/google-business-callback
http://localhost:5173/*
http://localhost:5173/auth/callback
http://localhost:5173/calendar-callback
http://localhost:5173/google-calendar-callback
http://localhost:5173/google-business-callback
https://bmkqdwgcpjhmabadmilx.supabase.co/functions/v1/google-calendar-auth
```

**Total URLs:** 11

---

## 🔍 WHAT EACH URL DOES

| URL Pattern | Purpose |
|-------------|---------|
| `/*` | Wildcard for all routes |
| `/auth/callback` | General authentication callback |
| `/calendar-callback` | Multi-provider calendar auth |
| `/google-calendar-callback` | Google Calendar specific |
| `/google-business-callback` | Google Business Profile |
| Edge Function URL | Server-side OAuth flow |

---

## ✅ STEP-BY-STEP INSTRUCTIONS

### Step 1: Clear Existing URLs (if needed)
1. In Supabase Dashboard → Authentication → URL Configuration
2. Remove any incorrect or duplicate URLs
3. Look for typos like `.com.com` or misspelled domains

### Step 2: Add Site URL
1. Find **Site URL** field
2. Enter: `https://hovenconstruction.com`
3. Do NOT click Save yet

### Step 3: Add All Redirect URLs
1. Scroll to **Redirect URLs** section
2. Copy the complete list above
3. Paste each URL on a new line (or add one by one)

### Step 4: Save Configuration
1. Click **Save** button at bottom
2. Wait for success confirmation
3. Refresh page to verify URLs saved

---

## ✅ VERIFICATION CHECKLIST

After adding all URLs:

- [ ] Site URL set to `https://hovenconstruction.com`
- [ ] All 11 redirect URLs added
- [ ] Clicked **Save** button
- [ ] No typos in domain name
- [ ] Both localhost and production URLs included
- [ ] Wildcard URLs (`/*`) included
- [ ] Edge function URL included

---

## 🚨 COMMON ISSUES

**Issue: "Invalid redirect URL"**
- Check for typos
- Ensure proper http:// or https:// prefix
- No trailing slashes except for root domain

**Issue: OAuth still failing**
- Clear browser cache
- Check Google/Microsoft OAuth consoles match these URLs
- Verify `.env` file has correct domain

**Issue: Works on localhost but not production**
- Verify production URLs are added
- Check DNS is pointing to correct hosting
- Ensure SSL certificate is active

---

## 📞 RELATED DOCUMENTATION

- `GOOGLE_OAUTH_REDIRECT_URLS.md` - Google OAuth setup
- `MICROSOFT_OAUTH_REDIRECT_URLS.md` - Microsoft OAuth setup
- `DOMAIN_UPDATE_GUIDE.md` - Complete domain migration guide

---

**Status:** Ready to configure ✅
**Your Domain:** hovenconstruction.com
**Your Supabase Project:** bmkqdwgcpjhmabadmilx
