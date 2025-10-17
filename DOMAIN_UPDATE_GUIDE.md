# 🌐 DOMAIN UPDATE GUIDE
## Update from heinhoven.com to hovenconstruction.com

**Your Actual Domain:** `hovenconstruction.com` (registered on GoDaddy)

---

## ✅ STEP 1: UPDATE SUPABASE (CRITICAL)

### A. Site URL Configuration
1. Go to: https://supabase.com/dashboard
2. Click **Authentication** → **URL Configuration**
3. Update **Site URL**: `https://hovenconstruction.com`
4. Update **Redirect URLs** - See **SUPABASE_REDIRECT_URLS_COMPLETE.md** for full list
5. Click **Save**

**Why this matters:** OAuth authentication won't work without correct redirect URLs.

**📄 Complete Instructions:** See `SUPABASE_REDIRECT_URLS_COMPLETE.md`

---

## ✅ STEP 2: UPDATE ENVIRONMENT VARIABLES

Your `.env` file should have:
```env
VITE_APP_DOMAIN=hovenconstruction.com
VITE_APP_NAME=Hoven Construction
```

**Already Updated:** ✅ `.env.example` file has been updated

---

## ✅ STEP 3: GODADDY DNS CONFIGURATION

### Point Your Domain to Hosting:

**If using Vercel/Netlify (Recommended):**
1. Log into GoDaddy
2. Go to: **My Products** → **Domains** → **hovenconstruction.com**
3. Click **DNS** → **Manage Zones**
4. Add these records:
   - **Type:** A Record
   - **Name:** @
   - **Value:** [Your hosting provider's IP]
   - **TTL:** 600 seconds

**If using GoDaddy Hosting:**
- Your domain should already point to GoDaddy servers
- Upload built files to public_html folder

---

## ✅ STEP 4: UPDATE GOOGLE OAUTH (When Setting Up)

**📄 Complete Instructions:** See `GOOGLE_OAUTH_REDIRECT_URLS.md`

**Quick Summary:**
1. Go to: https://console.cloud.google.com/apis/credentials
2. Add these **Authorized redirect URIs**:
   ```
   http://localhost:5173/calendar-callback
   http://localhost:5173/google-calendar-callback
   http://localhost:5173/google-business-callback
   https://hovenconstruction.com/calendar-callback
   https://hovenconstruction.com/google-calendar-callback
   https://hovenconstruction.com/google-business-callback
   ```

---

## ✅ STEP 5: UPDATE MICROSOFT OAUTH (When Setting Up)

**📄 Complete Instructions:** See `MICROSOFT_OAUTH_REDIRECT_URLS.md`

**Quick Summary:**
1. Go to: https://portal.azure.com
2. Navigate to: **App registrations** → Your App → **Authentication**
3. Add redirect URIs:
   ```
   http://localhost:5173/calendar-callback
   https://hovenconstruction.com/calendar-callback
   ```

---

## 📋 COMPLETE SETUP CHECKLIST

### Supabase Configuration
- [ ] Update Supabase Site URL to `hovenconstruction.com`
- [ ] Update Supabase Redirect URLs (see SUPABASE_REDIRECT_URLS_COMPLETE.md)
- [ ] Test authentication on localhost

### Domain & Hosting
- [ ] Update `.env` file with correct domain
- [ ] Point GoDaddy DNS to hosting provider
- [ ] Test site loads at hovenconstruction.com
- [ ] Verify SSL certificate is active (HTTPS)

### OAuth Configuration (When Ready)
- [ ] Update Google OAuth redirect URIs (see GOOGLE_OAUTH_REDIRECT_URLS.md)
- [ ] Update Microsoft OAuth redirect URIs (see MICROSOFT_OAUTH_REDIRECT_URLS.md)
- [ ] Test OAuth flows on production

### SEO & Analytics
- [ ] Submit sitemap: `https://hovenconstruction.com/sitemap.xml`
- [ ] Update Google Analytics property
- [ ] Update Google Search Console
- [ ] Update Bing Webmaster Tools

---

## 🎯 PRIORITY ORDER

**Do these NOW:**
1. ✅ Update Supabase URLs (CRITICAL for auth)
2. ✅ Verify `.env` file has correct domain
3. Configure GoDaddy DNS

**Do these when deploying:**
4. Update Google OAuth (if using Google Calendar/Business)
5. Update Microsoft OAuth (if using Outlook Calendar)
6. Submit sitemap to search engines

---

## 📞 SUPPORT RESOURCES

- **Supabase Docs:** https://supabase.com/docs/guides/auth
- **GoDaddy DNS Help:** https://www.godaddy.com/help/manage-dns
- **Google OAuth:** https://console.cloud.google.com
- **Microsoft OAuth:** https://portal.azure.com

---

## ⚠️ IMPORTANT

The app uses `VITE_APP_DOMAIN` from your `.env` file throughout the codebase, so once you update that variable, most domain references will automatically use `hovenconstruction.com`.
