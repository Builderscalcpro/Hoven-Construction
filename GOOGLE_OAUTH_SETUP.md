# Google Business Profile OAuth Setup - Quick Start

## ✅ Configuration Complete

Your Google Business Profile OAuth Client ID has been configured:
```
309881425631-4blqrff1i32ijj2qqfhngpb8j8m51n07.apps.googleusercontent.com
```

## 🚀 How to Connect

### Step 1: Access the Dashboard
1. Go to your website
2. Click **"Sign In"** in the top navigation
3. Log in with your credentials
4. You'll be redirected to the Dashboard

### Step 2: Connect Google Business Profile
1. On the Dashboard, find the **"Google Business Profile"** card
2. Click on it to open the Google Business setup page
3. Click the **"Connect with Google"** button
4. You'll be redirected to Google to authorize access
5. Sign in with your Google account that manages your business
6. Grant permissions to access your Google Business Profile
7. You'll be redirected back to your dashboard

### Step 3: View Your Reviews
- Once connected, your real Google reviews will appear on your homepage
- Manage reviews from the Dashboard → Google Business Profile section

## 📋 What You Need

Before connecting, make sure you have:
- ✅ A Google Business Profile account
- ✅ Admin access to your business listing
- ✅ The Google account email that manages your business

## 🔧 Additional Setup Required

You still need to add your **Client Secret** to complete the OAuth setup:

1. Go to your `.env.local` file
2. Add your Client Secret:
```
VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_SECRET=your_secret_here
```

## 🌐 OAuth Redirect URIs

Make sure these redirect URIs are added in your Google Cloud Console:

**For Development:**
```
http://localhost:5173/google-business-callback
```

**For Production:**
```
https://yourdomain.com/google-business-callback
```

## 📍 Where to Find the Setup Page

**Direct URLs:**
- Dashboard: `/dashboard`
- Google Business Setup: `/dashboard` (then click Google Business Profile card)
- Or use query parameter: `/dashboard?tab=google-business`

## 🆘 Troubleshooting

**"Client ID not configured" error:**
- Make sure you've restarted your development server after adding the .env.local file
- Vite requires a restart to pick up new environment variables

**OAuth redirect error:**
- Verify the redirect URI in Google Cloud Console matches exactly
- Check that the Client ID is correct

**Not seeing the connect button:**
- Make sure you're logged in
- Check browser console for any errors
