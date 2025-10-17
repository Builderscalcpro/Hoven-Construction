# Automatic Calendar Sync Scheduler Setup

## Overview
Automatic calendar sync runs every 15-30 minutes to sync all connected calendars (Google, Outlook, Apple) for all users.

## Edge Function Created
- **Function Name**: `scheduled-calendar-sync`
- **Purpose**: Syncs all user calendars automatically
- **Features**:
  - Syncs Google, Outlook, and Apple calendars
  - Updates `calendar_sync_history` table
  - Sends notifications on sync failures
  - Tracks success/failure for each user

## Setting Up Supabase Cron Job

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Database** → **Extensions**
3. Enable the `pg_cron` extension if not already enabled
4. Go to **SQL Editor** and run:

```sql
-- Schedule calendar sync every 20 minutes
SELECT cron.schedule(
  'calendar-sync-job',
  '*/20 * * * *',
  $$
  SELECT
    net.http_post(
      url:='https://YOUR_PROJECT_REF.supabase.co/functions/v1/scheduled-calendar-sync',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
    ) as request_id;
  $$
);
```

5. Replace `YOUR_PROJECT_REF` with your actual Supabase project reference
6. Replace `YOUR_SERVICE_ROLE_KEY` with your service role key (found in Settings → API)

### Option 2: Different Schedule Intervals

**Every 15 minutes:**
```sql
SELECT cron.schedule('calendar-sync-job', '*/15 * * * *', $$ ... $$);
```

**Every 30 minutes:**
```sql
SELECT cron.schedule('calendar-sync-job', '*/30 * * * *', $$ ... $$);
```

**Every hour:**
```sql
SELECT cron.schedule('calendar-sync-job', '0 * * * *', $$ ... $$);
```

## Managing Cron Jobs

### View All Scheduled Jobs
```sql
SELECT * FROM cron.job;
```

### Unschedule a Job
```sql
SELECT cron.unschedule('calendar-sync-job');
```

### View Job Run History
```sql
SELECT * FROM cron.job_run_details 
WHERE jobname = 'calendar-sync-job' 
ORDER BY start_time DESC 
LIMIT 10;
```

## Manual Testing

Test the sync function manually:

```bash
curl -X POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/scheduled-calendar-sync \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json"
```

## Monitoring

### Check Sync History
```sql
SELECT 
  user_id,
  provider,
  sync_status,
  events_synced,
  error_message,
  last_sync_at
FROM calendar_sync_history
ORDER BY last_sync_at DESC
LIMIT 50;
```

### Check Failed Syncs
```sql
SELECT * FROM calendar_sync_history
WHERE sync_status = 'failed'
ORDER BY last_sync_at DESC;
```

## Notifications

Users receive notifications when:
- Calendar sync fails
- Notification includes provider name and error message
- Sent via the `send-notification` edge function

## Troubleshooting

### Cron Job Not Running
1. Verify `pg_cron` extension is enabled
2. Check job exists: `SELECT * FROM cron.job;`
3. Check job run history for errors
4. Verify service role key is correct

### Sync Failures
1. Check `calendar_sync_history` for error messages
2. Verify calendar tokens haven't expired
3. Check edge function logs in Supabase dashboard
4. Test individual sync functions manually

### High Failure Rate
- Consider increasing sync interval
- Check API rate limits for calendar providers
- Verify network connectivity

## Best Practices

1. **Start with 30-minute intervals** to avoid rate limits
2. **Monitor sync history** for the first few days
3. **Set up alerts** for high failure rates
4. **Keep tokens fresh** by implementing token refresh logic
5. **Log all sync attempts** for debugging

## Performance Considerations

- Syncing 100 users takes approximately 2-5 minutes
- Each provider API has rate limits
- Consider batching if you have 1000+ users
- Monitor edge function execution time

## Next Steps

1. Enable `pg_cron` extension
2. Run the cron schedule SQL
3. Monitor sync history
4. Adjust interval based on usage patterns
