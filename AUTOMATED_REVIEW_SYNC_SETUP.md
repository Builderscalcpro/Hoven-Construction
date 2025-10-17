# Automated Google Review Sync - Complete Setup Guide

## ✅ What's Been Implemented

### 1. **Automated Review Sync Edge Function**
- **Location**: `supabase/functions/automated-review-sync/index.ts`
- **Features**:
  - Runs hourly to sync Google Business Profile reviews
  - Automatically detects new reviews
  - Stores reviews in database
  - Generates AI responses for new reviews
  - Logs all sync activity
  - Sends notifications (email/SMS) for new reviews

### 2. **Database Tables**
Run this SQL in Supabase SQL Editor:
```sql
-- See supabase_review_sync_tables.sql for complete schema
```

**Tables Created**:
- `review_sync_config` - User sync settings
- `review_sync_logs` - Sync history and status
- `review_responses` - AI-generated responses

### 3. **Enhanced Dashboard Components**
- **ReviewSyncDashboard** - Main control panel with:
  - Real-time sync statistics (total, today, this week)
  - Tabbed interface for settings/AI/history
  - Manual sync trigger button
  - Sync frequency configuration
  - Email/SMS notifications
  
- **AutoResponseSettings** - AI response configuration:
  - Enable/disable auto-responses
  - Test AI response generator
  - Star rating-based responses
  - Business name customization

## 🚀 Deployment Steps

### Step 1: Deploy Edge Function
```bash
cd supabase
supabase functions deploy automated-review-sync --no-verify-jwt
```

### Step 2: Set Up Hourly Cron Job
**Option A: Supabase Cron (Recommended)**
```bash
supabase functions schedule automated-review-sync --cron "0 * * * *"
```

**Option B: External Cron Service** (cron-job.org, EasyCron)
- URL: `https://[your-project].supabase.co/functions/v1/automated-review-sync`
- Method: POST
- Schedule: `0 * * * *` (every hour)
- Headers: `Authorization: Bearer [anon-key]`

### Step 3: Run Database Migration
```bash
psql -h [your-db-host] -U postgres -d postgres -f supabase_review_sync_tables.sql
```

Or paste SQL directly in Supabase Dashboard → SQL Editor

### Step 4: Configure API Keys
Ensure these secrets are set in Supabase:
```bash
ANTHROPIC_API_KEY=sk-ant-...  # For AI responses
SENDGRID_API_KEY=SG...        # For email notifications
```

## 📊 How It Works

### Automatic Sync Flow
1. **Hourly Trigger** → Edge function runs
2. **Fetch Reviews** → Gets reviews from Google Business API
3. **Detect New** → Compares with database
4. **Store Reviews** → Saves new reviews
5. **Generate AI Response** → Creates personalized response
6. **Send Notifications** → Emails/SMS for new reviews
7. **Log Activity** → Records sync status

### AI Response Generation
- Uses Claude 3.5 Sonnet for natural responses
- Customized by star rating (1-5 stars)
- Includes business name
- Empathetic and professional tone
- Addresses specific review points

## 🎯 Using the Dashboard

### Access Dashboard
Navigate to: `/admin-dashboard` → "Review Sync" tab

### Configure Sync Settings
1. **Enable Auto-Sync** - Toggle on
2. **Set Frequency** - Choose hourly (default)
3. **Add Notifications** - Email/phone for alerts
4. **Save Settings**

### Configure AI Auto-Responses
1. Go to "AI Responses" tab
2. **Enable Auto-Response** - Toggle on
3. **Set Business Name** - For personalization
4. **Test Generator** - Try with sample reviews
5. **Save Configuration**

### Manual Sync
Click "Sync Now" button to trigger immediate sync

### View History
"Sync History" tab shows:
- Sync status (success/failed)
- Date and time
- Number of reviews synced
- Error messages (if any)

## 🔧 Troubleshooting

### Sync Not Running
1. Check edge function is deployed: `supabase functions list`
2. Verify cron job is scheduled
3. Check Supabase logs for errors

### No Reviews Syncing
1. Verify Google Business token is valid
2. Check `google_business_tokens` table has access_token
3. Ensure location_id is correct
4. Test Google Business API manually

### AI Responses Not Generating
1. Verify ANTHROPIC_API_KEY is set
2. Check Supabase secrets: `supabase secrets list`
3. Test generate-ai-review-response function

### Notifications Not Sending
1. Verify SENDGRID_API_KEY is configured
2. Check email/phone number in config
3. Test send-email edge function

## 📈 Monitoring

### Check Sync Status
```sql
SELECT * FROM review_sync_logs 
ORDER BY synced_at DESC 
LIMIT 10;
```

### View Auto-Responses
```sql
SELECT * FROM review_responses 
WHERE auto_generated = true 
ORDER BY created_at DESC;
```

### Sync Statistics
```sql
SELECT 
  COUNT(*) as total_syncs,
  SUM(reviews_synced) as total_reviews,
  AVG(reviews_synced) as avg_per_sync
FROM review_sync_logs 
WHERE status = 'success';
```

## 🎉 Success!

Your automated Google review sync is now:
- ✅ Running hourly
- ✅ Detecting new reviews automatically
- ✅ Generating AI responses
- ✅ Sending notifications
- ✅ Logging all activity
- ✅ Providing real-time dashboard

**Next Steps**:
1. Monitor first few syncs in dashboard
2. Adjust AI response tone if needed
3. Configure notification preferences
4. Review sync logs regularly
