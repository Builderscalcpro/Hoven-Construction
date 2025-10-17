# Google Business Profile Integration - Running Guide

## ✅ Integration Status: READY TO RUN

The Google Business Profile integration is fully configured and ready to use!

## 📍 Available Pages

### 1. **Connection Manager** (`/google-business-connect`)
- Connect/disconnect your Google Business Profile
- View connection status
- See account and location details
- Admin access only

### 2. **Demo/Test Dashboard** (`/google-business-demo`)
- Test the integration
- View synced reviews
- Check business information
- Perform quick actions
- Admin access only

### 3. **Full Dashboard** (`/dashboard?tab=google-business`)
- Complete Google Business management
- Review responses
- Business info sync
- Analytics

## 🚀 Quick Start

### Step 1: Connect Your Account
```
1. Navigate to: /google-business-connect
2. Click "Connect with Google"
3. Authorize the application
4. You'll be redirected back with connection confirmed
```

### Step 2: Test the Integration
```
1. Navigate to: /google-business-demo
2. View connection status
3. Sync reviews
4. Check business information
5. Test all features
```

### Step 3: Use Full Dashboard
```
1. Navigate to: /dashboard
2. Click "Google Business Profile" card
3. Manage reviews and responses
4. Update business information
```

## 🔧 Edge Functions (Already Deployed)

1. **google-business-auth** - OAuth token management
2. **google-business-reviews** - Fetch and reply to reviews
3. **google-business-locations** - Get accounts and locations
4. **sync-google-reviews** - Automated review syncing

## 📊 Database Tables

- `google_business_tokens` - OAuth tokens and connection data
- `google_reviews` - Synced reviews from Google
- `google_business_info` - Business profile information

## 🎯 Features Available

✅ OAuth connection management
✅ Review syncing
✅ AI-powered review responses
✅ Business information display
✅ Connection status monitoring
✅ Manual sync triggers
✅ Multi-tab interface

## 🔐 Required Environment Variables

```env
VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID=your_client_id
VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_SECRET=your_client_secret
```

## 📱 Access the Integration

**From Dashboard:**
- Login as admin
- Click "Google Business Profile" card
- Or click "Reviews Management" card

**Direct URLs:**
- Connect: `/google-business-connect`
- Demo: `/google-business-demo`
- Full Dashboard: `/dashboard?tab=google-business`

## 🎉 You're All Set!

The Google Business integration is ready to run. Just navigate to any of the pages above and start managing your business profile!
