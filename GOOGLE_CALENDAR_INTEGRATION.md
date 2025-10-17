# Google Calendar Integration for Virtual Consultations

## Overview
The Google Calendar integration enables real-time availability checking, automatic calendar event creation with Google Meet links, calendar invitations to clients, and two-way synchronization.

## Features Implemented

### 1. Real-Time Availability
- Fetches busy/free times from Google Calendar
- Shows only available time slots to clients
- Updates dynamically based on calendar changes
- Fallback to default slots if calendar not connected

### 2. Automatic Event Creation
- Creates calendar events when consultations are booked
- Automatically generates Google Meet video call links
- Sends calendar invitations to clients via email
- Sets reminders (24 hours and 1 hour before)

### 3. Two-Way Sync
- Consultations booked in the system appear in Google Calendar
- Events created externally can be synced (via webhook/polling)
- Maintains consistency between both systems

### 4. OAuth Authentication
- Secure OAuth 2.0 flow
- Token refresh handling
- Per-user calendar connection

## Database Schema

### google_calendar_tokens
```sql
- id: UUID (primary key)
- user_id: UUID (references auth.users)
- access_token: TEXT
- refresh_token: TEXT
- token_expiry: TIMESTAMPTZ
- calendar_id: TEXT (default: 'primary')
```

### consultations (updated)
```sql
- google_calendar_event_id: TEXT
- google_meet_link: TEXT
```

## Edge Functions

### 1. google-calendar-auth
Handles OAuth authentication flow:
- `getAuthUrl`: Generates OAuth authorization URL
- `exchangeCode`: Exchanges authorization code for tokens
- `refreshToken`: Refreshes expired access tokens

### 2. google-calendar-availability
Checks real-time availability:
- Fetches busy/free times for a specific date
- Returns available time slots (9 AM - 5 PM)
- Filters out busy periods

### 3. google-calendar-create-event
Creates calendar events:
- Creates event with consultation details
- Generates Google Meet link automatically
- Sends calendar invitations to attendees
- Sets custom reminders

## Components

### GoogleCalendarSetup
- Shows connection status
- Initiates OAuth flow
- Displays benefits of connecting

### AvailabilityDisplay
- Fetches real-time availability
- Shows loading state while checking
- Displays available/unavailable time slots
- Falls back to default slots if not connected

### VirtualConsultationBooking (updated)
- Uses AvailabilityDisplay for time selection
- Creates Google Calendar events on booking
- Stores event ID and Meet link in database

## Setup Instructions

### 1. Google Cloud Console Setup
1. Go to https://console.cloud.google.com
2. Create a new project or select existing
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URI: `https://your-domain.com/google-calendar-callback`
6. Note the Client ID and Client Secret

### 2. Supabase Configuration
The following secrets are already configured:
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET

### 3. OAuth Scopes Required
- `https://www.googleapis.com/auth/calendar`
- `https://www.googleapis.com/auth/calendar.events`

## Usage Flow

### For Business Owners
1. Navigate to Consultations page
2. Click "Connect Calendar" in GoogleCalendarSetup
3. Authorize Google Calendar access
4. Calendar is now connected and syncing

### For Clients Booking
1. Select consultation date
2. System checks real-time availability from Google Calendar
3. Only available time slots are shown
4. Upon booking:
   - Calendar event is created automatically
   - Google Meet link is generated
   - Client receives calendar invitation via email
   - Event appears in business owner's Google Calendar

## API Reference

### googleCalendarService

```typescript
// Get OAuth URL
const authUrl = await googleCalendarService.getAuthUrl();

// Exchange code for tokens
const tokens = await googleCalendarService.exchangeCode(code);

// Save tokens
await googleCalendarService.saveTokens(tokens);

// Get availability for a date
const slots = await googleCalendarService.getAvailability('2025-10-15');

// Create calendar event
const event = await googleCalendarService.createEvent({
  summary: 'Consultation',
  description: 'Project details',
  startDateTime: '2025-10-15T10:00:00Z',
  endDateTime: '2025-10-15T11:00:00Z',
  attendees: [{ email: 'client@example.com' }]
});
```

## Security Considerations

1. **Token Storage**: Tokens are stored securely in Supabase with RLS
2. **Token Refresh**: Automatic refresh before expiry
3. **OAuth Flow**: Standard OAuth 2.0 with PKCE
4. **API Keys**: Never exposed to frontend

## Troubleshooting

### Calendar Not Connecting
- Verify OAuth credentials are correct
- Check redirect URI matches exactly
- Ensure Calendar API is enabled

### Availability Not Showing
- Verify tokens are not expired
- Check calendar ID is correct
- Ensure user has calendar access

### Events Not Creating
- Verify conferenceDataVersion=1 parameter
- Check attendee email format
- Ensure sufficient API quota

## Future Enhancements

1. **Webhook Integration**: Real-time sync of external events
2. **Multiple Calendars**: Support for selecting specific calendars
3. **Recurring Events**: Handle recurring consultation slots
4. **Cancellation Sync**: Sync cancellations both ways
5. **Timezone Support**: Better timezone handling
