# Calendar Event Edit and Delete Guide

## Overview
Complete implementation of calendar event editing and deletion with sync across Google, Outlook, and Apple calendars.

## Features Implemented

### 1. Event Edit Functionality
- **EventEditForm Component** (`src/components/calendar/EventEditForm.tsx`)
  - Pre-populated form with existing event data
  - All fields editable: title, description, dates/times, location, attendees
  - Reuses same UI/UX as event creation form

### 2. Event Delete Functionality
- **Delete Confirmation Dialog**
  - AlertDialog with confirmation message
  - Shows event title being deleted
  - Warning that action cannot be undone

### 3. Recurring Event Support
- **This Event vs All Events**
  - Radio button selection for recurring events
  - "This event only" - modifies single occurrence
  - "All events in series" - modifies entire series
  - Applies to both edit and delete operations

### 4. Multi-Calendar Service Methods
- **updateEventInAllCalendars()** - Updates event across all connected calendars
- **deleteEventFromAllCalendars()** - Deletes event from all connected calendars
- Both methods accept `recurringOption` parameter for recurring events

### 5. UI Integration
- **Event Details Dialog**
  - Edit button opens EventEditForm
  - Delete button opens confirmation dialog
  - Shows event description and location if available

## Usage

### Editing an Event
1. Click on any event in calendar or event list
2. Event details dialog opens
3. Click "Edit" button
4. If recurring: choose "This event only" or "All events in series"
5. Modify event details in form
6. Click "Update Event"
7. Event syncs to all connected calendars

### Deleting an Event
1. Click on any event in calendar or event list
2. Event details dialog opens
3. Click "Delete" button
4. Confirmation dialog appears
5. If recurring: choose "This event only" or "All events in series"
6. Click "Delete" to confirm
7. Event removed from all connected calendars

## API Integration

### Update Event
```typescript
await multiCalendarService.updateEventInAllCalendars(
  userId,
  eventId,
  provider,
  eventData,
  recurringOption // 'this' | 'all' | undefined
);
```

### Delete Event
```typescript
await multiCalendarService.deleteEventFromAllCalendars(
  userId,
  eventId,
  provider,
  recurringOption // 'this' | 'all' | undefined
);
```

## Two-Way Sync
- Events created in app sync to all calendars
- Events created externally sync back via webhooks
- Updates and deletes propagate across all providers
- Real-time UI updates after successful operations

## Success Feedback
- Toast notifications show sync status
- Success count displayed (e.g., "Event updated in 3 calendars")
- Error handling for failed syncs
- UI refreshes automatically after operations

## Files Modified
- `src/components/calendar/EventEditForm.tsx` (NEW)
- `src/lib/multiCalendarService.ts` (UPDATED)
- `src/pages/CalendarDashboard.tsx` (UPDATED)

## Next Steps
- Edge functions (google-calendar-create-event, outlook-calendar-events, apple-calendar-sync) handle the actual API calls
- Ensure these functions support 'update' and 'delete' actions
- Test with actual calendar connections
