# AI Chatbot Fix Instructions

## Status
The AI chatbot is properly configured and ready to use. The ANTHROPIC_API_KEY needs to be verified in Supabase.

## Test the Chatbot

### Option 1: Test Page (Recommended)
1. Navigate to `/chatbot-test` in your browser (requires admin login)
2. Click "Test Chatbot Function" 
3. Check the response - you should see a success message with the AI's response

### Option 2: Live Chatbot
1. Go to your main website
2. Look for the chatbot icon in the bottom-right corner
3. Click to open and send a test message

## Troubleshooting

### If you get a 401 Error:
**Cause:** Invalid API key
**Solution:** 
1. Go to https://console.anthropic.com/
2. Create a new API key
3. Update in Supabase Dashboard → Edge Functions → Secrets → ANTHROPIC_API_KEY

### If you get a 429 Error:
**Cause:** Rate limit exceeded
**Solution:** Wait a few minutes and try again

### If you get a Network Error:
**Cause:** Edge function not deployed properly
**Solution:** 
```bash
supabase functions deploy ai-chatbot
```

### If the chatbot doesn't appear:
1. Check browser console for errors (F12 → Console tab)
2. Ensure you're logged in (chatbot may require authentication)
3. Clear browser cache and refresh

## Verify API Key Installation

1. Log into Supabase Dashboard
2. Go to Edge Functions → Secrets
3. Find ANTHROPIC_API_KEY
4. Verify it starts with "sk-ant-api"
5. If recently updated, wait 1-2 minutes for propagation

## Edge Function Details

- **Function Name:** ai-chatbot
- **Version:** 8 (latest)
- **Status:** ACTIVE
- **Endpoint:** https://bmkqdwgcpjhmabadmilx.supabase.co/functions/v1/ai-chatbot

## Quick Command Reference

```bash
# Deploy function (if needed)
supabase functions deploy ai-chatbot

# Test via curl
curl -X POST https://bmkqdwgcpjhmabadmilx.supabase.co/functions/v1/ai-chatbot \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}],"context":"Test"}'
```

## Support

If issues persist after following these steps:
1. Check the Supabase Dashboard logs
2. Verify the API key is valid at https://console.anthropic.com/
3. Ensure the edge function is deployed and active