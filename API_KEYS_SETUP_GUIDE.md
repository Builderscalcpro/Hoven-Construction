# API Keys Setup Guide

This guide will walk you through setting up all required API keys for the Hein Hoven Construction website.

## 🔑 Required Keys (Already Configured)

### ✅ Supabase
- **Status**: Already configured
- **URL**: `https://qdxondojktchkjbbrtaq.supabase.co`
- **Anon Key**: Already set in `.env.example`

## 🔧 Keys That Need Configuration

### 1. Google OAuth & Calendar Integration

**Purpose**: Enables Google Calendar sync and authentication

**Setup Steps**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable these APIs:
   - Google Calendar API
   - Google People API (for profile info)
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen
6. Create OAuth Client ID:
   - Application type: Web application
   - Authorized redirect URIs: 
     - `http://localhost:5173/google-calendar-callback`
     - `https://yourdomain.com/google-calendar-callback`
7. Copy the **Client ID** and **API Key**

**Add to `.env`**:
```
VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=your_api_key_here
```

### 2. Google Business Profile Integration

**Purpose**: Sync and display Google Business reviews

**Setup Steps**:
1. Same Google Cloud Console project as above
2. Enable "Google Business Profile API"
3. Create OAuth 2.0 credentials (or use existing)
4. Authorized redirect URIs:
   - `http://localhost:5173/google-business-callback`
   - `https://yourdomain.com/google-business-callback`
5. Copy Client ID and Client Secret

**Add to `.env`**:
```
VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID=your_client_id.apps.googleusercontent.com
```

**Add Client Secret to Supabase**:
- Go to Supabase Dashboard → Project Settings → Secrets
- Add: `GOOGLE_BUSINESS_PROFILE_CLIENT_SECRET=your_secret`

### 3. Google Analytics 4

**Purpose**: Track website traffic and user behavior

**Setup Steps**:
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create account or use existing
3. Create a new GA4 property
4. Set up data stream for your website
5. Copy the **Measurement ID** (format: G-XXXXXXXXXX)

**Add to `.env`**:
```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Also update** `src/lib/analytics.ts` line 21:
```typescript
window.gtag('config', 'G-XXXXXXXXXX', {  // Replace with your actual ID
```

### 4. Stripe Payment Processing

**Purpose**: Accept payments for invoices and deposits

**Setup Steps**:
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create account or sign in
3. Get your **Publishable Key**:
   - Dashboard → Developers → API Keys
   - Use **Test mode** key for development (starts with `pk_test_`)
   - Use **Live mode** key for production (starts with `pk_live_`)

**Add to `.env`**:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### 5. Sentry Error Tracking (Optional)

**Purpose**: Monitor errors and performance

**Setup Steps**:
1. Go to [Sentry.io](https://sentry.io/)
2. Create account and project
3. Select "React" as platform
4. Copy the **DSN** provided

**Add to `.env`**:
```
VITE_SENTRY_DSN=https://your_dsn@sentry.io/project_id
```

### 6. Application Configuration

**Add to `.env`**:
```
VITE_APP_DOMAIN=heinhoven.com
VITE_APP_NAME=Hein Hoven Construction
```

## 📝 Complete .env File Template

Create a `.env` file in your project root with:

```env
# Supabase (Already Configured)
VITE_SUPABASE_URL=https://qdxondojktchkjbbrtaq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkeG9uZG9qa3RjaGtqYmJydGFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NTQ5MjMsImV4cCI6MjA3NTAzMDkyM30.2ZArRE1OTDdS6VMyclNgvr5y5G6x2PwbfC-1T8K5U-0

# Google OAuth & Calendar
VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=your_google_api_key

# Google Business Profile
VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID=your_client_id.apps.googleusercontent.com

# Application
VITE_APP_DOMAIN=heinhoven.com
VITE_APP_NAME=Hein Hoven Construction

# Google Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Stripe Payments
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# Sentry (Optional)
VITE_SENTRY_DSN=https://your_dsn@sentry.io/project_id
```

## 🚀 Deployment

When deploying to production (Netlify/Vercel):
1. Add all environment variables in hosting platform settings
2. Use production keys (not test keys)
3. Update redirect URIs to production domain
4. Never commit `.env` file to git

## ✅ Verification Checklist

- [ ] Supabase connection working
- [ ] Google Calendar sync functional
- [ ] Google Business reviews displaying
- [ ] Analytics tracking events
- [ ] Stripe payment forms loading
- [ ] No console errors about missing keys
