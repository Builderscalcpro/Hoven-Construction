# 🔑 SUPABASE API KEY MISMATCH ERROR

## The Problem
Your Supabase anon key doesn't match your project URL!

- **Project URL**: `bmkqdwgcpjhmabadmilx.supabase.co`
- **Anon Key is for**: `qdxondojktchkjbbrtaq` ❌

## How to Fix

### Step 1: Get the Correct Key
1. Go to: https://supabase.com/dashboard/project/bmkqdwgcpjhmabadmilx/settings/api
2. Find the **"anon" / "public"** key (NOT the service_role key)
3. Copy the entire key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### Step 2: Create .env File
Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://bmkqdwgcpjhmabadmilx.supabase.co
VITE_SUPABASE_ANON_KEY=paste_your_correct_key_here
```

### Step 3: Restart Dev Server
```bash
npm run dev
```

## Alternative: Hardcode (Not Recommended for Production)
If you need a quick fix for testing, edit `src/lib/supabase.ts` line 10:
```typescript
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'paste_correct_key_here';
```

---

**Note**: The key you had was for a different Supabase project. You need the key that matches project ID `bmkqdwgcpjhmabadmilx`.
