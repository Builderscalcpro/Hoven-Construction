# Google Business Reviews Not Loading - Fix Instructions

## Problem
Reviews are not loading in the admin panel even though OAuth is connected.

## Root Cause
The Google My Business API v4 endpoint being used may be deprecated or the account/location IDs may not be properly configured.

## Fixes Applied

### 1. Added Debug Component
Created `GoogleBusinessReviewsDebug.tsx` to help diagnose the exact issue:
- Tests token presence
- Validates access token, account ID, location ID
- Tests direct API connection
- Shows detailed error messages

### 2. Updated Edge Function
Enhanced `supabase/functions/google-business-reviews/index.ts`:
- Added proper Content-Type headers
- Improved error handling and logging
- Better timeout management

## How to Diagnose

1. **Go to Admin Panel**: `/admin` → Reviews tab
2. **Click Diagnostics Tab**: Check the new debug component
3. **Run Diagnostics**: Click "Run Diagnostics" button
4. **Check Results**:
   - ✅ Green checkmarks = working
   - ❌ Red X = problem found
   - View error messages for details

## Common Issues & Solutions

### Issue 1: Missing Account/Location ID
**Symptoms**: Debug shows missing account_id or location_id
**Solution**: 
- Go to "Sync Settings" tab
- Click "Fetch Locations" to refresh
- Select your business location

### Issue 2: Token Expired
**Symptoms**: API test fails with 401 error
**Solution**:
- Go to "Token Status" tab
- Check token expiration
- System should auto-refresh, or click "Manual Refresh"

### Issue 3: API Permissions
**Symptoms**: 403 Forbidden error
**Solution**:
- Verify Google Business Profile API is enabled in Google Cloud Console
- Check OAuth scopes include: `https://www.googleapis.com/auth/business.manage`
- Reconnect OAuth with proper permissions

### Issue 4: No Reviews Exist
**Symptoms**: API works but returns empty array
**Solution**: This is normal if your business has no reviews yet

## Redeploy Edge Function

If you made changes to the edge function, redeploy it:

```bash
supabase functions deploy google-business-reviews
```

## Check Browser Console

Open browser DevTools (F12) and check Console tab for detailed error messages when clicking "Refresh" in Reviews tab.

## Next Steps

1. Run diagnostics first
2. Check error messages
3. Follow solution for your specific issue
4. If still not working, check Supabase logs for edge function errors
