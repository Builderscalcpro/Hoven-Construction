# Apple Calendar (iCloud) Integration Setup Guide

## Overview
This guide explains how to connect Apple Calendar (iCloud) to your application using CalDAV protocol with app-specific passwords.

## Prerequisites
- Active iCloud account
- Two-factor authentication enabled on your Apple ID

## Setup Instructions

### Step 1: Generate App-Specific Password

1. Go to [appleid.apple.com](https://appleid.apple.com)
2. Sign in with your Apple ID
3. Navigate to **Security** section
4. Under **App-Specific Passwords**, click **Generate Password**
5. Enter a label (e.g., "Calendar Sync App")
6. Copy the generated password (format: xxxx-xxxx-xxxx-xxxx)
7. **Important**: Save this password securely - you won't be able to view it again

### Step 2: Connect in Application

1. Navigate to **Calendar Dashboard** → **Connections** tab
2. Click **Connect Calendar** button
3. Select **Apple Calendar** card
4. Click **Configure Apple Calendar**
5. Enter your credentials:
   - **Apple ID**: Your iCloud email address (e.g., your@icloud.com)
   - **App-Specific Password**: The password you generated in Step 1
6. Click **Connect Apple Calendar**

### Step 3: Verify Connection

After successful connection:
- Your Apple Calendar will appear in the calendar picker
- Events will sync automatically via CalDAV
- You can enable/disable availability checking for this calendar

## Features

### Supported Functionality
- ✅ Read calendar events
- ✅ Sync events to application
- ✅ Check availability across multiple calendars
- ✅ Two-way sync with consultations
- ✅ Conflict detection

### CalDAV Endpoint
The application connects to: `https://caldav.icloud.com`

## Multi-Calendar Support

You can connect multiple calendar providers simultaneously:
- **Google Calendar** (OAuth 2.0)
- **Outlook Calendar** (OAuth 2.0)
- **Apple Calendar** (CalDAV with app-specific password)
- **Generic CalDAV** (Any CalDAV-compatible service)

All connected calendars sync together for unified availability management.

## Troubleshooting

### Connection Failed
- Verify two-factor authentication is enabled on your Apple ID
- Ensure you're using an app-specific password, not your regular Apple ID password
- Check that your Apple ID email is correct
- Try generating a new app-specific password

### Events Not Syncing
- Check the last sync time in the calendar connections manager
- Verify the calendar is marked as active
- Ensure "Check Availability" is enabled for the calendar
- Try manually triggering a sync

### Password Issues
- App-specific passwords are different from your Apple ID password
- Each app-specific password can only be viewed once during creation
- If lost, revoke the old password and generate a new one
- App-specific passwords are 16 characters with hyphens (xxxx-xxxx-xxxx-xxxx)

## Security Notes

- App-specific passwords are stored encrypted in the database
- Passwords are never exposed in the frontend
- CalDAV connections use HTTPS for secure communication
- You can revoke app-specific passwords anytime from appleid.apple.com

## Database Schema

The `apple_calendar_tokens` table stores:
- User ID (foreign key to auth.users)
- Apple ID (email)
- Encrypted app-specific password
- CalDAV URL (default: https://caldav.icloud.com)
- Connection status and last sync time

## API Integration

The system uses:
- **Edge Function**: `apple-calendar-sync` for CalDAV operations
- **Service**: `appleCalendarService` for credential management
- **Multi-Calendar Service**: Aggregates events from all providers

## Next Steps

After connecting Apple Calendar:
1. Configure which calendars to check for availability
2. Set up working hours and availability preferences
3. Enable automatic consultation syncing
4. Review conflict detection settings
