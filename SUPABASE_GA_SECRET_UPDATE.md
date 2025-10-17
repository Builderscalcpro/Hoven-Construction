# 🔐 Supabase Secret Update Required

## Action Needed: Update Google Analytics Measurement ID

Your Google Analytics 4 tracking is configured in the frontend (`index.html`), but the **Supabase Edge Functions** also need access to this ID for server-side tracking via the `analytics.ts` library.

### ⚠️ Current Status
- ✅ Frontend tracking configured (index.html)
- ⚠️ Supabase secret needs update

### 📋 Steps to Update

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Sign in to your account

2. **Navigate to Your Project**
   - Select your Hoven Construction project

3. **Access Secrets Management**
   - Click **Project Settings** (gear icon in sidebar)
   - Click **Edge Functions** in the left menu
   - Click **Secrets** tab

4. **Update the Secret**
   - Find `VITE_GA_MEASUREMENT_ID` in the list
   - Click **Edit** or **Add new secret** if it doesn't exist
   - Set the value to: `G-VB8WCV9VEW`
   - Click **Save**

5. **Verify**
   - The secret should now show as configured
   - Your Edge Functions can now access GA tracking

### 🎯 Why This Matters

The `src/lib/analytics.ts` file uses this environment variable to:
- Track server-side events
- Send conversion data to GA4
- Monitor API performance
- Track backend errors

Without this secret, server-side analytics won't work properly.

### ✅ After Update

Once updated, your analytics will track:
- ✅ Client-side page views (via index.html)
- ✅ Server-side events (via analytics.ts)
- ✅ API calls and performance
- ✅ Backend conversions

---

**Current GA4 Measurement ID:** `G-VB8WCV9VEW`
