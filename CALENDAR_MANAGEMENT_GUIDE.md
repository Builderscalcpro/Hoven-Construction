# Calendar Management System Guide

## Overview
Comprehensive calendar management dashboard for syncing events from Google Calendar, Outlook, and other providers, managing availability, and setting working hours preferences.

## Features

### 1. Calendar Sync
- **Google Calendar Integration**: OAuth 2.0 sync with Google Calendar
- **Outlook Calendar Integration**: OAuth 2.0 sync with Microsoft Outlook
- **CalDAV Support**: Manual configuration for CalDAV-compatible calendars
- **Bi-directional Sync**: Events sync both ways between platforms
- **Real-time Updates**: Automatic sync with webhook support

### 2. Calendar Views
- **Monthly Grid View**: Visual calendar with event display
- **Event List View**: Chronological list of all upcoming events
- **Multi-provider Display**: See events from all connected calendars
- **Event Details**: Click any event to view full details

### 3. Availability Management
- **Weekly Availability Slots**: Set available times for each day of the week
- **Multiple Time Slots**: Add multiple availability windows per day
- **Easy Editing**: Drag-and-drop time adjustments
- **Quick Add/Remove**: Simple interface for managing slots

### 4. Working Hours Settings
- **Default Working Hours**: Set your standard start and end times
- **Buffer Time**: Configure buffer time between appointments
- **Timezone Support**: Set your local timezone
- **Conflict Management**: Auto-decline conflicting appointments
- **Notification Preferences**: Email and SMS notification settings

### 5. Connection Management
- **Multiple Calendars**: Connect multiple calendar accounts
- **Sync Control**: Enable/disable sync per calendar
- **Manual Sync**: Force sync any calendar on demand
- **Connection Status**: View active/inactive status
- **Last Sync Time**: See when each calendar was last synced

## Setup Instructions

### 1. Database Setup
Run the SQL migration in your Supabase SQL Editor:
```bash
# Copy contents of supabase_calendar_migration.sql
# Paste into Supabase SQL Editor
# Execute the query
```

### 2. Environment Variables
Ensure your `.env` file has:
```
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_GOOGLE_API_KEY=your-google-api-key
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Google Calendar Setup
1. Go to Google Cloud Console
2. Enable Google Calendar API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URI: `https://yourdomain.com/google-calendar-callback`
5. Copy Client ID to `.env`

### 4. Outlook Calendar Setup
1. Go to Azure Portal
2. Register new application
3. Add Microsoft Graph API permissions
4. Configure redirect URI
5. Copy credentials to environment

## Usage Guide

### Accessing the Dashboard
Navigate to `/calendar` in your application (requires authentication)

### Connecting a Calendar
1. Click "Connect Calendar" button
2. Choose your calendar provider
3. Follow OAuth flow or enter CalDAV credentials
4. Calendar will sync automatically

### Managing Availability
1. Go to "Availability" tab
2. Click "Add Slot" for any day
3. Set start and end times
4. Repeat for all available time slots
5. Changes save automatically

### Setting Working Hours
1. Go to "Settings" tab
2. Set default working hours
3. Configure buffer time
4. Enable/disable notifications
5. Click "Save Preferences"

### Viewing Events
- **Calendar View**: See events in monthly grid
- **List View**: Scroll through chronological event list
- **Click Event**: View full event details
- **Filter by Provider**: See events from specific calendars

## API Integration

### Checking Availability
```typescript
import { multiCalendarService } from '@/lib/multiCalendarService';

const isAvailable = await multiCalendarService.isTimeSlotAvailable(
  userId,
  startTime,
  endTime
);
```

### Getting Events
```typescript
const events = await multiCalendarService.getAggregatedAvailability(
  userId,
  startDate,
  endDate
);
```

### Managing Connections
```typescript
// Get all connections
const connections = await multiCalendarService.getCalendarConnections(userId);

// Update connection
await multiCalendarService.updateCalendarConnection(connectionId, {
  sync_enabled: true
});

// Delete connection
await multiCalendarService.deleteCalendarConnection(connectionId);
```

## Troubleshooting

### Calendar Not Syncing
1. Check connection status in "Connections" tab
2. Verify sync is enabled
3. Try manual sync
4. Check token expiration
5. Re-authenticate if needed

### Events Not Showing
1. Verify date range includes events
2. Check calendar connection is active
3. Ensure RLS policies are correct
4. Verify user permissions

### OAuth Errors
1. Check redirect URIs match exactly
2. Verify API keys are correct
3. Ensure OAuth consent screen is configured
4. Check API quotas and limits

## Security Features

### Row Level Security
- All tables have RLS policies
- Users can only access their own data
- Secure token storage
- Encrypted credentials

### Data Privacy
- Tokens stored securely in database
- Passwords encrypted
- No data shared between users
- Audit logging for all changes

## Support

For issues or questions:
1. Check this guide first
2. Review error messages in browser console
3. Check Supabase logs
4. Verify API credentials
5. Contact support if needed
