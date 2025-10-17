# 🏢 Google Business Profile Connection Guide

## ✅ Prerequisites

Before connecting, ensure you have:
1. **Admin access** to your Google Business Profile
2. **Google Cloud Console** project with Business Profile API enabled
3. **OAuth 2.0 credentials** configured

## 📋 Step 1: Google Cloud Console Setup

### 1.1 Enable the API
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project or create a new one
3. Navigate to **APIs & Services** → **Library**
4. Search for "**My Business Business Information API**"
5. Click **ENABLE**

### 1.2 Configure OAuth Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type
3. Fill in required fields:
   - App name: "Your Business Name"
   - User support email: your-email@domain.com
   - Developer contact: your-email@domain.com
4. Add scopes:
   - `https://www.googleapis.com/auth/business.manage`
5. Add test users (your Google account email)

### 1.3 Create OAuth Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Choose **Web application**
4. Add authorized redirect URIs:
   ```
   http://localhost:5173/google-business-callback
   https://your-domain.com/google-business-callback
   ```
5. Save and copy your **Client ID**

## 🔧 Step 2: Configure Your Application

### 2.1 Update Environment Variables
Add to your `.env` file:
```env
VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID=your-client-id-here
```

### 2.2 Verify Database Table
Ensure `google_business_tokens` table exists:
```sql
CREATE TABLE google_business_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  access_token TEXT,
  refresh_token TEXT,
  token_expiry TIMESTAMP,
  account_id TEXT,
  location_id TEXT,
  last_sync TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Step 3: Connect Your Account

### 3.1 Navigate to Connection Page
1. Log in as admin
2. Go to: `http://localhost:5173/google-business-connect`

### 3.2 Initiate Connection
1. Click **"Connect with Google"** button
2. You'll be redirected to Google's OAuth consent screen

### 3.3 Authorize Access
1. Select your Google account
2. Review permissions requested
3. Click **"Allow"** to grant access

### 3.4 Complete Setup
1. You'll be redirected back to `/google-business-callback`
2. The app will:
   - Exchange authorization code for tokens
   - Fetch your business accounts
   - Save connection details
3. You'll be redirected to the dashboard

## ✨ Step 4: Verify Connection

### Check Connection Status
Navigate to dashboard and verify:
- ✅ Connection status shows "Connected"
- ✅ Account ID is displayed
- ✅ Location ID is present
- ✅ Last sync timestamp is recent

### Test Features
1. **Reviews Sync**: Check if reviews are loading
2. **Business Info**: Verify business details are fetched
3. **AI Responses**: Test review response generation

## 🔴 Troubleshooting

### Common Issues & Solutions

#### "Client ID not configured"
- Ensure `VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID` is in `.env`
- Restart development server after adding

#### "Authorization Error"
- Verify redirect URI matches exactly in Google Console
- Check OAuth consent screen is published (or in test mode with your email)

#### "No Business Accounts Found"
- Ensure you have admin access to a Google Business Profile
- Verify the Google account you're using owns/manages the business

#### "Token Expired"
- The app should auto-refresh tokens
- If not, disconnect and reconnect

## 📊 Using the Connection

Once connected, you can:
1. **View Reviews**: Dashboard → Google Business tab
2. **Generate AI Responses**: Click on any review
3. **Sync Business Info**: Updates automatically
4. **Monitor Performance**: View review analytics

## 🔒 Security Notes

- Tokens are encrypted and stored securely
- Refresh tokens enable automatic re-authentication
- Only admin users can manage connections
- Tokens expire after 1 hour (auto-refresh enabled)

## 📞 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Review Supabase logs for edge function errors
3. Verify all prerequisites are met
4. Contact support with error details

---

**Quick Connection URL**: [Connect Now](http://localhost:5173/google-business-connect)