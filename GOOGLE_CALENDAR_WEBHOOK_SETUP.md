# Google Calendar Webhook Integration - Two-Way Sync

This document explains the Google Calendar webhook integration for real-time two-way synchronization of consultation bookings.

## Overview

The webhook integration enables true two-way sync between your consultation system and Google Calendar:
- Events created/modified in Google Calendar automatically sync to your consultations table
- Changes made externally are reflected in real-time
- No manual refresh needed - webhooks push updates automatically

## Architecture

### Database Tables

**google_calendar_webhooks**
- Stores active webhook subscriptions
- Tracks channel IDs, resource IDs, and expiration times
- One webhook per user per calendar

### Edge Functions

1. **google-calendar-webhook**
   - Receives push notifications from Google Calendar
   - Processes event changes (created, updated, deleted)
   - Syncs changes to consultations table
   - Handles webhook verification

2. **google-calendar-subscribe-webhook**
   - Subscribes to Google Calendar push notifications
   - Unsubscribes from webhooks
   - Manages webhook lifecycle

## How It Works

### Webhook Subscription Flow

1. User connects Google Calendar (OAuth)
2. User clicks "Enable Two-Way Sync"
3. System calls `google-calendar-subscribe-webhook` function
4. Function creates a webhook channel with Google Calendar API
5. Google Calendar sends push notifications to webhook endpoint
6. Webhook info stored in `google_calendar_webhooks` table

### Event Processing Flow

1. Event created/modified in Google Calendar
2. Google sends POST request to webhook endpoint
3. Webhook function fetches updated events
4. Function syncs events marked with [CONSULTATION] tag
5. Consultations table updated with changes
6. Status, date, time, and Meet link synced

### Webhook Verification

Google Calendar sends a "sync" notification to verify the webhook:
- Webhook endpoint responds with 200 OK
- Verification completes subscription setup

## Webhook Expiration

Google Calendar webhooks expire after a period (typically 7 days):
- Expiration time shown in UI
- Users can renew by disabling and re-enabling sync
- Consider implementing automatic renewal before expiration

## Event Identification

Only events with [CONSULTATION] in description are synced:
- Prevents syncing unrelated calendar events
- Maintains data integrity
- Events linked via `google_calendar_event_id`

## Security

- Webhooks use HTTPS only
- Channel tokens validate requests
- Service role key for database access
- User-specific RLS policies

## Usage

### Enable Two-Way Sync

```typescript
await googleCalendarService.subscribeToWebhook('primary');
```

### Disable Two-Way Sync

```typescript
await googleCalendarService.unsubscribeFromWebhook('primary');
```

### Check Webhook Status

```typescript
const status = await googleCalendarService.getWebhookStatus();
// Returns: { channel_id, resource_id, expiration, ... }
```

## UI Components

**GoogleCalendarSetup Component**
- Shows connection status
- Displays two-way sync toggle
- Shows webhook expiration time
- Handles enable/disable actions

## Troubleshooting

### Webhook Not Receiving Events

1. Check webhook is active in database
2. Verify channel hasn't expired
3. Check Google Calendar API quotas
4. Ensure events have [CONSULTATION] tag

### Events Not Syncing

1. Verify `google_calendar_event_id` matches
2. Check access token is valid
3. Review edge function logs
4. Ensure RLS policies allow updates

## Limitations

- Webhooks expire and need renewal
- Only syncs events with [CONSULTATION] tag
- Requires active internet connection
- Subject to Google Calendar API quotas

## Future Enhancements

- Automatic webhook renewal before expiration
- Batch event processing for efficiency
- Conflict resolution for simultaneous edits
- Webhook health monitoring and alerts
