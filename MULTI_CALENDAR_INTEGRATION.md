# Multi-Calendar Integration - Complete Setup Guide

## Overview
Users can now connect and sync multiple calendars from the same provider (Google/Outlook), such as Work calendar, Personal calendar, etc. Each calendar can be individually configured for syncing and availability checking.

## Database Schema Updates

### Updated Tables
Both `google_calendar_tokens` and `outlook_calendar_tokens` now support multiple calendars per user:

```sql
-- Removed unique constraint on user_id (allows multiple calendars per user)
-- Added new columns:
- calendar_name TEXT (display name of the calendar)
- is_primary BOOLEAN (marks the default calendar)
- sync_enabled BOOLEAN (enable/disable event syncing)
- check_availability BOOLEAN (include in availability checks)

-- New unique constraint: user_id + calendar_id combination
```

## New Edge Functions

### 1. google-calendar-list
Fetches all available calendars from Google Calendar API for a user.

**Endpoint:** `google-calendar-list`
**Input:** `{ accessToken }`
**Output:** Array of calendars with id, name, description, primary status

### 2. outlook-calendar-list
Fetches all available calendars from Microsoft Graph API for a user.

**Endpoint:** `outlook-calendar-list`
**Input:** `{ accessToken }`
**Output:** Array of calendars with id, name, owner, canEdit status

## New Components

### CalendarPicker
Location: `src/components/calendar/CalendarPicker.tsx`

**Features:**
- Displays all available calendars from a provider
- Toggle to add/remove calendars from sync
- Individual settings for each calendar:
  - Sync events (sync_enabled)
  - Check availability (check_availability)
- Real-time refresh of calendar list
- Visual indicators for primary and synced calendars

**Usage:**
```tsx
<CalendarPicker provider="google" userId={user.id} />
<CalendarPicker provider="outlook" userId={user.id} />
```

## Updated Services

### googleCalendarService.ts
- `getTokens()` - Now fetches primary calendar tokens
- `getAllCalendars()` - New method to get all synced calendars

### outlookCalendarService.ts
- `getStoredTokens()` - Now fetches primary calendar tokens
- `getAllCalendars()` - New method to get all synced calendars

### multiCalendarService.ts
- `getAggregatedAvailability()` - Updated to query multiple calendars from both providers

## Calendar Dashboard Integration

The Calendar Dashboard now includes the CalendarPicker in the Connections tab:

**Location:** `/calendar` → Connections tab

**Features:**
- Side-by-side Google and Outlook calendar pickers
- Connect multiple calendars from each provider
- Toggle sync and availability settings per calendar
- Real-time updates when settings change

## How It Works

### 1. Initial Connection
When a user first connects Google or Outlook:
- OAuth flow completes
- Primary calendar is automatically added
- User can then add additional calendars

### 2. Adding Additional Calendars
1. Navigate to Calendar Dashboard → Connections tab
2. Click refresh icon to fetch available calendars
3. Toggle switch to add a calendar to sync
4. Configure sync and availability settings

### 3. Availability Checking
When checking user availability:
- System queries all calendars where `check_availability = true`
- Events from all enabled calendars are aggregated
- Conflicts are detected across all calendars

### 4. Event Syncing
When syncing events:
- System respects `sync_enabled` flag per calendar
- Events are synced to/from enabled calendars only
- Primary calendar is used for creating new events by default

## Testing the Integration

### Test OAuth Flow
1. Go to `/calendar`
2. Click "Connect Calendar" button
3. Complete Google/Outlook OAuth
4. Verify primary calendar appears in CalendarPicker

### Test Multiple Calendars
1. Go to Connections tab in Calendar Dashboard
2. Click refresh icon in CalendarPicker
3. Toggle additional calendars on/off
4. Verify settings persist after page reload

### Test Availability
1. Add multiple calendars with events
2. Enable "Check availability" for all
3. Book a consultation
4. Verify system checks all enabled calendars for conflicts

## API Reference

### Fetch Calendar List (Google)
```typescript
const { data } = await supabase.functions.invoke('google-calendar-list', {
  body: { accessToken: 'user_access_token' }
});
// Returns: { calendars: [...] }
```

### Fetch Calendar List (Outlook)
```typescript
const { data } = await supabase.functions.invoke('outlook-calendar-list', {
  body: { accessToken: 'user_access_token' }
});
// Returns: { calendars: [...] }
```

### Add Calendar to Sync
```typescript
await supabase.from('google_calendar_tokens').insert({
  user_id: userId,
  calendar_id: 'calendar_id',
  calendar_name: 'Work Calendar',
  access_token: token,
  refresh_token: refreshToken,
  token_expiry: expiry,
  sync_enabled: true,
  check_availability: true,
  is_primary: false
});
```

## Best Practices

1. **Primary Calendar**: Always maintain one primary calendar per provider
2. **Token Sharing**: All calendars from same provider share access/refresh tokens
3. **Availability**: Only enable "Check availability" for calendars that should block booking times
4. **Sync**: Disable sync for read-only or low-priority calendars to reduce API calls
5. **Performance**: Limit to 5-10 calendars per provider for optimal performance

## Troubleshooting

### Calendar Not Appearing
- Verify OAuth scopes include calendar read access
- Check access token is valid and not expired
- Ensure calendar is not hidden in provider settings

### Sync Not Working
- Verify `sync_enabled = true` for the calendar
- Check token expiry and refresh if needed
- Review edge function logs for API errors

### Availability Conflicts
- Confirm `check_availability = true` for relevant calendars
- Verify event times are in correct timezone
- Check for overlapping events across calendars

## Future Enhancements

- [ ] Calendar color coding in UI
- [ ] Bulk enable/disable all calendars
- [ ] Calendar-specific notification settings
- [ ] Event filtering by calendar
- [ ] Calendar groups/categories
- [ ] Shared calendar support
- [ ] Calendar permissions management

## Support

For issues or questions:
1. Check edge function logs in Supabase dashboard
2. Verify database schema matches documentation
3. Test OAuth flow in incognito mode
4. Review browser console for client-side errors
