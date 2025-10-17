# User Profiles Error Investigation

## Error Message
```
Could not find the table 'public.user_profiles' in the schema cache
```

## What This Error Means
This error occurs when:
1. The `user_profiles` table doesn't exist in your Supabase database
2. The table exists but PostgREST hasn't refreshed its schema cache
3. There are permission issues preventing access to the table

## Your Supabase Connection
- **URL**: https://qdxondojktchkjbbrtaq.supabase.co
- **Status**: Connected ✅

## Where user_profiles is Used
The table is accessed in multiple places:
- `src/contexts/AuthContext.tsx` - User authentication and profile fetching
- `src/pages/AdminSetup.tsx` - Admin role assignment
- `src/pages/AccountSettings.tsx` - User profile updates
- `src/components/TaskForm.tsx` - User selection
- `src/components/WebhookRenewalDashboard.tsx` - User email lookup

## How to Fix

### Step 1: Check if Table Exists
Go to your Supabase Dashboard → SQL Editor and run:
```sql
SELECT * FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'user_profiles';
```

### Step 2: If Table Doesn't Exist, Create It
Run this SQL in Supabase SQL Editor:
```sql
-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'client' CHECK (role IN ('admin', 'user', 'contractor', 'client')),
  phone TEXT,
  company TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'client'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### Step 3: Refresh Schema Cache
After creating the table, run:
```sql
NOTIFY pgrst, 'reload schema';
```

### Step 4: Verify Table Permissions
```sql
GRANT ALL ON public.user_profiles TO postgres;
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO anon;
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.user_profiles TO service_role;
```

### Step 5: Test the Table
```sql
-- Check if you can query it
SELECT * FROM public.user_profiles LIMIT 5;
```

## Next Steps After Fix
1. Sign up for a new account to test auto-profile creation
2. Check that your existing user has a profile created
3. Try accessing Account Settings page
4. Verify admin setup works if needed

## If Error Persists
1. Clear browser cache and cookies
2. Sign out and sign back in
3. Check browser console for detailed error messages
4. Verify your Supabase project is not paused
5. Check if there are any service outages on Supabase status page
