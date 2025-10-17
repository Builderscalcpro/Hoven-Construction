# 🚀 Run GitHub Secrets Sync - Quick Guide

## One-Command Setup

```bash
# Make script executable and run
chmod +x scripts/automated-secrets-sync.sh
./scripts/automated-secrets-sync.sh
```

## What This Does

1. ✅ Reads all variables from `.env.example`
2. ✅ Syncs them to GitHub Actions Secrets
3. ✅ Syncs them to Supabase Project Secrets
4. ✅ Validates all secrets are configured
5. ✅ Shows detailed status report

## Individual Commands

```bash
# Sync to GitHub only
npm run sync-github-secrets

# Sync to Supabase only
npm run sync-supabase-secrets

# Validate GitHub secrets
npm run validate-github-secrets

# Validate Supabase secrets
npm run validate-supabase-secrets
```

## Prerequisites

- GitHub Personal Access Token with `repo` scope
- Supabase Access Token
- Node.js 18+ installed
- Supabase CLI installed

## Automated Weekly Sync

The system automatically syncs every Monday at 9 AM UTC via GitHub Actions.

View workflow: `.github/workflows/secrets-sync.yml`

## Manual Trigger via GitHub

1. Go to your repository on GitHub
2. Click "Actions" tab
3. Select "Weekly Secrets Sync" workflow
4. Click "Run workflow"

## Webhook for CI/CD

Add to your deployment pipeline:

```bash
curl -X POST "https://YOUR_PROJECT.supabase.co/functions/v1/webhook-secrets-sync" \
  -H "Content-Type: application/json" \
  -d '{"platform":"both","trigger":"ci-cd"}'
```

## Troubleshooting

### Permission Denied

```bash
chmod +x scripts/automated-secrets-sync.sh
```

### GitHub Token Issues

Ensure your `GITHUB_TOKEN` has `repo` and `admin:repo_hook` scopes.

### Supabase CLI Not Found

```bash
# Install Supabase CLI
npm install -g supabase
```

## View Sync Status

Visit the admin dashboard: `/admin/secrets`

Real-time status of all secrets across both platforms.
