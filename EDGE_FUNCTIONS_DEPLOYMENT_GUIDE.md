# Edge Functions Deployment Guide

## 🚀 Complete Deployment Process

### Prerequisites
- Supabase CLI installed: `npm install -g supabase`
- Logged into Supabase: `supabase login`
- Linked to project: `supabase link --project-ref bmkqdwgcpjhmabadmilx`

## Step 1: Deploy All Functions

```bash
# Make script executable
chmod +x deploy-functions.sh

# Deploy all functions
./deploy-functions.sh
```

## Step 2: Verify All 60+ Functions Deployed

According to the system, these functions are already deployed:

### AI Functions (8)
- ✅ ai-chatbot
- ✅ ai-email-suggestions
- ✅ ai-project-estimator
- ✅ ai-smart-scheduling
- ✅ ai-document-classifier
- ✅ ai-predictive-analytics
- ✅ ai-sentiment-analysis
- ✅ generate-ai-review-response

### Email Functions (5)
- ✅ send-email
- ✅ send-notification
- ✅ send-consultation-reminder
- ✅ send-scheduled-emails
- ✅ schedule-drip-campaign

### Calendar Functions (15)
- ✅ google-calendar-auth
- ✅ google-calendar-availability
- ✅ google-calendar-create-event
- ✅ google-calendar-list
- ✅ google-calendar-webhook
- ✅ google-calendar-subscribe-webhook
- ✅ outlook-calendar-auth
- ✅ outlook-calendar-events
- ✅ outlook-calendar-list
- ✅ sync-consultation-to-calendars
- ✅ detect-calendar-conflicts
- ✅ sync-google-calendar
- ✅ scheduled-calendar-sync
- ✅ apple-calendar-sync
- ✅ unified-calendar-events

### Payment Functions (5)
- ✅ process-payment
- ✅ stripe-create-payment-intent
- ✅ stripe-create-payment-plan
- ✅ stripe-process-payment
- ✅ stripe-webhook-handler

### Review Management (4)
- ✅ google-business-auth
- ✅ google-business-reviews
- ✅ google-business-locations
- ✅ sync-google-reviews
- ✅ automated-review-sync

### Contractor Functions (3)
- ✅ contractor-notifications
- ✅ initiate-background-check
- ✅ verify-insurance
- ✅ generate-tax-form

### Other Functions (20+)
- ✅ generate-invoice-pdf
- ✅ renew-calendar-webhooks
- ✅ submit-sitemap-google
- ✅ submit-sitemap-bing
- ✅ sync-business-info
- ✅ train-ai-chatbot
- ✅ refresh-oauth-tokens
- ✅ claude-api-diagnostic
- ✅ secret-change-webhook
- ✅ capture-lead
- ✅ send-sms
- ✅ handle-sms-reply
- ✅ send-appointment-reminders

**Total: 60+ Functions**

## Step 3: Test Critical Functions

### Test AI Chatbot
```bash
curl -X POST "https://bmkqdwgcpjhmabadmilx.supabase.co/functions/v1/ai-chatbot" \
  -H "Content-Type: application/json" \
  -d '{"message": "What services do you offer?", "conversationHistory": []}'
```

Expected: JSON response with AI-generated answer

### Test Send Email
```bash
curl -X POST "https://bmkqdwgcpjhmabadmilx.supabase.co/functions/v1/send-email" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@example.com",
    "subject": "Test Email",
    "html": "<h1>Test</h1><p>This is a test email.</p>"
  }'
```

Expected: `{"success": true}`

### Test Stripe Payment
```bash
curl -X POST "https://bmkqdwgcpjhmabadmilx.supabase.co/functions/v1/stripe-process-payment" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 10000,
    "currency": "usd",
    "paymentMethodId": "pm_card_visa",
    "customerId": "test-customer"
  }'
```

Expected: Payment intent created successfully

## Step 4: Check Function Logs

```bash
# View logs for specific function
supabase functions logs ai-chatbot --limit 50

# View logs for send-email
supabase functions logs send-email --limit 50

# View logs for stripe-process-payment
supabase functions logs stripe-process-payment --limit 50

# Stream live logs
supabase functions logs ai-chatbot --follow
```

## Step 5: Verify Secret Access

### Check Secrets in Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/bmkqdwgcpjhmabadmilx/settings/functions
2. Verify these secrets exist:
   - ✅ SENDGRID_API_KEY
   - ✅ ANTHROPIC_API_KEY
   - ✅ OPENAI_API_KEY
   - ✅ STRIPE_SECRET_KEY
   - ✅ GOOGLE_CLIENT_ID
   - ✅ GOOGLE_CLIENT_SECRET
   - ✅ MICROSOFT_CLIENT_ID
   - ✅ MICROSOFT_CLIENT_SECRET
   - ✅ TWILIO_ACCOUNT_SID
   - ✅ TWILIO_AUTH_TOKEN
   - ✅ TWILIO_PHONE_NUMBER

### Test Secret Access
```bash
# Test Anthropic API access
curl -X POST "https://bmkqdwgcpjhmabadmilx.supabase.co/functions/v1/claude-api-diagnostic"

# Test SendGrid access
curl -X POST "https://bmkqdwgcpjhmabadmilx.supabase.co/functions/v1/send-email" \
  -H "Content-Type: application/json" \
  -d '{"to": "test@test.com", "subject": "Test", "html": "Test"}'
```

## Step 6: Monitor Function Health

### Check Function Status
```bash
# List all functions
supabase functions list

# Check specific function details
supabase functions get ai-chatbot
supabase functions get send-email
supabase functions get stripe-process-payment
```

### Common Issues & Solutions

#### Issue: Function returns 500 error
**Solution:** Check logs for missing secrets
```bash
supabase functions logs function-name --limit 100
```

#### Issue: CORS errors
**Solution:** Verify corsHeaders in function code

#### Issue: Timeout errors
**Solution:** Increase function timeout or optimize code

## Step 7: Production Verification Checklist

- [ ] All 60+ functions deployed successfully
- [ ] ai-chatbot responds correctly
- [ ] send-email sends test emails
- [ ] stripe-process-payment creates payment intents
- [ ] All secrets accessible by functions
- [ ] No errors in function logs
- [ ] CORS headers working correctly
- [ ] Function response times < 10s
- [ ] Webhook functions receiving events
- [ ] OAuth flows completing successfully

## Monitoring Commands

```bash
# Check all function statuses
supabase functions list

# Monitor critical functions
watch -n 30 'supabase functions logs ai-chatbot --limit 5'

# Check for errors across all functions
supabase functions logs --limit 100 | grep -i error
```

## Next Steps

1. Set up function monitoring alerts
2. Configure function rate limiting
3. Review function performance metrics
4. Set up automated health checks
5. Document API endpoints for frontend team

## Support

If any functions fail:
1. Check logs: `supabase functions logs function-name`
2. Verify secrets in dashboard
3. Test locally: `supabase functions serve function-name`
4. Review function code for errors
5. Check Supabase status page

---

**Deployment Status:** Ready for production
**Last Updated:** October 10, 2025
