# Edge Functions Deployment Guide

## Quick Start

### 1. Make deployment script executable
```bash
chmod +x deploy-functions.sh
```

### 2. Deploy all functions
```bash
./deploy-functions.sh
```

### 3. Deploy individual function
```bash
supabase functions deploy function-name --no-verify-jwt
```

## Manual Deployment Steps

### Prerequisites
1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project:
```bash
supabase link --project-ref your-project-ref
```

### Deploy Functions

```bash
# Deploy AI functions
supabase functions deploy ai-chatbot --no-verify-jwt
supabase functions deploy ai-email-suggestions --no-verify-jwt
supabase functions deploy ai-project-estimator --no-verify-jwt
supabase functions deploy ai-smart-scheduling --no-verify-jwt

# Deploy communication functions
supabase functions deploy send-email --no-verify-jwt
supabase functions deploy send-notification --no-verify-jwt

# Deploy OAuth functions
supabase functions deploy google-calendar-auth --no-verify-jwt
supabase functions deploy google-business-auth --no-verify-jwt

# Deploy integration functions
supabase functions deploy google-business-reviews --no-verify-jwt
supabase functions deploy google-business-locations --no-verify-jwt
supabase functions deploy sync-google-reviews --no-verify-jwt

# Deploy payment functions
supabase functions deploy process-payment --no-verify-jwt

# Deploy utility functions
supabase functions deploy generate-invoice-pdf --no-verify-jwt
```

## Environment Variables Setup

Set these in Supabase Dashboard → Project Settings → Edge Functions → Secrets:

```bash
# AI Services
ANTHROPIC_API_KEY=your_anthropic_key

# Email
SENDGRID_API_KEY=your_sendgrid_key

# Payments
STRIPE_SECRET_KEY=your_stripe_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Google Business
GOOGLE_BUSINESS_PROFILE_CLIENT_ID=your_gbp_client_id
GOOGLE_BUSINESS_PROFILE_CLIENT_SECRET=your_gbp_client_secret
```

## Verify Deployment

```bash
# List all deployed functions
supabase functions list

# Check function logs
supabase functions logs function-name --tail

# Test function
curl -X POST https://your-project.supabase.co/functions/v1/function-name \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## Troubleshooting

### Function not found
- Ensure function is deployed: `supabase functions list`
- Check function name matches exactly

### 500 Internal Error
- Check logs: `supabase functions logs function-name`
- Verify environment variables are set
- Test locally first: `supabase functions serve function-name`

### CORS errors
- Verify corsHeaders are included in response
- Check OPTIONS method handler exists
