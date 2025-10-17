# Google OAuth Setup Instructions

## 🚀 Quick Setup Guide

### Current Status
- ✅ Client ID configured: `309881425631-rlso29r8fj72194v07n1j5eo5sspa7ck`
- ✅ Environment variables set in .env
- ✅ ReviewsManagementDashboard integrated in AdminDashboard
- ⏳ Awaiting redirect URI configuration in Google Cloud Console
- ⏳ Awaiting OAuth authorization

## Step 1: Add Redirect URIs to Google Cloud Console

1. **Open Google Cloud Console**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Sign in with your Google account

2. **Find Your OAuth Client**
   - Look for OAuth 2.0 Client ID: `309881425631-rlso29r8fj72194v07n1j5eo5sspa7ck`
   - Click on it to edit

3. **Add Authorized Redirect URIs**
   
   Copy and add each of these URIs exactly:
   
   **For Development (localhost):**
   ```
   http://localhost:5173/google-business-callback
   http://localhost:5173/google-calendar-callback
   http://localhost:5173/calendar-callback
   ```
   
   **For Production (Supabase):**
   ```
   https://njxhcmqtbkzvqpbqxfpn.supabase.co/google-business-callback
   https://njxhcmqtbkzvqpbqxfpn.supabase.co/google-calendar-callback
   https://njxhcmqtbkzvqpbqxfpn.supabase.co/calendar-callback
   ```

4. **Save Changes**
   - Click "SAVE" at the bottom of the page
   - Wait for changes to propagate (usually instant)

## Step 2: Verify APIs are Enabled

1. Go to: https://console.cloud.google.com/apis/library
2. Search and enable these APIs if not already enabled:
   - Google Business Profile API
   - Google My Business API
   - Google Calendar API

## Step 3: Complete OAuth Authorization

### Option A: Use the Setup Verification Page
1. Navigate to: http://localhost:5173/google-oauth-setup
2. Follow the on-screen instructions
3. Click "Connect Google Business Profile"

### Option B: Use Admin Dashboard
1. Navigate to: http://localhost:5173/admin
2. Click on the "Reviews" tab
3. Click "Connect Google Business Profile"
4. Complete the Google sign-in process
5. Grant permissions for:
   - View business information
   - Manage and respond to reviews
   - View business locations

## Step 4: Verify Connection

After successful authorization:
1. You'll be redirected back to the application
2. Check the Reviews tab in Admin Dashboard
3. You should see:
   - "Connected" status
   - Your Google Business locations
   - Reviews starting to sync

## Troubleshooting

### Common Issues and Solutions

#### "Redirect URI Mismatch" Error
- Double-check URIs are added exactly as shown (no trailing slashes)
- Ensure you're using the correct environment (localhost vs production)
- Verify http vs https protocol

#### "Access Blocked: This app's request is invalid"
- Check OAuth consent screen is configured
- Add test users if app is in testing mode
- Consider publishing app for production use

#### "Insufficient Permissions" Error
- Ensure Google Business Profile API is enabled
- Verify the account has access to Google Business Profile
- Check that business.manage scope is included

#### Reviews Not Syncing
1. Check edge function logs in Supabase Dashboard
2. Verify oauth_tokens table has valid tokens
3. Ensure google_reviews table exists with proper schema
4. Check sync-google-reviews edge function is deployed

## Testing the Integration

1. **Test OAuth Flow**
   ```bash
   # Navigate to setup page
   http://localhost:5173/google-oauth-setup
   ```

2. **Check Database**
   ```sql
   -- Check if OAuth tokens are stored
   SELECT * FROM oauth_tokens WHERE provider = 'google_business';
   
   -- Check if reviews are syncing
   SELECT * FROM google_reviews ORDER BY created_at DESC;
   ```

3. **Test Review Response**
   - Go to Admin Dashboard > Reviews
   - Find a review without a response
   - Click "Generate AI Response" or write manual response
   - Submit response

## Security Notes

- Never commit the .env file with real credentials
- Keep OAuth client secret secure
- Use environment variables for all sensitive data
- Regularly rotate access tokens
- Monitor API usage in Google Cloud Console

## Next Steps After Setup

1. ✅ Verify reviews are syncing
2. ✅ Test AI response generation
3. ✅ Configure review notification settings
4. ✅ Set up automated review response workflows
5. ✅ Monitor review metrics in dashboard

## Support Resources

- [Google Business Profile API Documentation](https://developers.google.com/my-business)
- [OAuth 2.0 for Web Apps](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

## Contact for Issues

If you encounter issues not covered here:
1. Check Supabase Dashboard logs
2. Review browser console for errors
3. Verify all environment variables are set
4. Ensure database tables are properly configured