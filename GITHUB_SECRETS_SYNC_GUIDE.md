# GitHub Secrets Sync Guide

Automatically sync environment variables from `.env.example` to GitHub Secrets for CI/CD deployment.

## Prerequisites

1. **GitHub Personal Access Token**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select scopes: `repo` (full control of private repositories)
   - Copy the token

2. **Install Dependencies** (optional for encryption)
   ```bash
   npm install libsodium-wrappers
   ```

## Setup

### 1. Set Environment Variables

```bash
# Your GitHub personal access token
export GITHUB_TOKEN="ghp_your_token_here"

# Your repository in format: owner/repo
export GITHUB_REPOSITORY="yourusername/yourrepo"
```

### 2. Update .env.example

Ensure all values in `.env.example` are set correctly:

```bash
# Edit .env.example with your actual values
nano .env.example
```

**Important**: Replace placeholder values like `your_supabase_anon_key_here` with actual values.

## Usage

### Sync All Secrets

```bash
node scripts/sync-env-to-github-secrets.js
```

This will:
- ✅ Read all variables from `.env.example`
- ✅ Validate required secrets are present
- ✅ Warn about placeholder values
- ✅ Encrypt and upload to GitHub Secrets
- ✅ Show sync status for each variable

### Validate Secrets

Check if all required secrets exist in GitHub:

```bash
node scripts/validate-secrets.js
```

## Required Secrets

The following secrets are required for deployment:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_GA_MEASUREMENT_ID`

## CI/CD Integration

### GitHub Actions Workflow

Add validation step to your deployment workflow:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Validate Secrets
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITHUB_REPOSITORY: ${{ github.repository }}
        run: node scripts/validate-secrets.js
      
      - name: Deploy
        run: npm run build && npm run deploy
```

## Troubleshooting

### "GITHUB_TOKEN is required"
Set the token: `export GITHUB_TOKEN="your_token"`

### "GITHUB_REPOSITORY is required"
Set the repo: `export GITHUB_REPOSITORY="owner/repo"`

### "Missing required secrets"
Update `.env.example` with actual values, then re-run sync script.

### "Placeholder values detected"
Replace values like `your_key_here` with actual API keys.

## Security Notes

- ✅ Never commit `.env` files with real secrets
- ✅ Use GitHub Secrets for sensitive data
- ✅ Rotate tokens regularly
- ✅ Limit token scopes to minimum required
- ✅ Secrets are encrypted before upload

## Manual Secret Management

You can also manage secrets via GitHub UI:
1. Go to your repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add name and value

## Quick Commands

```bash
# One-line setup and sync
export GITHUB_TOKEN="your_token" && \
export GITHUB_REPOSITORY="owner/repo" && \
node scripts/sync-env-to-github-secrets.js

# Validate before deployment
GITHUB_TOKEN="your_token" \
GITHUB_REPOSITORY="owner/repo" \
node scripts/validate-secrets.js
```
