# Admin Setup Troubleshooting Guide

## Issue: Cannot Open Admin Setup

### Quick Fix Steps

#### 1. Access the Admin Setup Page
Navigate to: **`/setup-admin`** (not `/admin-setup`)

The correct URL is:
```
https://your-domain.com/setup-admin
```

#### 2. Check if You're Logged In
- You MUST be logged in first
- Go to `/auth` to sign in or create an account
- Then navigate back to `/setup-admin`

#### 3. Check Database Table
Run this SQL in Supabase SQL Editor to verify `user_profiles` table exists:

```sql
SELECT * FROM user_profiles LIMIT 5;
```

If table doesn't exist, run the complete schema:
```sql
-- See supabase_complete_schema.sql file
```

#### 4. Manual Admin Setup (SQL Method)
If the UI isn't working, grant admin access directly via SQL:

```sql
-- First, find your user ID
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Then grant admin role
INSERT INTO user_profiles (id, email, full_name, role)
VALUES (
  'your-user-id-here',
  'your-email@example.com',
  'Your Name',
  'admin'
)
ON CONFLICT (id) 
DO UPDATE SET role = 'admin';
```

#### 5. Check Browser Console
Open browser console (F12) and look for errors:
- Red error messages
- Failed network requests
- Authentication issues

### Common Issues

**Issue**: "Page not found"
- **Fix**: Use `/setup-admin` not `/admin-setup`

**Issue**: "You must be logged in"
- **Fix**: Sign in at `/auth` first

**Issue**: "An administrator already exists"
- **Fix**: Contact existing admin or use SQL to grant yourself admin role

**Issue**: Database errors
- **Fix**: Run `supabase_complete_schema.sql` to create all tables

### Verification

After setup, verify admin access:
1. Navigate to `/admin`
2. You should see the Admin Dashboard
3. If redirected to login, your role wasn't set correctly

### Alternative Access Methods

1. **Direct SQL** (most reliable):
   ```sql
   UPDATE user_profiles 
   SET role = 'admin' 
   WHERE id = (SELECT id FROM auth.users WHERE email = 'your@email.com');
   ```

2. **Supabase Dashboard**:
   - Go to Table Editor
   - Open `user_profiles` table
   - Find your user row
   - Change `role` column to `admin`

3. **API Call** (for developers):
   ```javascript
   const { data, error } = await supabase
     .from('user_profiles')
     .update({ role: 'admin' })
     .eq('id', userId);
   ```

### Still Having Issues?

Check these files for configuration:
- `src/pages/AdminSetup.tsx` - Setup page logic
- `src/components/AdminRoute.tsx` - Admin route protection
- `src/App.tsx` - Route definitions (line 117)
- `supabase_complete_schema.sql` - Database schema
