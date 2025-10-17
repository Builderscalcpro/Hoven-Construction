# Calendar Management Setup Checklist

## Quick Start Guide

### Step 1: Database Setup ✓
- [ ] Open Supabase Dashboard
- [ ] Navigate to SQL Editor
- [ ] Copy contents of `supabase_calendar_migration.sql`
- [ ] Paste and execute the SQL
- [ ] Verify tables created successfully

### Step 2: Environment Configuration ✓
- [ ] Open `.env` file
- [ ] Add Google Client ID (already added)
- [ ] Add Google API Key
- [ ] Add Supabase URL
- [ ] Add Supabase Anon Key

### Step 3: Google Calendar API Setup
- [ ] Go to [Google Cloud Console](https://console.cloud.google.com)
- [ ] Create new project or select existing
- [ ] Enable Google Calendar API
- [ ] Create OAuth 2.0 credentials
- [ ] Add redirect URI: `https://yourdomain.com/google-calendar-callback`
- [ ] Copy Client ID to `.env`
- [ ] Copy API Key to `.env`

### Step 4: Test the Integration
- [ ] Start your development server
- [ ] Log in to your application
- [ ] Navigate to `/calendar`
- [ ] Click "Connect Calendar"
- [ ] Test Google Calendar connection
- [ ] Verify events sync properly

### Step 5: Configure Working Hours
- [ ] Go to Settings tab in Calendar Dashboard
- [ ] Set your working hours
- [ ] Configure buffer time
- [ ] Enable notifications
- [ ] Save preferences

### Step 6: Set Up Availability
- [ ] Go to Availability tab
- [ ] Add availability slots for each day
- [ ] Set start and end times
- [ ] Save changes

## Verification Steps

### Database Verification
```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%calendar%';

-- Verify RLS policies
SELECT tablename, policyname 
FROM pg_policies 
WHERE tablename LIKE '%calendar%';
```

### API Testing
```bash
# Test Google Calendar API
curl -X GET \
  'https://www.googleapis.com/calendar/v3/users/me/calendarList' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```

### Frontend Testing
1. Open browser console
2. Navigate to `/calendar`
3. Check for any errors
4. Test each tab functionality
5. Verify events display correctly

## Common Issues & Solutions

### Issue: Calendar not syncing
**Solution:** 
- Check OAuth credentials
- Verify redirect URI matches exactly
- Ensure API is enabled in Google Cloud Console

### Issue: Events not showing
**Solution:**
- Check date range in calendar view
- Verify connection is active and sync enabled
- Check browser console for errors

### Issue: RLS Policy Errors
**Solution:**
- Verify user is authenticated
- Check RLS policies are created correctly
- Ensure user_id matches auth.uid()

## Next Steps

After setup is complete:
1. Connect your Google Calendar
2. Set your availability preferences
3. Configure working hours
4. Test event syncing
5. Share calendar link with clients

## Support Resources

- [Google Calendar API Documentation](https://developers.google.com/calendar)
- [Supabase Documentation](https://supabase.com/docs)
- [Calendar Management Guide](./CALENDAR_MANAGEMENT_GUIDE.md)

## Production Deployment

Before deploying to production:
- [ ] Update redirect URIs in Google Cloud Console
- [ ] Set production environment variables
- [ ] Test OAuth flow in production
- [ ] Verify webhook endpoints
- [ ] Enable error monitoring
- [ ] Set up backup strategy

---

**Need Help?** Check the [Calendar Management Guide](./CALENDAR_MANAGEMENT_GUIDE.md) for detailed documentation.
