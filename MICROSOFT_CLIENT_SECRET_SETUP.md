# Setting Up MICROSOFT_CLIENT_SECRET in Supabase

## Quick Setup Guide

### Step 1: Get Your Microsoft Client Secret

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Select your app (or create new one - see MICROSOFT_OAUTH_SETUP.md)
4. Go to **Certificates & secrets**
5. Click **New client secret**
6. Add description: "Calendar Integration Secret"
7. Choose expiration: 24 months
8. Click **Add**
9. **COPY THE SECRET VALUE IMMEDIATELY** (shown only once)

### Step 2: Add Secret to Supabase

#### Option A: Using Supabase CLI
```bash
supabase secrets set MICROSOFT_CLIENT_SECRET="your-secret-value-here"
```

#### Option B: Using Supabase Dashboard
1. Open your Supabase project
2. Go to **Project Settings** > **Edge Functions**
3. Scroll to **Secrets** section
4. Click **Add new secret**
5. Name: `MICROSOFT_CLIENT_SECRET`
6. Value: Paste your secret value
7. Click **Save**

### Step 3: Verify Setup

1. Check that secret appears in Supabase dashboard
2. Redeploy edge functions (they auto-reload with new secrets)
3. Test Outlook Calendar connection in your app

## Verification

Run this test to verify the secret is configured:

```typescript
// In your app, try connecting Outlook Calendar
// If you see "Microsoft OAuth credentials not configured" error,
// the secret is missing or incorrect
```

## Important Notes

⚠️ **Security**
- Never commit secrets to git
- Never expose secrets in frontend code
- Rotate secrets every 12-24 months

⚠️ **Expiration**
- Client secrets expire (6, 12, or 24 months)
- Set calendar reminder to renew before expiration
- Update Supabase secret when renewed

⚠️ **Required for Outlook Calendar**
- Without this secret, Outlook Calendar integration won't work
- Users will see connection errors
- Token refresh will fail

## Troubleshooting

### "Microsoft OAuth credentials not configured" Error
- Secret is missing or incorrect
- Follow steps above to add/update secret

### "Invalid client secret" Error
- Secret has expired in Azure Portal
- Create new secret and update Supabase

### "Failed to refresh token" Error
- Check secret hasn't expired
- Verify secret value is correct (no extra spaces)

## Complete Setup

For full Microsoft OAuth setup including:
- App registration
- API permissions
- Redirect URIs
- Testing

See: **MICROSOFT_OAUTH_SETUP.md**
