# Automated Review Sync Setup Guide

## Overview
Automated review syncing fetches new Google Business Profile reviews on a scheduled basis with notifications and error handling.

## Features
- ✅ Configurable sync frequency (15 min to daily)
- ✅ Email notifications for new reviews
- ✅ SMS notifications via Twilio
- ✅ Detailed sync history with logs
- ✅ Automatic retry logic for failed syncs
- ✅ Manual sync trigger
- ✅ Token refresh handling

## Database Tables

### review_sync_config
Stores user sync preferences:
- `sync_frequency_minutes` - How often to sync (default: 60)
- `email_notifications` - Enable email alerts
- `sms_notifications` - Enable SMS alerts
- `notification_email` - Email address for alerts
- `notification_phone` - Phone number for SMS
- `auto_sync_enabled` - Master on/off switch
- `last_sync_at` - Last successful sync timestamp
- `next_sync_at` - Scheduled next sync time

### review_sync_logs (Enhanced)
Tracks all sync operations:
- `status` - success/failed
- `reviews_synced` - Count of new reviews
- `error_message` - Error details if failed
- `retry_count` - Number of retry attempts
- `next_retry_at` - Scheduled retry time

## Edge Function: automated-review-sync

### Functionality
1. Queries all active sync configurations
2. Checks if sync is due based on schedule
3. Fetches reviews from Google Business API
4. Handles token refresh automatically
5. Inserts new reviews into database
6. Sends notifications (email/SMS)
7. Logs sync results
8. Schedules next sync

### Cron Setup
Set up a cron job to trigger the function hourly:

```bash
# Using Supabase CLI
supabase functions schedule automated-review-sync --cron "0 * * * *"
```

Or use an external cron service (cron-job.org, EasyCron):
```
URL: https://[your-project].supabase.co/functions/v1/automated-review-sync
Method: POST
Schedule: Every hour (0 * * * *)
```

## Notification Setup

### Email (SendGrid)
Already configured with SENDGRID_API_KEY environment variable.

### SMS (Twilio)
Required environment variables:
- `TWILIO_ACCOUNT_SID` - Your Twilio account SID
- `TWILIO_AUTH_TOKEN` - Your Twilio auth token
- `TWILIO_PHONE_NUMBER` - Your Twilio phone number

Add via Supabase dashboard or CLI:
```bash
supabase secrets set TWILIO_ACCOUNT_SID=your_sid
supabase secrets set TWILIO_AUTH_TOKEN=your_token
supabase secrets set TWILIO_PHONE_NUMBER=+1234567890
```

## Using the Dashboard

### Access
Navigate to `/admin` → Reviews tab → Review Sync Dashboard

### Configuration Steps
1. **Enable Auto-Sync**: Toggle the master switch
2. **Set Frequency**: Choose sync interval (hourly recommended)
3. **Email Notifications**:
   - Enable toggle
   - Enter notification email
4. **SMS Notifications**:
   - Enable toggle
   - Enter phone number (E.164 format: +1234567890)
5. **Manual Sync**: Click "Sync Now" to test immediately

### Monitoring
- View sync history in the table
- Check status badges (Success/Failed)
- Review error messages for failed syncs
- Monitor reviews synced count

## Error Handling

### Automatic Retry
- Failed syncs are logged with error details
- Retry scheduled for 5 minutes later
- Retry count tracked in logs

### Common Errors
1. **401 Unauthorized**: Token expired (auto-refreshed)
2. **403 Forbidden**: Invalid credentials or permissions
3. **429 Rate Limit**: Too many requests (backs off)
4. **Network errors**: Retried automatically

## Testing

### Manual Test
1. Go to Review Sync Dashboard
2. Click "Sync Now"
3. Check sync history for results
4. Verify new reviews in google_reviews table

### Verify Notifications
1. Add test email/phone in settings
2. Trigger manual sync
3. Check for notification delivery

### Database Verification
```sql
-- Check sync configuration
SELECT * FROM review_sync_config;

-- Check recent sync logs
SELECT * FROM review_sync_logs 
ORDER BY synced_at DESC 
LIMIT 10;

-- Check synced reviews
SELECT * FROM google_reviews 
ORDER BY create_time DESC;
```

## Best Practices

1. **Frequency**: Start with hourly, adjust based on review volume
2. **Notifications**: Use email for all, SMS for urgent only
3. **Monitoring**: Check sync history weekly
4. **Errors**: Address failed syncs within 24 hours
5. **Testing**: Test after any configuration change

## Troubleshooting

### Syncs Not Running
- Verify auto_sync_enabled is true
- Check next_sync_at timestamp
- Ensure cron job is configured
- Review edge function logs

### No Notifications
- Verify email/phone number format
- Check SendGrid/Twilio credentials
- Review edge function logs for errors
- Test with manual sync first

### Token Issues
- Tokens auto-refresh on 401 errors
- Re-authorize if refresh fails
- Check token expiry in google_business_tokens

## Next Steps
1. Configure sync frequency
2. Set up notification preferences
3. Enable auto-sync
4. Monitor first few syncs
5. Adjust settings as needed
