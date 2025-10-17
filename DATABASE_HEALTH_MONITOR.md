# Database Health Monitoring Dashboard

## Overview
The Database Health Monitor provides real-time monitoring of your Supabase database, checking table existence, RLS policies, indexes, and connection status.

## Features
- ✅ Connection status monitoring
- ✅ Table existence verification
- ✅ RLS policy checks
- ✅ Index monitoring
- ✅ Row count tracking
- ✅ Schema cache refresh
- ✅ Visual status indicators
- ✅ Automatic issue detection

## Access the Dashboard
Navigate to: `/admin/database-health` (add route in App.tsx)

## Common Issues & Quick Fixes

### 1. Table Does Not Exist - user_profiles

```sql
-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'customer',
  phone TEXT,
  address TEXT,
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

-- Create indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);

-- Auto-create profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant permissions
GRANT ALL ON public.user_profiles TO postgres;
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;
GRANT SELECT ON public.user_profiles TO anon;
```

### 2. RLS Not Enabled

```sql
-- Enable RLS on a table
ALTER TABLE public.your_table_name ENABLE ROW LEVEL SECURITY;

-- Add basic policies
CREATE POLICY "Enable read for authenticated users"
  ON public.your_table_name FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON public.your_table_name FOR INSERT
  TO authenticated
  WITH CHECK (true);
```

### 3. Missing Indexes

```sql
-- Add common indexes
CREATE INDEX IF NOT EXISTS idx_table_user_id ON public.your_table(user_id);
CREATE INDEX IF NOT EXISTS idx_table_created_at ON public.your_table(created_at);
CREATE INDEX IF NOT EXISTS idx_table_status ON public.your_table(status);
```

### 4. Schema Cache Issues

```sql
-- Refresh schema cache (or use dashboard button)
NOTIFY pgrst, 'reload schema';
```

### 5. Missing Foreign Keys

```sql
-- Add foreign key to auth.users
ALTER TABLE public.your_table
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;
```

## Monitoring Functions

The dashboard uses these helper functions:

### check_rls_enabled
Checks if RLS is enabled on a table.

### get_table_policies
Returns all RLS policies for a table.

### get_table_indexes
Returns all indexes on a table.

### refresh_schema_cache
Forces PostgREST to reload the schema cache.

## Status Indicators

- 🟢 **Healthy**: All checks passed
- 🟡 **Warning**: Minor issues detected (missing indexes, few policies)
- 🔴 **Critical**: Major issues (table missing, RLS disabled)

## Troubleshooting

### "Could not find table in schema cache"
1. Click "Refresh Schema Cache" button
2. Wait 5-10 seconds
3. Reload the page
4. If issue persists, check table exists in SQL editor

### "RLS not enabled"
1. Run the RLS enable script above
2. Add appropriate policies
3. Refresh schema cache

### "No policies found"
1. Add at least SELECT and INSERT policies
2. Consider user-specific policies using auth.uid()
3. Refresh schema cache

## Best Practices

1. **Always enable RLS** on tables with user data
2. **Create indexes** on frequently queried columns
3. **Use foreign keys** to maintain referential integrity
4. **Grant minimal permissions** to roles
5. **Refresh schema cache** after schema changes
6. **Monitor regularly** for issues

## Integration

Add to your admin routes:

```typescript
import DatabaseHealthDashboard from '@/components/DatabaseHealthDashboard';

// In App.tsx
<Route path="/admin/database-health" element={<DatabaseHealthDashboard />} />
```

## Automated Monitoring

Consider setting up:
- Daily health checks
- Email alerts for critical issues
- Automated schema cache refresh
- Performance monitoring
