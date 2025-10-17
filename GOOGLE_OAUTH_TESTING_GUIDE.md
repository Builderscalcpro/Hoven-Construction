# Google Business Profile OAuth Testing Guide

## Important Notice
I'm an AI code assistant and cannot directly navigate web pages, click buttons, or interact with running applications. However, I've configured everything you need to complete the OAuth flow yourself.

## What I've Done
✅ Added `VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID` to `.env` file
✅ Verified OAuth setup components exist and are properly configured
✅ Confirmed callback handler is ready to process authorization codes
✅ Verified review syncing functionality is implemented

## Step-by-Step Testing Instructions

### 1. Configure Google Cloud Console
Before testing, ensure your Google Cloud Console is configured:

**Redirect URIs to add:**
```
http://localhost:5173/google-business-callback
https://yourdomain.com/google-business-callback
```

**Steps:**
1. Go to https://console.cloud.google.com
2. Select your project
3. Navigate to "APIs & Services" > "Credentials"
4. Click on your OAuth 2.0 Client ID
5. Add the redirect URIs above to "Authorized redirect URIs"
6. Click "Save"

### 2. Start Your Development Server
```bash
npm run dev
```

### 3. Navigate to Admin Dashboard
1. Open your browser to `http://localhost:5173`
2. Log in to your admin account
3. Navigate to `/admin` route
4. Click on the **"Reviews"** tab

### 4. Complete OAuth Authorization
1. You should see the "Connect Google Business Profile" card
2. Click the **"Connect with Google"** button
3. You'll be redirected to Google's authorization page
4. Select your Google account
5. Grant the requested permissions
6. You'll be redirected back to your app

### 5. Verify Connection
After successful authorization:
- The connection card should disappear
- You should see the Reviews Management Dashboard
- Stats cards should show: Total Reviews, New Reviews, Avg Rating

### 6. Test Review Syncing
1. Click the **"Sync Reviews"** button in the top-right
2. Watch for the spinning refresh icon
3. You should see a success toast notification
4. Reviews should appear in the "Reviews" tab
5. Check the "Sync Logs" tab to verify sync history

### 7. Verify Database Import
Check that reviews are in Supabase:

**Option A: Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to Table Editor
3. Open the `google_reviews` table
4. Verify reviews are populated with:
   - reviewer_name
   - star_rating
   - comment
   - create_time
   - is_new (should be true for new reviews)

**Option B: SQL Query**
```sql
SELECT * FROM google_reviews ORDER BY create_time DESC;
```

### 8. Test Review Response (Optional)
1. Find a review without a reply
2. Click "Reply with AI" button
3. AI should generate a response suggestion
4. Edit if needed and submit
5. Verify the reply appears in the review card

## Troubleshooting

### Error: "Client ID not configured"
- Ensure `.env` file exists in project root
- Verify `VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID` is set
- Restart your dev server after adding the variable

### Error: "redirect_uri_mismatch"
- Check that redirect URI in Google Cloud Console matches exactly
- Include both localhost and production URLs
- No trailing slashes in URIs

### Error: "No authorization code received"
- Check browser console for errors
- Verify you completed the Google authorization flow
- Try the OAuth flow again

### Error: "Failed to sync reviews"
- Check Supabase Edge Functions are deployed
- Verify `sync-google-reviews` function exists
- Check function logs in Supabase dashboard
- Ensure Google Business Profile API is enabled

### No Reviews Showing
- Verify your Google Business Profile has reviews
- Check that the correct location is selected
- Review sync logs for error messages
- Manually trigger sync again

## Expected Behavior

### Successful Connection
- OAuth redirect completes without errors
- User is redirected to admin dashboard
- Connection status shows as connected
- Review sync button is available

### Successful Sync
- Toast notification: "Synced X reviews (Y new)"
- Reviews appear in the dashboard
- Sync log entry created with status "success"
- Database table `google_reviews` populated

### Review Display
- Each review shows:
  - Reviewer name and photo
  - Star rating (1-5 stars)
  - Review comment
  - Date posted
  - "New" badge for unread reviews
  - Reply section if no reply exists

## Files Configured

### Environment
- `.env` - Contains OAuth Client ID

### Components
- `src/components/GoogleBusinessOAuthSetup.tsx` - OAuth connection UI
- `src/components/ReviewsManagementDashboard.tsx` - Main reviews interface
- `src/pages/GoogleBusinessCallback.tsx` - OAuth callback handler
- `src/pages/AdminDashboard.tsx` - Admin interface with Reviews tab

### Edge Functions
- `supabase/functions/google-business-auth/index.ts` - Token exchange
- `supabase/functions/google-business-locations/index.ts` - Account/location fetching
- `supabase/functions/sync-google-reviews/index.ts` - Review syncing

### Database Tables
- `google_business_tokens` - OAuth tokens storage
- `google_reviews` - Synced reviews
- `review_sync_logs` - Sync history

## Next Steps After Successful Testing

1. **Set up automatic syncing** - Configure cron job or webhook
2. **Test AI review responses** - Generate and post replies
3. **Monitor sync logs** - Check for any sync failures
4. **Configure notifications** - Alert on new reviews
5. **Deploy to production** - Add production redirect URI

## Need Help?

If you encounter issues:
1. Check browser console for JavaScript errors
2. Review Supabase Edge Function logs
3. Verify all environment variables are set
4. Ensure Google Business Profile API is enabled
5. Check that OAuth credentials are correct

## Summary

Everything is configured and ready for you to test. Simply:
1. Start your dev server
2. Navigate to `/admin`
3. Click "Reviews" tab
4. Click "Connect with Google"
5. Complete the OAuth flow
6. Test the sync functionality

The code is ready - you just need to perform the manual steps in your browser!
