# Multi-Calendar Sync - Complete Implementation Guide

## Overview
Users can now connect and sync events between Google Calendar and Outlook Calendar simultaneously, with full support for multiple calendars from each provider.

## ✅ Features Implemented

### 1. Dual Provider Support
- ✅ Google Calendar OAuth integration
- ✅ Outlook Calendar OAuth integration
- ✅ Simultaneous connections to both providers
- ✅ Independent token management per provider
- ✅ Automatic token refresh for both

### 2. Multi-Calendar Selection
- ✅ List all available calendars from each provider
- ✅ Select multiple calendars to sync (Work, Personal, etc.)
- ✅ Toggle sync per calendar
- ✅ Toggle availability checking per calendar
- ✅ Visual indicators for synced calendars

### 3. Unified Calendar Dashboard
- ✅ View events from all connected calendars
- ✅ Filter by provider (Google/Outlook)
- ✅ Color-coded events by calendar
- ✅ Real-time sync status
- ✅ Conflict detection across all calendars

### 4. Bi-Directional Sync
- ✅ Consultations sync to all connected calendars
- ✅ External events sync to local database
- ✅ Update/delete propagation
- ✅ Sync history tracking
- ✅ Rollback capability for failed syncs

## Architecture

### Database Tables

**google_calendar_tokens**
```sql
- user_id (FK to auth.users)
- calendar_id (Google calendar ID)
- calendar_name
- access_token
- refresh_token
- token_expiry
- sync_enabled (boolean)
- check_availability (boolean)
- is_primary (boolean)
```

**outlook_calendar_tokens**
```sql
- user_id (FK to auth.users)
- calendar_id (Outlook calendar ID)
- calendar_name
- access_token
- refresh_token
- token_expiry
- sync_enabled (boolean)
- check_availability (boolean)
- is_primary (boolean)
```

### Edge Functions

**google-calendar-list**
- Fetches all available Google calendars
- Returns calendar metadata (name, color, primary status)

**outlook-calendar-list**
- Fetches all available Outlook calendars
- Returns calendar metadata (name, owner, permissions)

**sync-consultation-to-calendars**
- Syncs consultations to all connected calendars
- Handles create/update/delete operations
- Logs sync results

**detect-calendar-conflicts**
- Checks for scheduling conflicts
- Compares across all calendars
- Returns conflict details

## Components

### CalendarConnectionsManager
Main dashboard for managing calendar connections
- Location: `src/components/CalendarConnectionsManager.tsx`
- Tabs: Connections, Calendars, Sync History, Conflicts

### GoogleCalendarSetup
OAuth connection for Google Calendar
- Location: `src/components/GoogleCalendarSetup.tsx`
- Features: Connect/disconnect, status indicator

### OutlookCalendarSetup
OAuth connection for Outlook Calendar
- Location: `src/components/OutlookCalendarSetup.tsx`
- Features: Connect/disconnect, status indicator

### CalendarPicker
Multi-calendar selection interface
- Location: `src/components/calendar/CalendarPicker.tsx`
- Props: `provider` ('google' | 'outlook'), `userId`
- Features: List calendars, toggle sync, configure settings

### CalendarProviderToggle
Toggle visibility of calendar providers
- Location: `src/components/CalendarProviderToggle.tsx`
- Features: Show/hide events by provider

## User Flow

### Initial Setup

1. **Navigate to Calendar Dashboard** (`/calendar`)
2. **Connect Google Calendar**
   - Click "Connect Google Calendar"
   - Sign in with Google account
   - Grant calendar permissions
   - Redirected back to dashboard

3. **Connect Outlook Calendar**
   - Click "Connect Outlook Calendar"
   - Sign in with Microsoft account
   - Grant calendar permissions
   - Redirected back to dashboard

4. **Select Calendars to Sync**
   - Go to "Calendars" tab
   - View all available calendars
   - Toggle sync for desired calendars
   - Configure sync and availability settings

### Daily Usage

1. **Create Consultation**
   - Consultation automatically syncs to all connected calendars
   - Appears in Google Calendar
   - Appears in Outlook Calendar
   - Sync history logged

2. **View Calendar Events**
   - Dashboard shows events from all calendars
   - Filter by provider
   - Color-coded by calendar
   - Click event for details

3. **Handle Conflicts**
   - System detects scheduling conflicts
   - Notifications for conflicts
   - View conflict details
   - Resolve manually or automatically

## API Integration

### Google Calendar Service
```typescript
import { googleCalendarService } from '@/lib/googleCalendarService';

// Get all synced calendars
const calendars = await googleCalendarService.getAllCalendars(userId);

// Get events from all calendars
const events = await googleCalendarService.getEvents(userId, startDate, endDate);

// Create event in primary calendar
await googleCalendarService.createEvent(userId, eventData);
```

