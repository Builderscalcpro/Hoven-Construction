#!/bin/bash

echo "🚀 Deploying Automated Review Sync System..."

# Deploy edge function
echo "📦 Deploying automated-review-sync edge function..."
supabase functions deploy automated-review-sync --no-verify-jwt

# Schedule cron job (runs every hour)
echo "⏰ Setting up hourly cron schedule..."
supabase functions schedule automated-review-sync --cron "0 * * * *"

# Deploy related functions if not already deployed
echo "📦 Ensuring related functions are deployed..."
supabase functions deploy generate-ai-review-response --no-verify-jwt
supabase functions deploy sync-google-reviews --no-verify-jwt

echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Run database migration: supabase_review_sync_tables.sql"
echo "2. Configure API keys in Supabase Dashboard → Settings → Secrets"
echo "3. Access dashboard at /admin-dashboard → Review Sync"
echo "4. Enable auto-sync and configure settings"
echo ""
echo "📖 See AUTOMATED_REVIEW_SYNC_SETUP.md for detailed instructions"
