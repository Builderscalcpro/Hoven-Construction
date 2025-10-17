# ✅ SUPABASE REDIRECT URLs - CORRECTED

## Issues Found

1. **TYPO**: `hovenconstruction.com.com` (double .com)
2. **Missing**: Root domain URLs

## ✅ CORRECT URLs to Use

```
https://bmkqdwgcpjhmabadmilx.supabase.co/functions/v1/google-calendar-auth
http://localhost:5173
http://localhost:5173/calendar-callback
http://localhost:5173/google-calendar-callback
http://localhost:5173/google-business-callback
https://hovenconstruction.com
https://hovenconstruction.com/
https://hovenconstruction.com/calendar-callback
https://hovenconstruction.com/google-calendar-callback
https://hovenconstruction.com/google-business-callback
```

---

## 🔧 How to Fix in Supabase

### Step 1: Access URL Configuration
1. Go to: https://supabase.com/dashboard
2. Select your project: **bmkqdwgcpjhmabadmilx**
3. Click **Authentication** → **URL Configuration**

### Step 2: Remove Incorrect URLs
1. Look for any URLs with `.com.com` (double .com)
2. Click the **X** to delete them

### Step 3: Add Correct URLs
3. **ADD** these correct URLs:
   - ✅ `https://hovenconstruction.com`
   - ✅ `https://hovenconstruction.com/`
   - ✅ `https://hovenconstruction.com/calendar-callback`
   - ✅ `https://hovenconstruction.com/google-calendar-callback`
   - ✅ `https://hovenconstruction.com/google-business-callback`

### Step 4: Update Site URL
1. In the same **URL Configuration** section
2. Set **Site URL** to: `https://hovenconstruction.com`

### Step 5: Save Changes
1. Click **Save** button
2. Wait for confirmation message

---

## 🔍 Verification Checklist

- [ ] All URLs use `hovenconstruction.com` (with C)
- [ ] No double `.com.com` in any URL
- [ ] Root domain included: `https://hovenconstruction.com`
- [ ] Root with slash included: `https://hovenconstruction.com/`
- [ ] All callback routes included
- [ ] Localhost URLs kept for development
- [ ] Site URL updated
- [ ] Changes saved

---

**Status:** Ready to configure ✅
**Your Supabase Project:** bmkqdwgcpjhmabadmilx
