# Edge Functions Health Check & Testing Guide

## 🏥 Quick Health Check

Run these commands to verify your edge functions are working:

### 1. AI Chatbot (Anthropic Claude)
```bash
curl -X POST https://bmkqdwgcpjhmabadmilx.supabase.co/functions/v1/ai-chatbot \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"message": "What services do you offer?"}'
```

**Expected Response:**
```json
{
  "message": "I can help you with construction services including..."
}
```

### 2. Send Email (SendGrid)
```bash
curl -X POST https://bmkqdwgcpjhmabadmilx.supabase.co/functions/v1/send-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "text": "This is a test email from the edge function"
  }'
```

**Expected Response:**
```json
{
  "success": true
}
```

### 3. Stripe Payment Intent
```bash
curl -X POST https://bmkqdwgcpjhmabadmilx.supabase.co/functions/v1/stripe-create-payment-intent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "amount": 5000,
    "currency": "usd",
    "description": "Test payment"
  }'
```

**Expected Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

### 4. AI Email Suggestions
```bash
curl -X POST https://bmkqdwgcpjhmabadmilx.supabase.co/functions/v1/ai-email-suggestions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "context": "Customer inquiry about kitchen remodel",
    "recipientName": "John Smith",
    "emailType": "follow-up"
  }'
```

**Expected Response:**
```json
{
  "suggestion": "Subject: Following Up on Your Kitchen Remodel Inquiry\n\nDear John Smith..."
}
```

### 5. Google Calendar Auth
```bash
curl -X POST https://bmkqdwgcpjhmabadmilx.supabase.co/functions/v1/google-calendar-auth \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "code": "GOOGLE_AUTH_CODE",
    "userId": "user-uuid"
  }'
```

### 6. AI Project Estimator
```bash
curl -X POST https://bmkqdwgcpjhmabadmilx.supabase.co/functions/v1/ai-project-estimator \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "projectType": "kitchen remodel",
    "squareFootage": 200,
    "materials": "high-end"
  }'
```

## 🔍 Monitoring & Logs

### View Function Logs
1. Go to Supabase Dashboard
2. Navigate to Edge Functions
3. Click on function name
4. View "Logs" tab

### Common Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Bad Request | Check request parameters |
| 401 | Unauthorized | Verify API keys configured |
| 408 | Timeout | Function took > 30s |
| 429 | Rate Limited | Wait and retry |
| 500 | Server Error | Check function logs |

## 📊 Performance Metrics

### Expected Response Times
- AI Functions: 2-5 seconds
- Email Functions: 1-3 seconds
- Payment Functions: 1-2 seconds
- Calendar Functions: 2-4 seconds

### Rate Limits
- Anthropic Claude: 50 requests/min
- SendGrid: 100 emails/min
- Stripe: 100 requests/sec
- Google APIs: Varies by endpoint

## 🛠️ Troubleshooting

### Function Not Responding
1. Check if function is deployed: `supabase functions list`
2. Verify API keys in Supabase secrets
3. Check function logs for errors
4. Test with curl command above

### API Key Errors
```bash
# Verify secrets are set
supabase secrets list

# Set missing secrets
supabase secrets set ANTHROPIC_API_KEY=your_key
supabase secrets set SENDGRID_API_KEY=your_key
supabase secrets set STRIPE_SECRET_KEY=your_key
```

### Timeout Issues
- Increase timeout in function code (max 30s)
- Optimize API calls
- Use async operations where possible
- Consider breaking into smaller functions

## ✅ Health Check Checklist

- [ ] AI Chatbot responding correctly
- [ ] Emails sending via SendGrid
- [ ] Stripe payments processing
- [ ] Google Calendar OAuth working
- [ ] AI suggestions generating
- [ ] All API keys configured
- [ ] No 500 errors in logs
- [ ] Response times < 5s
- [ ] CORS headers working
- [ ] Database connections stable

## 🚨 Alert Thresholds

Set up monitoring for:
- Error rate > 5%
- Response time > 10s
- Timeout rate > 2%
- API key failures
- Database connection errors

---

**Last Updated:** October 7, 2025  
**Status:** All functions operational ✅
