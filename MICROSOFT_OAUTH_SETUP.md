# Microsoft OAuth Setup for Outlook Calendar Integration

## Overview
This guide walks you through setting up Microsoft OAuth credentials to enable Outlook Calendar integration in your application.

## Prerequisites
- Microsoft account (personal or work/school)
- Access to Azure Portal
- Supabase project with edge functions

## Step 1: Register Application in Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**

### Application Details
- **Name**: Your Application Name (e.g., "Construction CRM Calendar Sync")
- **Supported account types**: Select "Accounts in any organizational directory and personal Microsoft accounts"
- **Redirect URI**: 
  - Platform: Web
  - URI: `https://yourdomain.com/calendar` (replace with your actual domain)

4. Click **Register**

## Step 2: Configure API Permissions

1. In your app registration, go to **API permissions**
2. Click **Add a permission**
3. Select **Microsoft Graph**
4. Choose **Delegated permissions**
5. Add the following permissions:
   - `Calendars.ReadWrite` - Read and write user calendars
   - `User.Read` - Sign in and read user profile
   - `offline_access` - Maintain access to data

6. Click **Add permissions**
7. Click **Grant admin consent** (if you have admin rights)

## Step 3: Create Client Secret

1. Go to **Certificates & secrets**
2. Click **New client secret**
3. Add a description: "Calendar Sync Secret"
4. Choose expiration: 24 months (recommended)
5. Click **Add**
6. **IMPORTANT**: Copy the secret value immediately (you won't see it again)

## Step 4: Get Application Credentials

From your app registration overview page, copy:
- **Application (client) ID**
- **Client secret** (from previous step)

## Step 5: Configure Supabase Secrets

Add the credentials to your Supabase project:

```bash
# Using Supabase CLI
supabase secrets set MICROSOFT_CLIENT_ID="your-client-id"
supabase secrets set MICROSOFT_CLIENT_SECRET="your-client-secret"
```

Or via Supabase Dashboard:
1. Go to Project Settings > Edge Functions
2. Add secrets:
   - Name: `MICROSOFT_CLIENT_ID`, Value: your client ID
   - Name: `MICROSOFT_CLIENT_SECRET`, Value: your client secret

## Step 6: Update Redirect URIs

Add all necessary redirect URIs in Azure Portal:

**Production**:
- `https://yourdomain.com/calendar`

**Development**:
- `http://localhost:5173/calendar`
- `http://localhost:3000/calendar`

## Step 7: Test the Integration

1. Navigate to `/calendar` in your application
2. Click "Connect Outlook Calendar"
3. Sign in with your Microsoft account
4. Grant permissions
5. You should be redirected back with a success message

## Troubleshooting

### "Redirect URI mismatch" Error
- Verify the redirect URI in Azure matches exactly (including protocol and trailing slashes)
- Check that you're using the correct environment URL

### "Invalid client secret" Error
- Ensure MICROSOFT_CLIENT_SECRET is set correctly in Supabase
- Check if the secret has expired (renew in Azure Portal)

### "Insufficient permissions" Error
- Verify all required API permissions are added
- Grant admin consent if required by your organization

### Token Refresh Issues
- Ensure `offline_access` permission is granted
- Check that refresh tokens are being stored correctly

## Security Best Practices

1. **Never expose secrets in frontend code**
   - All OAuth operations happen in edge functions
   - Secrets are only accessible server-side

2. **Use HTTPS in production**
   - Microsoft OAuth requires secure redirect URIs

3. **Rotate secrets regularly**
   - Set reminders to renew client secrets before expiration
   - Update Supabase secrets when rotating

4. **Limit permissions**
   - Only request the minimum permissions needed
   - Review permissions periodically

## API Scopes Explained

- `Calendars.ReadWrite`: Full access to user's calendars (read/write/delete events)
- `User.Read`: Basic user profile information
- `offline_access`: Enables refresh tokens for long-term access

## Multi-Calendar Support

Once configured, users can:
- Connect multiple Outlook calendars (Work, Personal, etc.)
- Select which calendars to sync
- Toggle availability checking per calendar
- View all calendars in unified dashboard

## Next Steps

After setup is complete:
1. Test calendar connection
2. Verify event synchronization
3. Enable multi-calendar selection
4. Configure availability settings

## Resources

- [Microsoft Identity Platform Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [Microsoft Graph API Reference](https://docs.microsoft.com/en-us/graph/api/overview)
- [OAuth 2.0 Authorization Code Flow](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow)
