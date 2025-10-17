# GitHub Connection Guide

## Repository Information
**Repository URL:** https://github.com/Builderscalcpro/Hoven-Construction.git

## Initial Setup

### 1. Connect Local Repository to GitHub

```bash
# If this is a new local repository
git init
git remote add origin https://github.com/Builderscalcpro/Hoven-Construction.git

# If you need to update the remote URL
git remote set-url origin https://github.com/Builderscalcpro/Hoven-Construction.git

# Verify the remote connection
git remote -v
```

### 2. Push Your Code to GitHub

```bash
# Add all files
git add .

# Commit your changes
git commit -m "Initial commit: Hoven Construction application"

# Push to main branch
git push -u origin main
```

## Required GitHub Secrets

Configure these secrets in your GitHub repository settings:
**Settings → Secrets and variables → Actions → New repository secret**

### Deployment Secrets
- `VERCEL_TOKEN` - Your Vercel deployment token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID

### Supabase Secrets
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_ACCESS_TOKEN` - Supabase access token for deployments
- `SUPABASE_PROJECT_ID` - Your Supabase project reference ID
- `SUPABASE_DB_PASSWORD` - Your Supabase database password

### API Keys
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `VITE_GOOGLE_MAPS_API_KEY` - Google Maps API key
- `VITE_SENTRY_DSN` - Sentry DSN for error tracking

### Optional
- `SLACK_WEBHOOK_URL` - For deployment notifications

## GitHub Actions Workflows

Your repository includes two automated workflows:

### CI/CD Pipeline (`.github/workflows/ci.yml`)
Runs on every push and pull request:
- Code quality checks (linting, formatting, type checking)
- Unit tests with coverage
- Build verification
- Lighthouse performance testing

### Production Deployment (`.github/workflows/deploy.yml`)
Runs on push to main branch:
- Deploys web application to Vercel
- Deploys Supabase Edge Functions
- Runs database migrations
- Sends deployment notifications

## Quick Commands

```bash
# Clone the repository
git clone https://github.com/Builderscalcpro/Hoven-Construction.git

# Check current branch
git branch

# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Pull latest changes
git pull origin main

# Push your branch
git push origin feature/your-feature-name
```

## Troubleshooting

### Authentication Issues
If you encounter authentication issues:
1. Use a Personal Access Token (PAT) instead of password
2. Generate PAT at: https://github.com/settings/tokens
3. Use PAT as password when prompted

### Remote Already Exists
```bash
git remote remove origin
git remote add origin https://github.com/Builderscalcpro/Hoven-Construction.git
```

## Next Steps

1. ✅ Connect local repository to GitHub
2. ✅ Configure GitHub Secrets
3. ✅ Push initial code
4. ✅ Verify GitHub Actions run successfully
5. ✅ Set up branch protection rules (optional)
6. ✅ Configure deployment environments
