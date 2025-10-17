# 🚀 Google Business Profile - Quick Connect (5 Minutes)

## ⚡ Quick Setup Checklist

### ✅ Step 1: Google Cloud Console (2 min)
1. Open [Google Cloud Console](https://console.cloud.google.com)
2. **Enable API**: Search "My Business Business Information API" → ENABLE
3. **OAuth Screen**: Set to External, add your email
4. **Create Credentials**: 
   - Type: OAuth 2.0 Client ID
   - Application type: Web application
   - Redirect URI: `http://localhost:5173/google-business-callback`

### ✅ Step 2: Copy Client ID (30 sec)
From Google Console, copy your Client ID:
```
309881425631-xxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
```

### ✅ Step 3: Add to .env (30 sec)
```env
VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID=your-client-id-here
```

### ✅ Step 4: Connect Account (2 min)
1. **Navigate**: http://localhost:5173/google-business-connect
2. **Click**: "Connect with Google" button
3. **Authorize**: Select account → Allow permissions
4. **Done**: Redirects to dashboard with connection confirmed

## 🎯 Success Indicators
- ✅ Green "Connected Successfully" card appears
- ✅ Account ID and Location ID displayed
- ✅ Reviews start syncing automatically
- ✅ Dashboard shows Google Business tab

## ⚠️ Quick Fixes

| Issue | Solution |
|-------|----------|
| No Client ID | Check .env file has `VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID` |
| Auth Error | Verify redirect URI matches exactly |
| No Business | Ensure Google account has Business Profile access |
| Connection Failed | Check browser console, retry connection |

## 📱 Test Your Connection
```bash
# Quick test URL
http://localhost:5173/google-business-connect

# View connected status
http://localhost:5173/dashboard?tab=google-business
```

## 🔗 Direct Links
- [Connect Now](http://localhost:5173/google-business-connect)
- [View Dashboard](http://localhost:5173/dashboard)
- [Google Cloud Console](https://console.cloud.google.com)

---
**Time to Connect**: ~5 minutes total ⏱️