# OAuth Connection Manager - User Guide

## Overview
The unified OAuth Connection Manager provides a centralized location to manage all your calendar and business service integrations in one place.

## Access
Navigate to: `/oauth-connections` (Protected route - requires authentication)
Or click "OAuth Connections" from your Dashboard

## Features

### 1. Connection Overview Tab
View the status of all your OAuth connections:

#### Google Calendar
- **Status**: Active/Expired/Not Connected
- **Account**: Connected email address
- **Token Expiry**: Days until token expires
- **Scopes**: Calendar read, write, events permissions
- **Actions**: Reconnect (if expired), Disconnect

#### Google Business Profile
- **Status**: Active/Expired/Not Connected
- **Account**: Business account name
- **Token Expiry**: Days until token expires
- **Scopes**: Business profile, reviews, posts permissions
- **Actions**: Reconnect (if expired), Disconnect

#### Outlook Calendar
- **Status**: Active/Expired/Not Connected
- **Account**: Connected email address
- **Token Expiry**: Days until token expires
- **Scopes**: Calendars read, write permissions
- **Actions**: Reconnect (if expired), Disconnect

#### Apple Calendar
- **Status**: Active/Not Connected
- **Account**: Apple ID
- **Token Expiry**: N/A (uses app-specific password)
- **Scopes**: Calendar read, write
- **Actions**: Disconnect

### 2. Connect Services Tab
Setup new connections for each provider:

#### Google Calendar Setup
- Click "Connect Google Calendar"
- Authorize with your Google account
- Grant calendar permissions
- Connection established automatically

#### Outlook Calendar Setup
- Click "Connect Outlook Calendar"
- Sign in with Microsoft account
- Grant calendar permissions
- Connection established automatically

#### Google Business Profile Setup
- Click "Connect Google Business"
- Authorize with your Google Business account
- Grant business profile and reviews permissions
- Connection established automatically

#### Apple Calendar Setup
- Generate app-specific password from Apple ID settings
- Enter your Apple ID email
- Enter app-specific password
- Click "Connect Apple Calendar"

## Token Management

### Token Expiry Indicators
- **Green Badge**: Active connection, token valid
- **Red Badge**: Token expired, needs reconnection
- **Gray Badge**: Not connected

### Token Expiry Display
- "Expires in X days" - Token still valid
- "Expires today" - Token expires today
- "Expires tomorrow" - Token expires tomorrow
- "Expired" - Token has expired, reconnect required

### Reconnecting Expired Tokens
1. Click "Reconnect" button on expired connection
2. Re-authorize with the service provider
3. New token issued automatically
4. Connection restored

## Granted Scopes

Each connection displays the OAuth scopes (permissions) granted:

### Google Calendar Scopes
- `calendar.readonly` - Read calendar events
- `calendar.events` - Create/modify events
- `calendar` - Full calendar access

### Google Business Scopes
- `business.manage` - Manage business profile
- `business.reviews` - Read and respond to reviews
- `business.posts` - Create and manage posts

### Outlook Calendar Scopes
- `Calendars.Read` - Read calendar events
- `Calendars.ReadWrite` - Create/modify events
- `offline_access` - Refresh token access

### Apple Calendar Scopes
- `calendar.read` - Read calendar events
- `calendar.write` - Create/modify events

## Disconnecting Services

To disconnect a service:
1. Click "Disconnect" button
2. Confirm disconnection
3. All tokens and data removed
4. Can reconnect anytime

## Troubleshooting

### Connection Failed
- Verify you're using correct credentials
- Check that you've granted all required permissions
- Ensure browser allows popups for OAuth flow

### Token Expired
- Click "Reconnect" to refresh token
- Re-authorize with service provider
- New token issued automatically

### Scopes Missing
- Disconnect and reconnect service
- Ensure all permissions granted during OAuth flow
- Contact support if issues persist

## Security

- All tokens encrypted in database
- Tokens automatically refreshed before expiry
- Disconnect removes all stored credentials
- OAuth 2.0 standard security protocols

## Related Features

- **Calendar Dashboard**: View and manage all connected calendars
- **Google Business Dashboard**: Manage business profile and reviews
- **Consultations**: Book appointments synced to connected calendars
