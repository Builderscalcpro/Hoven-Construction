# Email Drip Campaign System - Complete Setup Guide

## 🎯 Overview
Automated email sequences that nurture leads based on their score (high/medium/standard value), with full tracking, analytics, and SendGrid integration.

## ✅ What's Been Created

### Database Tables
1. **email_campaigns** - Campaign definitions by lead score type
2. **email_sequences** - Individual emails in each campaign
3. **scheduled_emails** - Queue of emails to be sent
4. **email_tracking** - Track opens, clicks, replies, bounces
5. **email_unsubscribes** - Unsubscribe list management

### Edge Functions
1. **schedule-drip-campaign** - Schedules email sequence for new leads
2. **send-scheduled-emails** - Cron job to send pending emails (run every 15 min)

### Frontend Components
1. **EmailCampaignBuilder** - Visual campaign builder with sequences
2. **EmailDripAnalytics** - Dashboard with charts and metrics
3. **EmailDripCampaigns** - Main page at `/email-drip-campaigns`

## 🚀 Quick Start

### Step 1: Create Email Templates
1. Go to `/email-automation` → Templates tab
2. Create templates for each sequence:
   - High-value lead immediate response
   - High-value 24hr follow-up
   - Medium-value next-day email
   - Medium-value 3-day follow-up
   - Standard 3-day email
   - Standard weekly nurture

### Step 2: Build Campaigns
1. Go to `/email-drip-campaigns`
2. Click Campaigns tab
3. Create campaign for each lead score type:
   - **High Value (70+)**: Immediate + 24hr
   - **Medium Value (50-69)**: Next-day + 3-day
   - **Standard (0-49)**: 3-day + weekly

### Step 3: Set Up Cron Job
Configure Supabase to run `send-scheduled-emails` every 15 minutes:
```sql
SELECT cron.schedule(
  'send-drip-emails',
  '*/15 * * * *',
  $$SELECT net.http_post(
    url:='https://YOUR_PROJECT.supabase.co/functions/v1/send-scheduled-emails',
    headers:='{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
  )$$
);
```

## 📊 How It Works

### Lead Capture Flow
1. User fills out chatbot lead form
2. Lead score calculated (0-100)
3. Lead assigned to campaign (high/medium/standard)
4. Email sequence automatically scheduled
5. Emails sent at specified intervals
6. Opens/clicks/replies tracked
7. Unsubscribes honored automatically

### Lead Scoring Algorithm
- **Budget Range**: $50k+ (40pts), $25k-$50k (30pts), $10k-$25k (20pts), <$10k (10pts)
- **Timeline**: Immediate/1-3mo (30pts), 3-6mo (20pts), 6mo+ (10pts)
- **Project Type**: Kitchen/Addition/Whole House (30pts), Other (0pts)
- **Total Score**: High (70+), Medium (50-69), Standard (0-49)

## 📧 Email Sequences

### High-Value Leads (Score 70+)
- **Email 1**: Immediate (0 hours) - Personal thank you + project overview
- **Email 2**: 24 hours - Detailed quote + portfolio examples
- **Admin Alert**: Instant notification to follow up within 1 hour

### Medium-Value Leads (Score 50-69)
- **Email 1**: Next day (24 hours) - Introduction + services overview
- **Email 2**: 3 days (72 hours) - Case studies + testimonials

### Standard Leads (Score 0-49)
- **Email 1**: 3 days (72 hours) - Educational content + tips
- **Email 2**: 1 week (168 hours) - Newsletter + special offers

## 📈 Analytics & Tracking

### Metrics Available
- Total emails sent
- Open rate (%)
- Click rate (%)
- Reply rate (%)
- Campaign performance comparison
- Lead score distribution

### Event Tracking
- `sent` - Email delivered
- `opened` - Recipient opened email
- `clicked` - Recipient clicked link
- `replied` - Recipient replied
- `bounced` - Email bounced
- `unsubscribed` - Recipient unsubscribed

## 🔧 Customization

### Adding New Campaign
```typescript
// In EmailCampaignBuilder
1. Set campaign name
2. Choose lead score type
3. Add email sequences
4. Select template for each
5. Set delay hours
6. Save campaign
```

### Modifying Sequences
Edit existing campaigns to:
- Change email timing
- Swap templates
- Add/remove emails
- Activate/deactivate campaigns

## 🛡️ Unsubscribe Handling
- Automatic unsubscribe link in every email
- Unsubscribes stored in `email_unsubscribes` table
- Future emails automatically cancelled
- Respects user preferences

## 🎯 Best Practices

### Email Timing
- High-value: Fast response (immediate + 24hr)
- Medium-value: Balanced (next-day + 3-day)
- Standard: Patient nurture (3-day + weekly)

### Content Strategy
- Personalize with {{name}} variable
- Include clear CTAs
- Provide value in each email
- Build trust progressively

### Testing
1. Create test lead with different scores
2. Verify correct campaign triggered
3. Check email scheduling
4. Monitor delivery and tracking
5. Test unsubscribe flow

## 📱 Admin Notifications
High-value leads (70+) trigger instant admin alerts with:
- Lead score
- Contact details
- Project information
- Recommended action: Contact within 1 hour

## 🔗 Integration Points
- **Chatbot**: Automatic trigger on lead capture
- **SendGrid**: Email delivery and tracking
- **CRM**: Lead data synchronized
- **Analytics**: Performance metrics

## 🚨 Monitoring
Check `/email-drip-campaigns` → Analytics tab for:
- Campaign health
- Delivery issues
- Engagement trends
- Lead quality distribution

## 💡 Pro Tips
1. A/B test subject lines
2. Monitor reply rates closely
3. Adjust timing based on data
4. Keep high-value sequences short
5. Provide opt-out in every email
6. Track conversion rates by campaign

Your email drip system is now fully automated and ready to convert leads 24/7! 🚀
