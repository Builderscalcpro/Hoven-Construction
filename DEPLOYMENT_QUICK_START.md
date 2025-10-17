# Edge Functions - Quick Start Deployment

## 🚀 5-Minute Setup

### Step 1: Install Supabase CLI
```bash
npm install -g supabase
```

### Step 2: Login and Link Project
```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

### Step 3: Set Environment Variables
Go to Supabase Dashboard → Project Settings → Edge Functions → Secrets

Add these secrets:
```
ANTHROPIC_API_KEY=sk-ant-xxx
SENDGRID_API_KEY=SG.xxx
STRIPE_SECRET_KEY=sk_test_xxx
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx
GOOGLE_BUSINESS_PROFILE_CLIENT_ID=xxx
GOOGLE_BUSINESS_PROFILE_CLIENT_SECRET=xxx
MICROSOFT_CLIENT_ID=xxx
MICROSOFT_CLIENT_SECRET=xxx
```

### Step 4: Deploy All Functions
```bash
chmod +x deploy-functions.sh
./deploy-functions.sh
```

### Step 5: Test Functions
```bash
chmod +x test-edge-functions.sh
./test-edge-functions.sh
```

## ✅ What You Get

23 production-ready edge functions:
- 5 AI-powered functions (chatbot, email, estimator, scheduling, reviews)
- 4 Communication functions (email, notifications, reminders)
- 4 OAuth functions (Google Calendar, Outlook, Google Business)
- 4 Google Business functions (auth, reviews, locations, sync)
- 4 Payment functions (Stripe integration)
- 2 Utility functions (invoice generation)

## 🔍 Verify Deployment

```bash
# List all functions
supabase functions list

# Check logs
supabase functions logs ai-chatbot

# Test a function
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/ai-chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!"}'
```

## 📚 Documentation

- **API Reference:** `EDGE_FUNCTIONS_API_REFERENCE.md`
- **Testing Guide:** `EDGE_FUNCTIONS_TESTING_GUIDE.md`
- **Full Deployment:** `EDGE_FUNCTIONS_DEPLOYMENT.md`
- **Function List:** `COMPLETE_EDGE_FUNCTIONS_LIST.md`

## 🆘 Troubleshooting

**Function not deploying?**
- Check you're in the project root directory
- Verify Supabase CLI is installed: `supabase --version`
- Ensure you're logged in: `supabase login`

**Getting 500 errors?**
- Check environment variables are set
- View logs: `supabase functions logs function-name --tail`
- Test locally: `supabase functions serve function-name`

**CORS errors?**
- All functions include CORS headers
- Check browser console for specific error
- Verify function is deployed: `supabase functions list`
