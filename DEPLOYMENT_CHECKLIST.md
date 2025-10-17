# Edge Functions Deployment Checklist

## ✅ Completed Steps

### 1. ai-chatbot Function
- [x] Created `supabase/functions/ai-chatbot/index.ts`
- [x] Integrated real Anthropic Claude API
- [x] Added 30-second timeout protection
- [x] Implemented comprehensive error handling
- [x] Added CORS headers
- [x] Ready for deployment

### 2. Shared Resources
- [x] Created `supabase/functions/_shared/cors.ts`
- [x] Documented all edge functions in EDGE_FUNCTIONS_INVENTORY.md

## 🔄 Deployment Process

### Step 1: Install Supabase CLI
```bash
npm install -g supabase
```

### Step 2: Login to Supabase
```bash
supabase login
```

### Step 3: Link Your Project
```bash
supabase link --project-ref qdxondojktchkjbbrtaq
```

### Step 4: Deploy ai-chatbot Function
```bash
cd /path/to/your/project
supabase functions deploy ai-chatbot
```

### Step 5: Set API Key Secret
```bash
supabase secrets set ANTHROPIC_API_KEY=your-actual-api-key-here
```

### Step 6: Verify Deployment
```bash
# List deployed functions
supabase functions list

# Check function logs
supabase functions logs ai-chatbot --tail
```

### Step 7: Test the Function
```bash
# Test from command line
supabase functions invoke ai-chatbot --body '{"message":"Hello, how are you?"}'
```

## 📋 Required Secrets

### Currently Configured in Supabase Dashboard
- ✅ ANTHROPIC_API_KEY (for AI chatbot)
- ✅ SENDGRID_API_KEY (for emails)
- ✅ GOOGLE_CLIENT_SECRET (for Google OAuth)
- ✅ MICROSOFT_CLIENT_SECRET (for Microsoft OAuth)

### Verify Secrets
```bash
supabase secrets list
```

## 🧪 Testing After Deployment

### Test 1: Basic Chatbot Response
```typescript
const { data, error } = await supabase.functions.invoke('ai-chatbot', {
  body: { message: 'Hello!' }
})
console.log(data) // Should return: { message: "AI response..." }
```

### Test 2: Error Handling
```typescript
const { data, error } = await supabase.functions.invoke('ai-chatbot', {
  body: {} // Missing message
})
console.log(error) // Should return 400 error
```

### Test 3: Timeout Protection
```typescript
// Function should timeout after 30 seconds
// and return 408 status code
```

## 📊 Monitoring

### Check Function Logs
1. Go to Supabase Dashboard
2. Navigate to Edge Functions → ai-chatbot
3. View Logs tab
4. Look for:
   - Request count
   - Error rate
   - Response times
   - API errors

### Common Issues

#### Issue: "API key not configured"
**Solution**: Run `supabase secrets set ANTHROPIC_API_KEY=sk-ant-api...`

#### Issue: "401 Unauthorized"
**Solution**: Verify API key is valid and not expired

#### Issue: "429 Rate Limit"
**Solution**: Check Anthropic usage limits and upgrade plan if needed

#### Issue: "408 Timeout"
**Solution**: This is expected for very long requests (>30s)

## 🚀 Next Functions to Deploy

1. **send-email** - High priority for notifications
2. **google-calendar-auth** - High priority for calendar features
3. **process-payment** - High priority for payments
4. **ai-email-suggestions** - Medium priority
5. **ai-project-estimator** - Medium priority

## 📝 Notes

- Edge functions run on Deno runtime
- Each function has a 30-second execution limit
- Functions can access Supabase database directly
- CORS is configured for all origins (*)
- All secrets are encrypted and secure

## ✅ Deployment Verification

After deploying, verify:
- [ ] Function appears in Supabase Dashboard
- [ ] Function logs show successful invocations
- [ ] Frontend can successfully call the function
- [ ] Error handling works correctly
- [ ] Timeout protection works (30s limit)
- [ ] API key is properly configured
- [ ] CORS headers allow frontend access

## 📞 Support

- Supabase Docs: https://supabase.com/docs/guides/functions
- Anthropic Docs: https://docs.anthropic.com
- Project Issues: Check EDGE_FUNCTIONS_INVENTORY.md
