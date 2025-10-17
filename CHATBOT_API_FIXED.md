# AI Chatbot API Fixed ✅

## Issue Identified
The ChatbotTest component was sending the wrong payload format to the ai-chatbot edge function.

### ❌ Old (Incorrect) Payload:
```json
{
  "messages": [{ "role": "user", "content": "Hello" }],
  "context": "Test context"
}
```

### ✅ New (Correct) Payload:
```json
{
  "message": "Hello",
  "conversationHistory": [],
  "temperature": 0.7,
  "maxTokens": 1024
}
```

## What Was Fixed

### 1. ChatbotTest Component (`src/components/ChatbotTest.tsx`)
- Updated to send correct payload format matching the edge function API
- Now sends `message` (string) instead of `messages` (array)
- Includes proper optional parameters: `conversationHistory`, `temperature`, `maxTokens`

### 2. Standalone Test Page (`public/chatbot-test.html`)
- Created a simple HTML page that can be opened directly in any browser
- Tests the edge function with the correct payload format
- Shows success/error states clearly
- Can be used from any domain (tests CORS)

## Testing the Chatbot

### Option 1: In-App Test (Recommended)
1. Navigate to `/admin/chatbot-test` in your app
2. Enter a test message
3. Click "Test Chatbot Function"
4. View the response

### Option 2: Standalone HTML Test
1. Open `public/chatbot-test.html` in your browser
2. Or visit: `https://your-domain.com/chatbot-test.html`
3. Enter a message and click "Send Message"

### Option 3: Direct API Test (cURL)
```bash
curl -X POST https://qdxondojktchkjbbrtaq.supabase.co/functions/v1/ai-chatbot \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, can you help me?",
    "conversationHistory": [],
    "temperature": 0.7,
    "maxTokens": 1024
  }'
```

## Expected Response Format
```json
{
  "message": "AI response text here..."
}
```

## Common Errors & Solutions

### 401 Error: "Invalid API key"
- **Cause**: ANTHROPIC_API_KEY is not set or invalid
- **Fix**: Set the secret in Supabase Dashboard → Edge Functions → Secrets
- **Key format**: Should start with `sk-ant-api`

### 429 Error: "Rate limit exceeded"
- **Cause**: Too many requests to Anthropic API
- **Fix**: Wait a moment and try again

### CORS Error
- **Cause**: Origin not in ALLOWED_ORIGINS
- **Fix**: Add your domain to ALLOWED_ORIGINS secret (comma-separated)
- **Example**: `https://yourdomain.com,https://preview.yourdomain.com`

### 400 Error: "Message is required"
- **Cause**: Sending wrong payload format
- **Fix**: Use the correct format shown above

## Next Steps
1. Test using the in-app test page at `/admin/chatbot-test`
2. Verify ANTHROPIC_API_KEY is set correctly
3. If needed, update ALLOWED_ORIGINS to include your domain
4. The chatbot should now work correctly!
