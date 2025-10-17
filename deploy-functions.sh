#!/bin/bash

# Deployment script for all Supabase Edge Functions
# Usage: ./deploy-functions.sh

echo "🚀 Starting deployment of all edge functions..."

# Array of all functions to deploy
functions=(
  "ai-chatbot"
  "ai-email-suggestions"
  "ai-project-estimator"
  "ai-smart-scheduling"
  "generate-ai-review-response"
  "send-email"
  "send-notification"
  "send-consultation-reminder"
  "contractor-notifications"
  "google-calendar-auth"
  "google-calendar-availability"
  "google-calendar-create-event"
  "outlook-calendar-auth"
  "outlook-calendar-events"
  "google-business-auth"
  "google-business-reviews"
  "google-business-locations"
  "sync-google-reviews"
  "process-payment"
  "stripe-create-payment-intent"
  "stripe-create-payment-plan"
  "stripe-process-payment"
  "generate-invoice-pdf"
)

# Deploy each function
for func in "${functions[@]}"
do
  echo "📦 Deploying $func..."
  supabase functions deploy $func --no-verify-jwt
  
  if [ $? -eq 0 ]; then
    echo "✅ $func deployed successfully"
  else
    echo "❌ Failed to deploy $func"
  fi
  
  echo ""
done

echo "🎉 Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Test each function using: ./test-edge-functions.sh"
echo "2. Verify environment variables in Supabase dashboard"
echo "3. Check function logs: supabase functions logs function-name"
echo "4. Review API reference: EDGE_FUNCTIONS_API_REFERENCE.md"
