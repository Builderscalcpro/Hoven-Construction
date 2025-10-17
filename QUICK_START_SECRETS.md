# Quick Start: GitHub Secrets Sync

Sync your environment variables to GitHub Secrets in 3 easy steps.

## Method 1: Interactive Setup (Recommended)

```bash
npm run setup-secrets
```

This will:
1. Prompt for your GitHub token
2. Prompt for your repository (owner/repo)
3. Automatically sync all secrets from .env.example

## Method 2: Manual Setup

### Step 1: Set Environment Variables

```bash
export GITHUB_TOKEN="ghp_your_token_here"
export GITHUB_REPOSITORY="yourusername/yourrepo"
```

### Step 2: Sync Secrets

```bash
npm run sync-secrets
```

### Step 3: Validate (Optional)

```bash
npm run validate-secrets
```

## Getting Your GitHub Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scope: **repo** (full control)
4. Copy the token (starts with `ghp_`)

## What Gets Synced?

All environment variables from `.env.example`:
- ✅ VITE_SUPABASE_URL
- ✅ VITE_SUPABASE_ANON_KEY
- ✅ VITE_STRIPE_PUBLISHABLE_KEY
- ✅ VITE_GOOGLE_CLIENT_ID
- ✅ VITE_GOOGLE_API_KEY
- ✅ VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID
- ✅ VITE_GA_MEASUREMENT_ID
- ✅ VITE_SENTRY_DSN
- ✅ VITE_CDN_* (all CDN variables)

## Troubleshooting

**"GITHUB_TOKEN is required"**
```bash
export GITHUB_TOKEN="your_token"
```

**"Missing required secrets"**
- Update values in `.env.example`
- Replace placeholders like `your_key_here`

**"Failed to set secret"**
- Check token has `repo` scope
- Verify repository name format: `owner/repo`

## CI/CD Integration

Secrets are automatically validated before deployment in GitHub Actions.

See: `.github/workflows/deploy.yml`
