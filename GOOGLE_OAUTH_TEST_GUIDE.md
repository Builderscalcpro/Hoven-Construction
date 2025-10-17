# Google OAuth Integration Test Guide

## Overview
The Google OAuth Test page (`/google-oauth-test`) provides comprehensive testing and diagnostics for Google OAuth, Calendar, and Business Profile integrations.

## Access the Test Page

1. **Navigate to Admin Dashboard**
   - Sign in as an admin user
   - Go to `/admin`

2. **Click "Google OAuth Test"**
   - Find the card labeled "Google OAuth Test" with a test tube icon
   - Click to open the test page

## Test Features

### 1. Configuration Status
- **Google Client ID**: Shows if the client ID is configured in environment variables
- **Supabase Connection**: Verifies Supabase is properly connected
- **Current User**: Displays the currently signed-in user
- **Redirect URI**: Shows the OAuth callback URL

### 2. Session Check
- Click "Check Current Session" to view:
  - Provider authentication method
  - Access and refresh tokens
  - Session expiration
  - Provider tokens (Google OAuth tokens)

### 3. Authentication Test
- **Test Google Sign-In**: Basic authentication flow
- Tests email and profile scope access
- Verifies OAuth redirect and callback

### 4. Calendar Connection Test
- **Connect Google Calendar**: Tests calendar API permissions
- Requests calendar read/write access
- Verifies calendar event management capabilities

### 5. Business Profile Test
- **Connect Business Profile**: Tests Business Profile API access
- Requests business management permissions
- Verifies ability to manage Google Business Profile

## Troubleshooting

### Common Issues

1. **"Missing Client ID"**
   - Add `VITE_GOOGLE_CLIENT_ID` to your `.env` file
   - Restart the development server

2. **"OAuth Error: Invalid Client"**
   - Verify Client ID matches Google Cloud Console
   - Check Client Secret is in Supabase Vault
   - Ensure redirect URIs are configured

3. **"Permission Denied"**
   - Enable required APIs in Google Cloud Console:
     - Google Calendar API
     - Google My Business API
   - Add scopes to OAuth consent screen

4. **"Redirect URI Mismatch"**
   - Add these URIs to Google Cloud Console:
     - `http://localhost:5173/auth/callback` (development)
     - `https://your-domain.com/auth/callback` (production)
     - `http://localhost:5173/google-oauth-test` (test page)

## Required Configuration

### Environment Variables (.env)
```env
VITE_GOOGLE_CLIENT_ID=your-client-id
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Supabase Vault Secrets
- `GOOGLE_CLIENT_ID`: Same as environment variable
- `GOOGLE_CLIENT_SECRET`: Your OAuth client secret

### Google Cloud Console Setup
1. Enable APIs:
   - Google Calendar API
   - Google My Business API
   - Google+ API (for basic profile)

2. Configure OAuth Consent Screen:
   - Add scopes:
     - `email`
     - `profile`
     - `https://www.googleapis.com/auth/calendar`
     - `https://www.googleapis.com/auth/calendar.events`
     - `https://www.googleapis.com/auth/business.manage`

3. Add Authorized Redirect URIs:
   - Development: `http://localhost:5173/auth/callback`
   - Production: `https://your-domain.com/auth/callback`
   - Test page: `http://localhost:5173/google-oauth-test`

## Success Indicators

✅ **Configuration Status**: All items show "Configured" or "Connected"
✅ **Session Check**: Shows provider tokens present
✅ **Auth Test**: Successfully initiates OAuth flow
✅ **Calendar Test**: Requests calendar permissions
✅ **Business Test**: Requests business management permissions

## Next Steps

After successful testing:
1. Implement calendar sync features
2. Set up Google Business Profile integration
3. Configure webhook notifications
4. Enable automatic token refresh
5. Add error recovery mechanisms