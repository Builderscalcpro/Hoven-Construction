# Automatic Webhook Renewal System

This system automatically renews Google Calendar webhooks before they expire to maintain continuous two-way sync.

## Overview

Google Calendar webhooks expire after approximately 7 days. This system checks daily for webhooks expiring within 2 days and automatically renews them.

## Components

### 1. Scheduled Edge Function: `renew-calendar-webhooks`

**Purpose**: Runs daily to check and renew expiring webhooks

**Features**:
- Queries webhooks expiring within 2 days
- Stops old webhook subscriptions
- Creates new webhook subscriptions
- Updates database with new webhook details
- Sends email notifications on success/failure

**Trigger**: Should be scheduled to run daily via cron job

## Setting Up Automatic Renewal

### Option 1: External Cron Service (Recommended)

Use a service like **cron-job.org**, **EasyCron**, or **GitHub Actions** to trigger the function daily:

1. **Create a cron job** that runs daily at a specific time (e.g., 2:00 AM)
2. **HTTP Request**: POST to your edge function URL
3. **URL**: `https://[your-project].supabase.co/functions/v1/renew-calendar-webhooks`
4. **Headers**: 
   - `Authorization: Bearer [your-anon-key]`
   - `Content-Type: application/json`

### Option 2: GitHub Actions

Create `.github/workflows/renew-webhooks.yml`:

```yaml
name: Renew Calendar Webhooks
on:
  schedule:
    - cron: '0 2 * * *'  # Run daily at 2 AM UTC
  workflow_dispatch:  # Allow manual trigger

jobs:
  renew:
    runs-on: ubuntu-latest
    steps:
      - name: Call Renewal Function
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Content-Type: application/json" \
            https://[your-project].supabase.co/functions/v1/renew-calendar-webhooks
```

### Option 3: Supabase pg_cron (Database-level)

If you have access to Supabase SQL Editor with pg_cron extension:

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily webhook renewal at 2 AM
SELECT cron.schedule(
  'renew-calendar-webhooks',
  '0 2 * * *',
  $$
  SELECT net.http_post(
    url := 'https://[your-project].supabase.co/functions/v1/renew-calendar-webhooks',
    headers := '{"Authorization": "Bearer [your-service-role-key]", "Content-Type": "application/json"}'::jsonb
  );
  $$
);
```

## Email Notifications

### Success Email
Users receive an email when their webhook is successfully renewed:
- Subject: "Google Calendar Webhook Renewed"
- Contains new expiration date

### Failure Email
Users receive an email if renewal fails:
- Subject: "Google Calendar Webhook Renewal Failed"
- Contains error details
- Instructions to reconnect calendar

## Monitoring

### Check Renewal Status

Query recent renewal attempts:

```sql
SELECT 
  gcw.*,
  up.email,
  EXTRACT(DAY FROM (gcw.expiration - NOW())) as days_until_expiration
FROM google_calendar_webhooks gcw
JOIN user_profiles up ON gcw.user_id = up.id
ORDER BY gcw.expiration ASC;
```

### Manual Renewal

If automatic renewal fails, users can manually reconnect their calendar:

1. Go to Consultations page
2. Click "Disconnect Calendar" in Google Calendar Setup
3. Click "Connect Google Calendar" to reconnect
4. This will create a new webhook subscription

## Troubleshooting

### Webhook Not Renewing

1. **Check cron job is running**: Verify your cron service is active
2. **Check function logs**: View edge function logs in Supabase dashboard
3. **Verify tokens**: Ensure refresh tokens are still valid
4. **Check permissions**: Verify service role key has access

### Users Not Receiving Emails

1. **Check SendGrid API key**: Ensure it's properly configured
2. **Check email addresses**: Verify user_profiles table has correct emails
3. **Check spam folder**: Renewal emails might be filtered

### Token Expired

If refresh tokens expire:
- Users must reconnect their Google Calendar
- They'll receive a failure email with instructions

## Best Practices

1. **Monitor webhook expirations**: Check dashboard regularly
2. **Set up alerts**: Configure monitoring for failed renewals
3. **Test renewal process**: Manually trigger function to verify it works
4. **Keep documentation updated**: Document any custom configurations

## Security Notes

- Function uses service role key to access all user webhooks
- Refresh tokens are stored securely in database
- Email notifications don't expose sensitive data
- Webhook URLs are validated before renewal

## Testing

### Manual Test

Trigger the renewal function manually:

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  https://your-project.supabase.co/functions/v1/renew-calendar-webhooks
```

### Expected Response

```json
{
  "renewed": ["user-id-1", "user-id-2"],
  "failed": []
}
```

## Support

If you encounter issues with automatic webhook renewal:
1. Check the edge function logs in Supabase dashboard
2. Verify your cron job configuration
3. Test manual renewal via the UI
4. Contact support with error details
