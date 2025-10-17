# ⚠️ SUPABASE API KEY FIX REQUIRED

## The Problem
The key you provided (`sb_publishable_...`) is **NOT a Supabase key**. This appears to be a different service's key (possibly Stripe or another platform).

## What a Supabase Anon Key Looks Like
A valid Supabase anon key is a **JWT token** that looks like this:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJta3Fkd2djcGpobWFiYWRtaWx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODg1NzY0MDAsImV4cCI6MjAwNDE1MjQwMH0.SIGNATURE_HERE
```

It's a **very long string** (200+ characters) that starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`

## How to Get Your Correct Supabase Key

### Step 1: Go to Your Supabase Dashboard
Visit: https://supabase.com/dashboard/project/bmkqdwgcpjhmabadmilx/settings/api

### Step 2: Find the Anon/Public Key
Look for the section labeled **"Project API keys"**
- Find the key labeled **"anon" or "public"**
- It will be a very long string starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`

### Step 3: Create a .env File
In your project root, create a file named `.env` (not .env.example) with:

```env
VITE_SUPABASE_URL=https://bmkqdwgcpjhmabadmilx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_ACTUAL_KEY_HERE
```

### Step 4: Restart Your Dev Server
After creating the .env file:
```bash
# Stop your current dev server (Ctrl+C)
# Then restart it
npm run dev
```

## Quick Checklist
- [ ] Logged into Supabase dashboard
- [ ] Navigated to Settings → API for project bmkqdwgcpjhmabadmilx
- [ ] Copied the **anon/public** key (the long JWT token)
- [ ] Created `.env` file in project root
- [ ] Pasted the correct key into VITE_SUPABASE_ANON_KEY
- [ ] Restarted dev server

## Still Having Issues?
Make sure:
1. You're copying the key from the **correct project** (bmkqdwgcpjhmabadmilx)
2. You're copying the **entire key** (it's very long)
3. There are **no spaces** before or after the key in the .env file
4. The .env file is in the **root directory** of your project
