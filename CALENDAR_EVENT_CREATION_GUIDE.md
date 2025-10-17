# Calendar Event Creation Guide

## Overview
Users can now create calendar events directly from the application that automatically sync to all connected calendar providers (Google Calendar, Outlook Calendar, and Apple Calendar/iCloud).

## Features

### Event Creation Form
- **Event Title**: Required field for the event name
- **Description**: Optional detailed description of the event
- **Start Date & Time**: Calendar picker and time input for event start
- **End Date & Time**: Calendar picker and time input for event end
- **Location**: Optional location field
- **Attendees**: Add multiple attendees by email address

### Multi-Calendar Sync
Events created in the application are automatically synced to:
- Google Calendar (if connected)
- Outlook Calendar (if connected)
- Apple Calendar/iCloud (if connected)

## How to Use

### Creating an Event

1. Navigate to the Calendar Dashboard
2. Click the "Create Event" button in the top right
3. Fill in the event details:
   - Enter a title (required)
   - Add a description (optional)
   - Select start date and time
   - Select end date and time
   - Add location (optional)
   - Add attendees by email (optional)
4. Click "Create Event"

### Success Feedback
After creating an event, you'll receive feedback showing:
- Number of calendars successfully synced
- Any calendars that failed to sync
- The event will appear in the calendar view

## Technical Implementation

### Frontend Components
- `EventCreationForm`: Form component with all event fields
- `CalendarDashboard`: Integrated create event dialog

### Backend Services
- `multiCalendarService.createEventInAllCalendars()`: Orchestrates event creation across all providers
- Google Calendar API integration via `google-calendar-create-event` edge function
- Outlook Calendar API integration via `outlook-calendar-events` edge function
- Apple Calendar CalDAV integration via `apple-calendar-sync` edge function

### Two-Way Sync
Events created in the app sync TO all calendars. Events created in external calendars sync back TO the app through:
- Google Calendar webhooks
- Outlook Calendar subscriptions
- Apple Calendar periodic sync

## Event Data Structure

```typescript
{
  title: string;              // Event title
  description?: string;       // Optional description
  startDateTime: string;      // ISO 8601 format
  endDateTime: string;        // ISO 8601 format
  location?: string;          // Optional location
  attendees?: string[];       // Array of email addresses
}
```

## Error Handling
- If an event fails to sync to one calendar, it will still be created in others
- Users receive clear feedback about which calendars succeeded/failed
- Partial failures are handled gracefully with warning messages

## Best Practices
1. Ensure calendar connections are active before creating events
2. Use valid email addresses for attendees
3. Set realistic time ranges for events
4. Add location information for in-person meetings
5. Include detailed descriptions for clarity

## Troubleshooting

### Event Not Appearing in External Calendar
- Check calendar connection status in Connections tab
- Verify the calendar is set as primary
- Check sync history for error messages
- Reconnect the calendar provider if needed

### Attendee Invitations Not Sent
- Ensure attendee emails are valid
- Check calendar provider permissions
- Verify calendar has permission to send invitations

### Sync Delays
- Google Calendar: Usually instant
- Outlook Calendar: May take 1-2 minutes
- Apple Calendar: Sync interval is 5-15 minutes

## Future Enhancements
- Recurring event support
- Event reminders configuration
- Bulk event creation
- Event templates
- Calendar-specific event colors
- Conflict detection before creation
