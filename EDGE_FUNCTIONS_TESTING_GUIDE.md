# Edge Functions Testing Guide

## Prerequisites
- Supabase CLI installed
- Project linked to Supabase
- Environment variables configured

## Testing Individual Functions

### 1. AI Chatbot
```bash
curl -X POST https://your-project.supabase.co/functions/v1/ai-chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how can you help me?"}'
```

### 2. Send Email (SendGrid)
```bash
curl -X POST https://your-project.supabase.co/functions/v1/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "customer@example.com",
    "subject": "Test Email",
    "html": "<h1>Hello</h1><p>This is a test.</p>"
  }'
```

### 3. Google Calendar Auth
```bash
curl -X POST https://your-project.supabase.co/functions/v1/google-calendar-auth \
  -H "Content-Type: application/json" \
  -d '{
    "code": "AUTHORIZATION_CODE_FROM_OAUTH",
    "redirectUri": "http://localhost:5173/calendar/callback"
  }'
```

### 4. Process Payment (Stripe)
```bash
curl -X POST https://your-project.supabase.co/functions/v1/process-payment \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "currency": "usd",
    "paymentMethodId": "pm_card_visa",
    "description": "Test payment"
  }'
```

### 5. AI Email Suggestions
```bash
curl -X POST https://your-project.supabase.co/functions/v1/ai-email-suggestions \
  -H "Content-Type: application/json" \
  -d '{
    "context": "Customer inquiry about kitchen remodel",
    "recipientName": "John Doe",
    "emailType": "follow-up"
  }'
```

### 6. AI Project Estimator
```bash
curl -X POST https://your-project.supabase.co/functions/v1/ai-project-estimator \
  -H "Content-Type: application/json" \
  -d '{
    "projectType": "Kitchen Remodel",
    "scope": "Full renovation with new cabinets and countertops",
    "materials": "Mid-range",
    "location": "California"
  }'
```

### 7. Sync Google Reviews
```bash
curl -X POST https://your-project.supabase.co/functions/v1/sync-google-reviews \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid",
    "locationId": "location-id"
  }'
```

## Environment Variables Required

Add these to your Supabase project:
- `ANTHROPIC_API_KEY` - For AI functions
- `SENDGRID_API_KEY` - For email
- `STRIPE_SECRET_KEY` - For payments
- `GOOGLE_CLIENT_ID` - For Google OAuth
- `GOOGLE_CLIENT_SECRET` - For Google OAuth
- `GOOGLE_BUSINESS_PROFILE_CLIENT_ID` - For Google Business
- `GOOGLE_BUSINESS_PROFILE_CLIENT_SECRET` - For Google Business

## Common Issues

### 401 Unauthorized
- Check API keys are set correctly
- Verify keys haven't expired

### 408 Timeout
- Function taking too long (>30s)
- Check external API response times

### 500 Internal Error
- Check function logs: `supabase functions logs function-name`
- Verify all required parameters are provided
