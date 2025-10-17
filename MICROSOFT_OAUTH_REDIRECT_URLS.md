# 🔐 MICROSOFT OAUTH REDIRECT URLs CONFIGURATION
## For hovenconstruction.com

**Last Updated:** October 6, 2025

---

## 📍 Where to Add These URLs

1. Go to: https://portal.azure.com
2. Navigate to: **Azure Active Directory** → **App registrations**
3. Select your app (or create new registration)
4. Click **Authentication** in left sidebar
5. Under **Platform configurations** → **Web** → Click **Add URI**

---

## 🔗 REDIRECT URLs TO ADD

### Copy ALL of these:

```
http://localhost:5173/calendar-callback
http://localhost:5173/auth/callback
https://hovenconstruction.com/calendar-callback
https://hovenconstruction.com/auth/callback
```

---

## ⚙️ ADDITIONAL SETTINGS

### Implicit Grant and Hybrid Flows
Enable these checkboxes:
- ✅ **Access tokens** (used for implicit flows)
- ✅ **ID tokens** (used for implicit and hybrid flows)

### Supported Account Types
Select: **Accounts in any organizational directory and personal Microsoft accounts**

---

## 📋 WHAT EACH URL DOES

| URL | Purpose |
|-----|---------|
| `/calendar-callback` | Outlook Calendar integration |
| `/auth/callback` | General Microsoft OAuth authentication |

---

## ✅ VERIFICATION CHECKLIST

After configuration:
- [ ] All 4 redirect URIs added
- [ ] Implicit grant tokens enabled
- [ ] Account types configured
- [ ] Clicked **Save** button
- [ ] Copied Client ID to `.env` file
- [ ] Generated and stored Client Secret in Supabase

---

## 🚨 COMMON ISSUES

**Error: "AADSTS50011: The reply URL specified in the request does not match"**
- Check for typos in redirect URIs
- Ensure exact match (including http/https and trailing slashes)

**Error: "AADSTS700016: Application not found"**
- Verify Client ID in `.env` matches Azure portal
- Check Application (client) ID, not Object ID

---

## 📞 NEED HELP?

See: `MICROSOFT_OAUTH_SETUP.md` for complete setup instructions
