# 🔑 API Credentials Setup Guide

## ✅ Already Configured (Ready to Use)

### Supabase
- **URL**: `https://qdxondojktchkjbbrtaq.supabase.co`
- **Anon Key**: ✅ Configured in `.env`
- **Status**: Fully operational

### Google Services
- **Client ID**: `309881425631-rlso29r8fj72194v07n1j5eo5sspa7ck.apps.googleusercontent.com`
- **API Key**: `AIzaSyAO8kN_Je2kfLgq8FtE2r7gb03stDJ5sPw`
- **Status**: Ready for Google Calendar & Business Profile

### Google Analytics
- **Measurement ID**: `G-KB485Y4Z44`
- **Status**: Tracking configured

### Application Info
- **Domain**: `hovenconstruction.com`
- **Name**: `Hoven Construction`

---

## ⚠️ NEEDS YOUR ACTION

### 1. Stripe Payment Keys
**Current Status**: Using placeholder test key  
**Why Needed**: To process real payments

**Steps to Get Real Key:**
1. Go to https://dashboard.stripe.com/apikeys
2. Sign in to your Stripe account
3. Copy the **Publishable key** (starts with `pk_test_` for test mode or `pk_live_` for production)
4. Update in `.env` file:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
   ```

**Also Set in Supabase** (for backend):
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
```

---

### 2. Microsoft OAuth (Optional)
**Current Status**: Placeholder  
**Why Needed**: For Outlook Calendar integration

**Steps:**
1. Go to https://portal.azure.com
2. Navigate to **Azure Active Directory** → **App registrations**
3. Create new registration or use existing
4. Copy **Application (client) ID**
5. Update in `.env`:
   ```
   VITE_MICROSOFT_CLIENT_ID=your_actual_client_id
   ```

---

### 3. Google Tag Manager (Optional)
**Current Status**: Placeholder  
**Why Needed**: For advanced analytics tracking

**Steps:**
1. Go to https://tagmanager.google.com
2. Create a new container or use existing
3. Copy the **Container ID** (format: GTM-XXXXXXX)
4. Update in `.env`:
   ```
   VITE_GTM_ID=GTM-YOUR_ACTUAL_ID
   ```

---

### 4. Sentry Error Tracking (Optional)
**Current Status**: Placeholder  
**Why Needed**: For production error monitoring

**Steps:**
1. Go to https://sentry.io
2. Create a new project (React)
3. Copy the **DSN** URL
4. Update in `.env`:
   ```
   VITE_SENTRY_DSN=https://your_actual_dsn@sentry.io/project_id
   ```

---

## 🔐 Supabase Secrets (Backend Keys)

These are already configured in Supabase Dashboard but listed here for reference:

### Already Set ✅
- `ANTHROPIC_API_KEY` - For AI chatbot
- `GOOGLE_CLIENT_SECRET` - For Google OAuth
- `GOOGLE_BUSINESS_PROFILE_CLIENT_SECRET` - For Google Business
- `SENDGRID_API_KEY` - For email sending

### May Need Setup ⚠️
```bash
# Stripe (if not set)
supabase secrets set STRIPE_SECRET_KEY=sk_test_YOUR_KEY

# Microsoft (if using Outlook)
supabase secrets set MICROSOFT_CLIENT_SECRET=YOUR_SECRET
```

---

## 📋 Quick Verification Checklist

After updating credentials, verify:

- [ ] Restart dev server: `npm run dev`
- [ ] Test Google Calendar connection at `/calendar-dashboard`
- [ ] Test payment processing at `/project-management` (create invoice)
- [ ] Check browser console for any "missing key" errors
- [ ] Verify Supabase connection in admin dashboard

---

## 🚀 After Setup

Once all keys are configured:
1. **Restart your development server**
2. **Test each integration** using the admin dashboard
3. **Check logs** in Supabase Dashboard → Edge Functions
4. **Monitor errors** in browser console

---

## 📞 Support Resources

- **Supabase Dashboard**: https://supabase.com/dashboard/project/qdxondojktchkjbbrtaq
- **Google Cloud Console**: https://console.cloud.google.com
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Microsoft Azure**: https://portal.azure.com

---

## 🔒 Security Notes

1. **.env file is in .gitignore** - Never commit it to version control
2. **Only VITE_* variables** are exposed to the browser
3. **Secret keys** (like STRIPE_SECRET_KEY) should ONLY be in Supabase secrets
4. **Rotate keys regularly** for production use
