# 🔐 GOOGLE OAUTH REDIRECT URLs CONFIGURATION
## For hovenconstruction.com

**Last Updated:** October 6, 2025

---

## 📍 Where to Add These URLs

1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your **OAuth 2.0 Client ID** (or create one)
3. Scroll to **Authorized redirect URIs**
4. Click **+ ADD URI** for each URL below

---

## 🔗 REDIRECT URLs TO ADD

### Copy ALL of these (one per line):

```
http://localhost:5173/auth/callback
http://localhost:5173/calendar-callback
http://localhost:5173/google-calendar-callback
http://localhost:5173/google-business-callback
https://hovenconstruction.com/auth/callback
https://hovenconstruction.com/calendar-callback
https://hovenconstruction.com/google-calendar-callback
https://hovenconstruction.com/google-business-callback
```

---

## 📋 WHAT EACH URL DOES

| URL | Purpose |
|-----|---------|
| `/auth/callback` | General OAuth authentication |
| `/calendar-callback` | Google Calendar integration |
| `/google-calendar-callback` | Google Calendar specific flows |
| `/google-business-callback` | Google Business Profile integration |

---

## ✅ VERIFICATION CHECKLIST

After adding URLs:
- [ ] All 8 URLs added (4 localhost + 4 production)
- [ ] No typos in domain name
- [ ] Clicked **Save** button
- [ ] Enabled required APIs (Calendar, Business Profile, People)

---

## 🚨 COMMON ISSUES

**Error: "redirect_uri_mismatch"**
- Check for typos in URLs
- Ensure URLs match EXACTLY (including http/https)
- Verify OAuth Client ID is correct in `.env`

**Error: "Access blocked: This app's request is invalid"**
- Add OAuth consent screen information
- Add test users if app is in testing mode

---

## 📞 NEED HELP?

See: `GOOGLE_OAUTH_COMPLETE_SETUP.md` for full setup instructions
