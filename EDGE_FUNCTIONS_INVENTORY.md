# Edge Functions Inventory & Deployment Status

## Currently Deployed Edge Functions

### ✅ Created in Codebase
1. **ai-chatbot** - `supabase/functions/ai-chatbot/index.ts`
   - Status: ✅ Created with real Anthropic Claude API
   - Purpose: AI chatbot responses using Claude 3.5 Sonnet
   - Deployment: Ready to deploy

2. **_shared/cors** - `supabase/functions/_shared/cors.ts`
   - Status: ✅ Created
   - Purpose: Shared CORS headers for all functions
   - Deployment: Supporting file

## Edge Functions Referenced in Code (Need Creation)

### AI & ML Functions
- `ai-document-classifier` - Classifies uploaded documents
- `ai-email-suggestions` - Generates email response suggestions
- `ai-predictive-analytics` - Project analytics and predictions
- `ai-project-estimator` - Estimates project costs and timelines
- `ai-smart-scheduling` - Intelligent meeting scheduling
- `generate-ai-review-response` - Generates responses to reviews
- `train-ai-chatbot` - Trains chatbot with knowledge base

### Calendar Functions
- `google-calendar-auth` - Google OAuth authentication
- `google-calendar-availability` - Fetch available time slots
- `google-calendar-create-event` - Create calendar events
- `google-calendar-list` - List user's calendars
- `google-calendar-subscribe-webhook` - Subscribe to calendar changes
- `sync-google-calendar` - Sync calendar events
- `outlook-calendar-list` - List Outlook calendars
- `outlook-calendar-events` - Manage Outlook events
- `apple-calendar-sync` - Sync Apple Calendar via CalDAV
- `scheduled-calendar-sync` - Auto-sync all calendars
- `renew-calendar-webhooks` - Renew webhook subscriptions
- `refresh-oauth-tokens` - Refresh expired OAuth tokens

### Google Business Functions
- `google-business-locations` - Fetch business locations
- `sync-business-info` - Sync business information
- `sync-google-reviews` - Sync Google reviews

### Communication Functions
- `send-email` - Send emails via SendGrid
- `send-notification` - Send notifications to users
- `send-consultation-reminder` - Send consultation reminders

### Payment Functions
- `process-payment` - Process Stripe payments
- `stripe-create-payment-plan` - Create payment plans
- `stripe-process-payment` - Process Stripe transactions

### Utility Functions
- `generate-invoice-pdf` - Generate PDF invoices
- `submit-sitemap-google` - Submit sitemap to Google
- `submit-sitemap-bing` - Submit sitemap to Bing
- `initiate-background-check` - Start background checks

## Deployment Instructions

### Prerequisites
1. Supabase CLI installed: `npm install -g supabase`
2. Logged in: `supabase login`
3. Project linked: `supabase link --project-ref YOUR_PROJECT_REF`

### Deploy Single Function
```bash
supabase functions deploy ai-chatbot
```

### Deploy All Functions
```bash
supabase functions deploy
```

### Set Required Secrets
```bash
# Anthropic API Key (for AI functions)
supabase secrets set ANTHROPIC_API_KEY=sk-ant-api...

# SendGrid API Key (for email functions)
supabase secrets set SENDGRID_API_KEY=SG...

# Google OAuth Credentials
supabase secrets set GOOGLE_CLIENT_ID=...
supabase secrets set GOOGLE_CLIENT_SECRET=...

# Microsoft OAuth Credentials
supabase secrets set MICROSOFT_CLIENT_ID=...
supabase secrets set MICROSOFT_CLIENT_SECRET=...

# Stripe Keys
supabase secrets set STRIPE_SECRET_KEY=sk_...
supabase secrets set STRIPE_PUBLISHABLE_KEY=pk_...
```

### Verify Deployment
```bash
# List all deployed functions
supabase functions list

# Check function logs
supabase functions logs ai-chatbot
```

## Testing Edge Functions

### Test from Dashboard
1. Go to Supabase Dashboard
2. Navigate to Edge Functions
3. Select function
4. Use "Invoke Function" with test payload

### Test from Code
```typescript
const { data, error } = await supabase.functions.invoke('ai-chatbot', {
  body: { message: 'Hello!' }
})
```

## Next Steps

1. **Create Missing Functions**: Generate all referenced edge functions
2. **Deploy to Supabase**: Use CLI to deploy functions
3. **Configure Secrets**: Set all required API keys
4. **Test Each Function**: Verify functionality
5. **Monitor Logs**: Check for errors in production

## Function Priority

### High Priority (Core Functionality)
- ✅ ai-chatbot
- ⏳ send-email
- ⏳ google-calendar-auth
- ⏳ process-payment

### Medium Priority (Enhanced Features)
- ⏳ ai-email-suggestions
- ⏳ ai-project-estimator
- ⏳ sync-google-reviews
- ⏳ scheduled-calendar-sync

### Low Priority (Nice to Have)
- ⏳ ai-document-classifier
- ⏳ generate-invoice-pdf
- ⏳ submit-sitemap-google
