#!/bin/bash

# Automated Secrets Sync Script
# Syncs environment variables to both GitHub and Supabase

set -e

echo "🔄 Starting Automated Secrets Sync..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if .env.example exists
if [ ! -f .env.example ]; then
    echo -e "${RED}❌ .env.example not found${NC}"
    exit 1
fi

# Sync to GitHub Secrets
echo -e "${YELLOW}📤 Syncing to GitHub Secrets...${NC}"
if npm run sync-github-secrets; then
    echo -e "${GREEN}✅ GitHub secrets synced${NC}"
else
    echo -e "${RED}❌ GitHub sync failed${NC}"
fi

# Sync to Supabase Secrets
echo -e "${YELLOW}📤 Syncing to Supabase Secrets...${NC}"
if npm run sync-supabase-secrets; then
    echo -e "${GREEN}✅ Supabase secrets synced${NC}"
else
    echo -e "${RED}❌ Supabase sync failed${NC}"
fi

# Validate all secrets
echo -e "${YELLOW}🔍 Validating secrets...${NC}"
npm run validate-github-secrets
npm run validate-supabase-secrets

echo -e "${GREEN}✅ Automated sync complete${NC}"
