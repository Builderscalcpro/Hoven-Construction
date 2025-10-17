# Automated Secrets Sync System

Complete automation for syncing environment variables to GitHub Actions and Supabase Edge Functions with weekly scheduling, email notifications, and webhook integration.

## 🎯 Features

- ✅ **Weekly Automated Sync** - Runs every Monday at 9 AM UTC
- ✅ **Email Notifications** - Alerts when secrets are missing or outdated
- ✅ **Webhook Endpoint** - CI/CD pipeline integration for pre-deployment validation
- ✅ **Real-time Validation** - Ensures all required secrets are configured
- ✅ **Audit Trail** - Database tracking of all sync operations
- ✅ **Manual Triggers** - On-demand sync via GitHub Actions or scripts

## 🚀 Quick Setup

### 1. Deploy Edge Functions

```bash
# Deploy webhook endpoint
supabase functions deploy webhook-secrets-sync

# Deploy scheduled sync function
supabase functions deploy scheduled-secrets-sync

# Get the webhook URL
echo "https://YOUR_PROJECT_ID.supabase.co/functions/v1/webhook-secrets-sync"
```

### 2. Configure GitHub Secrets

Add these secrets to your GitHub repository:

```
SUPABASE_ACCESS_TOKEN=your_supabase_access_token
SUPABASE_WEBHOOK_URL=https://YOUR_PROJECT_ID.supabase.co/functions/v1/webhook-secrets-sync
```

### 3. Enable Weekly Automation

The GitHub Actions workflow `.github/workflows/secrets-sync.yml` is already configured to run weekly.

### 4. Configure Email Notifications

Update the email addresses in `supabase/functions/scheduled-secrets-sync/index.ts`:

```typescript
to: [{ email: 'admin@yourdomain.com' }],
from: { email: 'noreply@yourdomain.com' }
```

## 📋 Usage

### Manual Sync

```bash
# Sync both platforms
./scripts/automated-secrets-sync.sh

# Or use npm scripts
npm run sync-github-secrets
npm run sync-supabase-secrets
```

### Webhook Integration (CI/CD)

Add to your deployment pipeline:

```yaml
- name: Validate Secrets Before Deploy
  run: |
    curl -X POST "https://YOUR_PROJECT.supabase.co/functions/v1/webhook-secrets-sync" \
      -H "Content-Type: application/json" \
      -d '{"platform":"both","trigger":"ci-cd"}'
```

### Trigger from Admin Dashboard

Use the Secrets Management page at `/admin/secrets` to manually sync and validate.

## 🔔 Email Notifications

Notifications are sent when:
- Secrets are missing on either platform
- Weekly sync detects configuration issues
- Manual sync operations complete

## 📊 Monitoring

View sync history in the admin dashboard:
- Sync timestamps
- Success/failure status
- Missing secrets list
- Platform-specific issues

## 🔧 Configuration

### Scheduled Sync Frequency

Edit `.github/workflows/secrets-sync.yml`:

```yaml
schedule:
  - cron: '0 9 * * 1'  # Every Monday at 9 AM UTC
```

### Required Secrets List

Edit both edge functions to add/remove secrets:

```typescript
const requiredSecrets = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  // Add your secrets here
];
```

## 🛠️ Troubleshooting

### Webhook Not Responding

```bash
# Test webhook
curl -X POST "https://YOUR_PROJECT.supabase.co/functions/v1/webhook-secrets-sync" \
  -H "Content-Type: application/json" \
  -d '{"platform":"both"}'
```

### Email Not Sending

Verify SendGrid API key is configured:

```bash
supabase secrets list | grep SENDGRID
```

### GitHub Actions Failing

Check workflow logs and ensure `GITHUB_TOKEN` has proper permissions.

## 📚 Related Documentation

- [Secrets Management Dashboard](./SECRETS_SYNC_DASHBOARD.md)
- [Supabase Secrets Setup](./SUPABASE_SECRETS_SETUP.md)
- [GitHub Secrets Automation](./GITHUB_SECRETS_AUTOMATION.md)