### Outlook Calendar Service
```typescript
import { outlookCalendarService } from '@/lib/outlookCalendarService';

// Get all synced calendars
const calendars = await outlookCalendarService.getAllCalendars(userId);

// Get events from all calendars
const events = await outlookCalendarService.getEvents(userId, startDate, endDate);

// Create event in primary calendar
await outlookCalendarService.createEvent(userId, eventData);
```

### Multi-Calendar Service
```typescript
import { multiCalendarService } from '@/lib/multiCalendarService';

// Get aggregated availability across all calendars
const availability = await multiCalendarService.getAggregatedAvailability(
  userId,
  startDate,
  endDate
);

// Check if time slot is available
const isAvailable = await multiCalendarService.isTimeSlotAvailable(
  userId,
  startTime,
  endTime
);

// Sync consultation to all calendars
await multiCalendarService.syncConsultationToCalendars(
  consultationId,
  'create',
  userId
);

// Detect conflicts
const conflicts = await multiCalendarService.detectCalendarConflicts(userId);
```

## Configuration

### Environment Variables (Supabase Secrets)

**Google OAuth**
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

**Microsoft OAuth**
- `MICROSOFT_CLIENT_ID`
- `MICROSOFT_CLIENT_SECRET`

### Redirect URIs

**Google Cloud Console**
- `https://yourdomain.com/calendar/google/callback`
- `http://localhost:5173/calendar/google/callback` (dev)

**Azure Portal**
- `https://yourdomain.com/calendar`
- `http://localhost:5173/calendar` (dev)

## Testing Checklist

### Google Calendar
- [ ] Connect Google Calendar
- [ ] View available calendars
- [ ] Select multiple calendars
- [ ] Create consultation → appears in Google
- [ ] Update consultation → updates in Google
- [ ] Delete consultation → removes from Google
- [ ] Token refresh works automatically

### Outlook Calendar
- [ ] Connect Outlook Calendar
- [ ] View available calendars
- [ ] Select multiple calendars
- [ ] Create consultation → appears in Outlook
- [ ] Update consultation → updates in Outlook
- [ ] Delete consultation → removes from Outlook
- [ ] Token refresh works automatically

### Multi-Calendar Sync
- [ ] Both providers connected simultaneously
- [ ] Events from both providers visible
- [ ] Consultation syncs to both calendars
- [ ] Conflict detection across providers
- [ ] Availability checking works across all calendars
- [ ] Provider toggle filters events correctly

## Troubleshooting

### Google Calendar Not Syncing
1. Check token expiry in `google_calendar_tokens`
2. Verify OAuth credentials in Supabase secrets
3. Check edge function logs for errors
4. Ensure redirect URI matches Google Console

### Outlook Calendar Not Syncing
1. Check token expiry in `outlook_calendar_tokens`
2. Verify OAuth credentials in Supabase secrets
3. Check edge function logs for errors
4. Ensure redirect URI matches Azure Portal

### Conflicts Not Detected
1. Verify `check_availability` is enabled for calendars
2. Check that edge function `detect-calendar-conflicts` is deployed
3. Ensure events are being synced to local database

### Multiple Calendars Not Showing
1. Check that `google-calendar-list` and `outlook-calendar-list` functions are deployed
2. Verify tokens have necessary permissions
3. Check CalendarPicker component is receiving correct props

## Security Considerations

1. **Token Storage**: All tokens encrypted at rest in Supabase
2. **RLS Policies**: Users can only access their own tokens
3. **Edge Functions**: All OAuth operations server-side
4. **HTTPS Required**: Production must use HTTPS
5. **Token Refresh**: Automatic refresh before expiry

## Performance Optimization

1. **Batch Operations**: Sync to multiple calendars in parallel
2. **Caching**: Cache calendar lists for 5 minutes
3. **Lazy Loading**: Load events on-demand
4. **Debouncing**: Debounce availability checks

## Future Enhancements

- [ ] Apple Calendar (CalDAV) support
- [ ] Calendar color customization
- [ ] Event categories/tags
- [ ] Recurring event support
- [ ] Email reminders
- [ ] SMS notifications
- [ ] Webhook subscriptions for real-time updates
- [ ] Calendar sharing between team members

## Resources

- [Google Calendar API Documentation](https://developers.google.com/calendar/api)
- [Microsoft Graph Calendar API](https://docs.microsoft.com/en-us/graph/api/resources/calendar)
- [Multi-Calendar Integration Guide](./MULTI_CALENDAR_INTEGRATION.md)
- [Microsoft OAuth Setup](./MICROSOFT_OAUTH_SETUP.md)
- [Google OAuth Setup](./GOOGLE_OAUTH_SETUP.md)

## Support

For issues or questions:
1. Check edge function logs in Supabase dashboard
2. Review sync history in Calendar Dashboard
3. Verify OAuth credentials are correct
4. Check that all required permissions are granted
