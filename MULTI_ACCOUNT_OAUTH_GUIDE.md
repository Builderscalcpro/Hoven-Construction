# Multi-Account OAuth Connection Manager Guide

## Overview
The OAuth Connection Manager now supports connecting multiple accounts per provider (e.g., multiple Google Calendar accounts, multiple Outlook accounts). Users can manage which accounts are actively syncing, set primary accounts, and choose which account to use when creating new events.

## Database Changes

### Migration Applied
Run the `supabase_multi_account_oauth.sql` migration to add support for multiple accounts:

```sql
-- Adds the following columns to each token table:
- account_label: Custom label for the account
- sync_enabled: Toggle for active syncing (default: true)
- is_primary: Designate primary account (default: false)

-- Ensures only one primary account per provider per user
-- Adds indexes for better query performance
```

### Key Features

1. **Multiple Accounts Per Provider**
   - Users can connect multiple Google Calendar accounts
   - Users can connect multiple Outlook Calendar accounts
   - Users can connect multiple Apple Calendar accounts
   - Users can connect multiple Google Business accounts

2. **Primary/Secondary Designation**
   - One account per provider can be marked as "Primary"
   - Primary accounts are used by default for availability checks
   - Trigger ensures only one primary account per provider

3. **Sync Toggle**
   - Each account has a `sync_enabled` flag
   - Only accounts with `sync_enabled=true` are included in availability aggregation
   - Users can temporarily disable syncing without disconnecting

4. **Custom Labels**
   - Users can add custom labels to identify accounts (e.g., "Work Calendar", "Personal")
   - Labels are displayed throughout the UI

## Components

### MultiAccountManager Component
Location: `src/components/MultiAccountManager.tsx`

Displays and manages multiple accounts for a single provider:
- Shows all connected accounts with labels
- Toggle sync on/off per account
- Set primary account (star icon)
- Edit account labels
- Delete accounts
- Visual indicator for primary account (green border)

### AccountSelector Component
Location: `src/components/AccountSelector.tsx`

Dropdown selector for choosing which account to use when creating events:
- Shows all accounts with sync enabled
- Displays account labels and provider badges
- Highlights primary account
- Auto-selects primary account by default
- Supports filtering by provider or showing all accounts

### Updated OAuthConnectionManager Page
Location: `src/pages/OAuthConnectionManager.tsx`

Two tabs:
1. **My Accounts**: View and manage all connected accounts grouped by provider
2. **Add New Account**: Connect additional accounts for each provider

## Updated Calendar Sync Logic

### Aggregated Availability
The `multiCalendarService.getAggregatedAvailability()` function now:
- Fetches events from ALL accounts with `sync_enabled=true`
- Aggregates events across all providers
- Checks conflicts across all active accounts

### Event Creation
The `EventCreationForm` component now:
- Includes an `AccountSelector` to choose which account to use
- Passes `accountId` and `provider` to the submission handler
- Creates events in the specific selected account (not all accounts)

### Service Updates
Location: `src/lib/multiCalendarService.ts`

New functions:
- `createEventInAccount(accountId, provider, userId, eventData)`: Create event in specific account
- `getAllAccounts(userId)`: Get all accounts across all providers

## Usage Examples

### Connecting Multiple Accounts

1. Navigate to OAuth Connection Manager
2. Click "Add New Account" tab
3. Connect additional Google/Outlook/Apple accounts
4. Each connection creates a new row in the respective token table

### Managing Accounts

1. Go to "My Accounts" tab
2. For each account you can:
   - Click star icon to set as primary
   - Toggle sync switch to enable/disable syncing
   - Click edit icon to add/change label
   - Click trash icon to remove account

### Creating Events with Specific Account

1. Open event creation form
2. Use the "Select Calendar Account" dropdown at the top
3. Choose which account to create the event in
4. Event will be created only in that specific account

### Availability Checking

The system automatically checks availability across all accounts with sync enabled:
- When booking consultations
- When viewing availability
- When detecting conflicts

## Database Schema

### google_calendar_tokens
```
- id (primary key)
- user_id (foreign key)
- email
- access_token
- refresh_token
- expires_at
- scope
- account_label (new)
- sync_enabled (new, default: true)
- is_primary (new, default: false)
```

### outlook_calendar_tokens
```
- id (primary key)
- user_id (foreign key)
- email
- access_token
- refresh_token
- expires_at
- scope
- account_label (new)
- sync_enabled (new, default: true)
- is_primary (new, default: false)
```

### apple_calendar_tokens
```
- id (primary key)
- user_id (foreign key)
- apple_id
- app_specific_password
- caldav_url
- account_label (new)
- sync_enabled (new, default: true)
- is_primary (new, default: false)
- is_active (existing)
```

## API Integration Notes

When calling calendar APIs, pass the specific `accountId` to use the correct tokens:

```typescript
// Example: Create event in specific Google account
const { data, error } = await supabase.functions.invoke('google-calendar-create-event', {
  body: {
    accountId: 'specific-account-id',
    userId: user.id,
    event: { /* event data */ }
  }
});
```

## Best Practices

1. **Primary Account**: Set the most frequently used account as primary
2. **Sync Toggle**: Disable sync for accounts you want to keep connected but not check for availability
3. **Labels**: Use descriptive labels like "Work", "Personal", "Family" for easy identification
4. **Token Expiry**: Monitor token expiry dates and reconnect when needed

## Troubleshooting

### Multiple Primary Accounts
If you see multiple primary accounts, the database trigger should automatically fix this. If not, manually set one account as primary.

### Events Not Syncing
Check that `sync_enabled=true` for the account in the database.

### Can't Create Events
Ensure you have at least one account with valid tokens connected.

## Future Enhancements

Potential improvements:
- Bulk operations (enable/disable sync for multiple accounts)
- Account-specific sync schedules
- Per-account notification preferences
- Calendar color coding by account
- Cross-account event duplication detection
