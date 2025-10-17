# Secrets Management Dashboard

## Overview
The Secrets Management Dashboard provides a centralized interface for monitoring and syncing environment variables across GitHub Actions and Supabase Edge Functions.

## Features

### Real-Time Status Monitoring
- **GitHub Secrets**: View which secrets are configured in GitHub Actions
- **Supabase Secrets**: Check which secrets are available in Supabase Edge Functions
- **Visual Indicators**: Color-coded badges show configuration status
- **Percentage Display**: See at-a-glance completion percentage for each platform

### One-Click Operations
- **Refresh Status**: Update the status display for each platform
- **Sync Buttons**: Quick access to sync commands
- **CLI Integration**: Direct commands for terminal execution

## Access

Navigate to: `/admin/secrets`

**Requirements**: Admin role required

## Using the Dashboard

### 1. Configure GitHub Repository
```
1. Enter your GitHub username/organization in the "Owner" field
2. Enter your repository name in the "Repository" field
3. Click "Refresh" on the GitHub Secrets card
```

### 2. Check Supabase Status
```
1. Click "Refresh" on the Supabase Secrets card
2. View which secrets are configured in your Supabase project
```

### 3. Sync Secrets
When you need to sync secrets, use the CLI commands displayed:

**GitHub Secrets:**
```bash
npm run sync-github-secrets
```

**Supabase Secrets:**
```bash
npm run sync-supabase-secrets
```

## Status Indicators

### ✅ Green Check (All Configured)
All required secrets are present and configured

### ⚠️ Yellow Warning (Partially Configured)
Some secrets are missing - action required

### ❌ Red X (Not Configured)
No secrets configured - immediate action required

### Badges
- **Configured**: Secret is present and available
- **Missing**: Secret needs to be added

## Required Secrets

The dashboard monitors these environment variables:

### Frontend Variables
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_GOOGLE_MAPS_API_KEY`
- `VITE_GOOGLE_CALENDAR_CLIENT_ID`
- `VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID`
- `VITE_MICROSOFT_CLIENT_ID`
- `VITE_GA4_MEASUREMENT_ID`
- `VITE_GTM_ID`
- `VITE_FACEBOOK_PIXEL_ID`

### Backend Variables
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `STRIPE_SECRET_KEY`
- `SENDGRID_API_KEY`
- `GITHUB_TOKEN`

## Edge Functions

The dashboard uses two Supabase Edge Functions:

### check-github-secrets
Queries the GitHub API to retrieve configured secrets for your repository.

### check-supabase-secrets
Checks which environment variables are available in the Supabase Edge Functions environment.

## Troubleshooting

### GitHub Secrets Not Loading
1. Verify your GitHub token is configured in Supabase secrets
2. Check that owner and repository names are correct
3. Ensure your GitHub token has `repo` scope

### Supabase Secrets Not Loading
1. Verify edge functions are deployed
2. Check Supabase project connection
3. Review edge function logs in Supabase dashboard

### Missing Secrets
1. Add secrets using the sync scripts
2. Verify `.env.example` contains all required variables
3. Run validation: `npm run validate-secrets`

## Best Practices

1. **Regular Monitoring**: Check the dashboard weekly
2. **Before Deployment**: Verify all secrets are configured
3. **After Updates**: Re-sync when adding new environment variables
4. **Security**: Never expose secrets in frontend code

## Related Documentation

- [GitHub Secrets Sync Guide](./GITHUB_SECRETS_SYNC_GUIDE.md)
- [Supabase Secrets Setup](./SUPABASE_SECRETS_SETUP.md)
- [Quick Start Secrets](./QUICK_START_SECRETS.md)
