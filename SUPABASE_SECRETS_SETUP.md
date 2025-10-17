# Supabase Secrets Automated Sync System

Complete guide for syncing environment variables to Supabase project secrets with validation.

## 🚀 Quick Start

```bash
# 1. Install Supabase CLI (if not installed)
npm install -g supabase

# 2. Login to Supabase
supabase login

# 3. Sync all secrets from .env.example
npm run sync-supabase-secrets

# 4. Validate all edge functions have required secrets
npm run validate-supabase-secrets

# 5. Deploy edge functions with validation
bash deploy-supabase-functions.sh
```

## 📋 What Gets Synced

All environment variables from `.env.example` are automatically synced to your Supabase project:

- **API Keys**: Anthropic, SendGrid, Stripe, Google
- **OAuth Credentials**: Google Calendar, Google Business, Microsoft
- **Supabase Config**: Service role keys, URLs
- **Analytics**: GA4, GTM, Facebook Pixel IDs
- **Email**: SendGrid templates and settings

## 🔧 Available Commands

### Sync Secrets
```bash
npm run sync-supabase-secrets
```
Reads `.env.example` and syncs all variables to Supabase project secrets.

### Validate Secrets
```bash
npm run validate-supabase-secrets
```
Checks that all edge functions have their required secrets configured.

### Deploy with Validation
```bash
bash deploy-supabase-functions.sh
```
Validates secrets, then deploys all edge functions.

## 📦 Edge Function Secret Requirements

| Function | Required Secrets |
|----------|-----------------|
| ai-chatbot | ANTHROPIC_API_KEY, VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY |
| ai-email-suggestions | ANTHROPIC_API_KEY, SUPABASE_SERVICE_ROLE_KEY |
| google-calendar-auth | GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET |
| google-business-auth | VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID, GOOGLE_CLIENT_SECRET |
| stripe-process-payment | STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET |
| send-email | SENDGRID_API_KEY |

## 🔍 Manual Secret Management

### List all secrets
```bash
supabase secrets list --project-ref YOUR_PROJECT_ID
```

### Set individual secret
```bash
supabase secrets set SECRET_NAME="value" --project-ref YOUR_PROJECT_ID
```

### Unset secret
```bash
supabase secrets unset SECRET_NAME --project-ref YOUR_PROJECT_ID
```

## ✅ Pre-Deployment Checklist

- [ ] Supabase CLI installed and logged in
- [ ] `.env.example` contains all required variables
- [ ] Project ID correctly configured
- [ ] All secrets synced successfully
- [ ] Validation passes for all edge functions

## 🐛 Troubleshooting

### "Supabase CLI not found"
```bash
npm install -g supabase
```

### "Could not find project ID"
Ensure `VITE_SUPABASE_URL` in `.env.example` is correct:
```
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
```

### "Authentication required"
```bash
supabase login
```

### Secrets not updating
```bash
# Force re-sync
npm run sync-supabase-secrets
```

## 🔐 Security Best Practices

1. **Never commit** `.env` files with real secrets
2. **Use `.env.example`** with placeholder values for version control
3. **Rotate secrets** regularly
4. **Validate** before every deployment
5. **Monitor** secret usage in Supabase dashboard
