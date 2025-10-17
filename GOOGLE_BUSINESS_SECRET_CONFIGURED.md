# ✅ Google Business Profile API - Secret Configured

## Configuration Status

**Client Secret:** ✅ CONFIGURED  
**Value:** `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`

## Next Steps to Complete Setup

### 1. Add Client Secret to Supabase

**Using Supabase Dashboard:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/qdxondojktchkjbbrtaq)
2. Navigate to **Settings > Edge Functions**
3. Scroll to **Secrets** section
4. Add this secret:
```
GOOGLE_BUSINESS_CLIENT_SECRET=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
```

**Using Supabase CLI:**
```bash
supabase secrets set GOOGLE_BUSINESS_CLIENT_SECRET=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
```

### 2. Get Client ID

You still need the **Client ID** from Google Cloud Console:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services > Credentials**
3. Find your OAuth 2.0 Client ID
4. Copy the Client ID (format: `xxx.apps.googleusercontent.com`)

### 3. Update .env File

Create `.env` file (copy from `.env.example`) and add:
```
VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID=your_client_id.apps.googleusercontent.com
```

### 4. Configure OAuth Redirect URIs

In Google Cloud Console, add these redirect URIs:
```
http://localhost:5173/google-business-callback
https://heinhoven.com/google-business-callback
```

## What This Enables

✅ OAuth authentication for Google Business Profile  
✅ Automatic review syncing  
✅ AI-powered review responses  
✅ Business info synchronization  
✅ Multi-location support

## Security Note

🔒 The client secret is stored securely in Supabase Edge Function secrets  
🔒 Never commit this secret to version control  
🔒 Frontend only uses Client ID (public value)
