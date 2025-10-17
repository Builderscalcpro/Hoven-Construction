# OAuth Token Refresh Setup Guide

## Overview
Automatic OAuth token refresh functionality has been implemented to prevent token expiration and maintain seamless calendar integrations.

## Features Implemented

### 1. Database Table
- **oauth_token_refresh_logs**: Tracks all token refresh attempts
  - Records success/failure status
  - Stores error messages for debugging
  - Tracks old and new expiration timestamps
  - Supports all OAuth providers (Google Calendar, Outlook, Apple, Google Business)

### 2. Edge Function: refresh-oauth-tokens
- Automatically checks tokens expiring within 24 hours
- Refreshes tokens before expiration
- Updates access tokens and expiration timestamps
- Logs all refresh attempts for monitoring
- Handles errors gracefully with detailed logging

### 3. UI Component: OAuthTokenRefreshMonitor
- Displays refresh history with status indicators
- Shows success/failure counts
- Displays error messages for failed refreshes
- Manual refresh trigger button
- Real-time status updates

## How It Works

### Automatic Refresh Process
1. Edge function queries all OAuth token tables
2. Identifies tokens expiring within 24 hours
3. Calls provider-specific refresh endpoints
4. Updates tokens in database
5. Logs results to oauth_token_refresh_logs table

### Supported Providers
- **Google Calendar**: Uses Google OAuth 2.0 refresh flow
- **Outlook Calendar**: Uses Microsoft OAuth 2.0 refresh flow
- **Google Business**: Uses Google OAuth 2.0 refresh flow
- **Apple Calendar**: Uses app-specific passwords (no refresh needed)

## Setup Instructions

### 1. Database Setup
The oauth_token_refresh_logs table has been created with RLS policies.

### 2. Schedule Automatic Refresh
To run the refresh function automatically, set up a cron job in Supabase:

```sql
-- Run every 6 hours
SELECT cron.schedule(
  'refresh-oauth-tokens',
  '0 */6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/refresh-oauth-tokens',
    headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
  );
  $$
);
```

### 3. Access the Monitor
Navigate to: **OAuth Connection Manager → Token Refresh Monitor tab**

## Manual Refresh
Users can manually trigger a token refresh:
1. Go to OAuth Connection Manager
2. Click "Token Refresh Monitor" tab
3. Click "Refresh Now" button

## Monitoring & Troubleshooting

### Check Refresh History
View the Token Refresh Monitor to see:
- Recent refresh attempts
- Success/failure status
- Error messages
- Token expiration dates

### Common Issues

**Issue**: Refresh fails with "invalid_grant"
**Solution**: User needs to re-authenticate. The refresh token may have been revoked.

**Issue**: Refresh fails with "invalid_client"
**Solution**: Check that GOOGLE_CLIENT_SECRET and MICROSOFT_CLIENT_SECRET are correctly configured in Supabase secrets.

**Issue**: No tokens being refreshed
**Solution**: Ensure tokens have expires_at timestamps and are within 24 hours of expiration.

## Notification System
When a token refresh fails:
1. Error is logged to oauth_token_refresh_logs
2. User can view the error in Token Refresh Monitor
3. Consider implementing email notifications for critical failures

## Best Practices
1. Monitor the refresh logs regularly
2. Set up alerts for repeated refresh failures
3. Ensure refresh tokens are stored securely
4. Run the refresh function at least daily
5. Test the refresh flow after any OAuth configuration changes

## Security Notes
- Refresh tokens are stored encrypted in the database
- Edge function uses service role key for database access
- All API calls use HTTPS
- RLS policies ensure users only see their own refresh logs
