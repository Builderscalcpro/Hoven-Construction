# Production Deployment Commands

## 🚀 Quick Deployment

### 1. Deploy All Functions (One Command)
```bash
./deploy-functions.sh
```

### 2. Deploy Individual Functions
```bash
# Critical functions
supabase functions deploy ai-chatbot --no-verify-jwt
supabase functions deploy send-email --no-verify-jwt
supabase functions deploy stripe-process-payment --no-verify-jwt

# Calendar functions
supabase functions deploy google-calendar-auth --no-verify-jwt
supabase functions deploy outlook-calendar-auth --no-verify-jwt
supabase functions deploy unified-calendar-events --no-verify-jwt

# AI functions
supabase functions deploy ai-email-suggestions --no-verify-jwt
supabase functions deploy ai-smart-scheduling --no-verify-jwt
supabase functions deploy ai-sentiment-analysis --no-verify-jwt
```

## 🧪 Testing Critical Functions

### AI Chatbot Test
```bash
curl -X POST "https://bmkqdwgcpjhmabadmilx.supabase.co/functions/v1/ai-chatbot" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What services do you offer?",
    "conversationHistory": []
  }'
```

### Send Email Test
```bash
curl -X POST "https://bmkqdwgcpjhmabadmilx.supabase.co/functions/v1/send-email" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@example.com",
    "subject": "Production Test",
    "html": "<h1>Test Email</h1><p>Deployment successful!</p>"
  }'
```

### Stripe Payment Test
```bash
curl -X POST "https://bmkqdwgcpjhmabadmilx.supabase.co/functions/v1/stripe-create-payment-intent" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 10000,
    "currency": "usd"
  }'
```

### SMS Test
```bash
curl -X POST "https://bmkqdwgcpjhmabadmilx.supabase.co/functions/v1/send-sms" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+1234567890",
    "message": "Test SMS from production"
  }'
```

## 📊 Check Logs

```bash
# Critical functions
supabase functions logs ai-chatbot --limit 50
supabase functions logs send-email --limit 50
supabase functions logs stripe-process-payment --limit 50

# Stream live logs
supabase functions logs ai-chatbot --follow

# Check for errors
supabase functions logs ai-chatbot --limit 100 | grep -i error
```

## ✅ Verify Secrets

```bash
# List all secrets (in Supabase Dashboard)
# Go to: Settings > Edge Functions > Secrets

# Required secrets:
# - SENDGRID_API_KEY
# - ANTHROPIC_API_KEY
# - OPENAI_API_KEY
# - STRIPE_SECRET_KEY
# - GOOGLE_CLIENT_ID
# - GOOGLE_CLIENT_SECRET
# - MICROSOFT_CLIENT_ID
# - MICROSOFT_CLIENT_SECRET
# - TWILIO_ACCOUNT_SID
# - TWILIO_AUTH_TOKEN
# - TWILIO_PHONE_NUMBER
```

## 🔍 Function Status

```bash
# List all deployed functions
supabase functions list

# Get specific function details
supabase functions get ai-chatbot
supabase functions get send-email
supabase functions get stripe-process-payment
```

## 🛠️ Troubleshooting

### If function returns 500:
```bash
supabase functions logs function-name --limit 100
```

### If secrets not accessible:
1. Check Supabase Dashboard > Settings > Edge Functions
2. Verify secret names match exactly
3. Redeploy function after adding secret

### If CORS errors:
- Verify corsHeaders in function code
- Check OPTIONS method handling

## 📈 Health Check

```bash
# Test all critical endpoints
./test-edge-functions.sh

# Or test individually
./test-edge-functions.sh chatbot
./test-edge-functions.sh email
./test-edge-functions.sh payment
```

## 🎯 Production Checklist

- [ ] All functions deployed
- [ ] Secrets configured
- [ ] Critical functions tested
- [ ] Logs checked for errors
- [ ] CORS working
- [ ] Response times acceptable
- [ ] Webhooks receiving events
- [ ] OAuth flows working

---

**Project URL:** https://bmkqdwgcpjhmabadmilx.supabase.co
**Functions URL:** https://bmkqdwgcpjhmabadmilx.supabase.co/functions/v1/
