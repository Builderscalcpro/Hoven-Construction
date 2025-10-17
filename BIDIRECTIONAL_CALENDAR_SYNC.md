# Bidirectional Calendar Synchronization Setup Guide

## Overview
This guide explains the bidirectional calendar synchronization system that keeps Google Calendar and your local database in perfect sync.

## Features
- **Bidirectional Sync**: Changes in either Google Calendar or local database are automatically synchronized
- **Conflict Resolution**: Intelligent handling of conflicting changes with user control
- **Batch Operations**: Efficient bulk synchronization for improved performance
- **Sync Status Dashboard**: Real-time monitoring of sync status and history
- **Error Handling**: Comprehensive error tracking and reporting

## Database Setup

### 1. Run the SQL Migration
Execute the SQL file to create necessary tables:
```bash
# In Supabase SQL Editor, run:
supabase_calendar_sync_tables.sql
```

This creates:
- `calendar_sync_status` - Tracks sync operations
- `calendar_sync_conflicts` - Stores conflicts for resolution
- `calendar_sync_history` - Logs all sync activities

### 2. Verify Tables
Check that all tables were created with proper RLS policies:
```sql
SELECT * FROM calendar_sync_status LIMIT 1;
SELECT * FROM calendar_sync_conflicts LIMIT 1;
SELECT * FROM calendar_sync_history LIMIT 1;
```

## Using the Sync System

### Accessing the Sync Dashboard
1. Navigate to **Calendar Management** (`/calendar`)
2. Click on the **Sync Status** tab (first tab)
3. View sync status, conflicts, and history

### Manual Sync
Click the **Sync Now** button to trigger immediate synchronization:
- Fetches all events from Google Calendar
- Compares with local database
- Creates/updates events as needed
- Resolves conflicts automatically or prompts user

### Conflict Resolution
When conflicts are detected:
1. View conflicts in the **Sync Conflicts** section
2. Choose resolution for each conflict:
   - **Use Local Version**: Keep your local changes
   - **Use Google Version**: Accept Google Calendar changes
3. Click **Resolve Conflict** to apply your choice

### Sync History
Monitor all sync activities:
- View recent sync operations
- See which events were created/updated/deleted
- Track conflict resolutions
- Identify sync errors

## How It Works

### Sync Process
1. **Fetch Data**: Retrieves events from both Google Calendar and local database
2. **Compare**: Identifies differences between sources
3. **Detect Conflicts**: Finds events with conflicting changes
4. **Resolve**: Applies conflict resolution rules
5. **Update**: Synchronizes changes to both systems
6. **Log**: Records all activities in sync history

### Conflict Detection
Conflicts occur when:
- Same event modified in both locations
- Event deleted in one location but modified in another
- Timing differences in updates

### Automatic Resolution
By default, the system:
- Uses the most recently updated version
- Prefers Google Calendar for time conflicts
- Logs all automatic resolutions

## API Usage

### Trigger Sync Programmatically
```typescript
import { bidirectionalCalendarSync } from '@/lib/bidirectionalCalendarSync';

// Perform full sync
const result = await bidirectionalCalendarSync.performFullSync(userId);

console.log(`Synced ${result.events_synced} events`);
console.log(`Resolved ${result.conflicts_resolved} conflicts`);
```

### Check Sync Status
```typescript
const { data } = await supabase
  .from('calendar_sync_status')
  .select('*')
  .eq('user_id', userId)
  .order('last_sync', { ascending: false })
  .limit(1)
  .single();

console.log('Last sync:', data.last_sync);
console.log('Status:', data.status);
```

## Best Practices

### Sync Frequency
- **Manual Sync**: Use for immediate updates
- **Scheduled Sync**: Set up cron jobs for automatic syncing
- **Webhook Sync**: Use Google Calendar webhooks for real-time updates

### Conflict Management
- Review conflicts promptly
- Establish team guidelines for resolution
- Use consistent data sources to minimize conflicts

### Performance
- Sync during off-peak hours for large datasets
- Use batch operations for bulk updates
- Monitor sync history for performance issues

## Troubleshooting

### Sync Failures
1. Check Google Calendar connection in **Connections** tab
2. Verify OAuth tokens are valid
3. Review error messages in sync status
4. Check Supabase logs for database errors

### Missing Events
1. Verify event exists in source calendar
2. Check sync history for deletion records
3. Ensure RLS policies allow access
4. Manually trigger sync

### Conflict Loop
If same conflict keeps appearing:
1. Resolve conflict manually
2. Verify both sources are updated
3. Check for automation conflicts
4. Clear conflict record if resolved

## Advanced Configuration

### Custom Conflict Resolution
Modify `src/lib/bidirectionalCalendarSync.ts`:
```typescript
private async resolveConflict(conflict: SyncConflict, userId: string) {
  // Custom logic here
  // Example: Always prefer local for specific event types
  if (conflict.local_version.type === 'important') {
    return 'use_local';
  }
  return 'use_google';
}
```

### Sync Filters
Add filters to sync specific events:
```typescript
// Only sync events from specific calendar
const events = await googleCalendarService.listEvents(
  userId,
  { calendarId: 'primary' }
);
```

## Security Considerations
- All sync operations respect RLS policies
- OAuth tokens stored securely in Supabase
- Sync history includes audit trail
- User data isolated by user_id

## Support
For issues or questions:
1. Check sync status dashboard for errors
2. Review sync history for patterns
3. Verify Google Calendar connection
4. Contact support with sync status ID
