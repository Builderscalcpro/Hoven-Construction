#!/bin/bash

# Supabase Edge Functions Deployment Script with Secret Validation
# Ensures all secrets are synced before deploying edge functions

set -e

echo "🚀 Supabase Edge Functions Deployment"
echo "======================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI not found${NC}"
    echo "Install: npm install -g supabase"
    exit 1
fi

echo -e "${GREEN}✅ Supabase CLI found${NC}"

# Validate secrets before deployment
echo ""
echo "🔍 Validating secrets..."
if npm run validate-supabase-secrets; then
    echo -e "${GREEN}✅ All secrets validated${NC}"
else
    echo -e "${YELLOW}⚠️  Some secrets are missing${NC}"
    read -p "Sync secrets now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm run sync-supabase-secrets
    else
        echo -e "${RED}❌ Deployment cancelled${NC}"
        exit 1
    fi
fi

# Deploy all edge functions
echo ""
echo "📦 Deploying edge functions..."

FUNCTIONS=(
    "ai-chatbot"
    "ai-email-suggestions"
    "ai-project-estimator"
    "google-calendar-auth"
    "google-business-auth"
    "stripe-process-payment"
    "send-email"
    "sync-google-reviews"
)

for func in "${FUNCTIONS[@]}"; do
    echo ""
    echo -e "${YELLOW}Deploying $func...${NC}"
    if supabase functions deploy "$func"; then
        echo -e "${GREEN}✅ $func deployed${NC}"
    else
        echo -e "${RED}❌ Failed to deploy $func${NC}"
    fi
done

echo ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"
