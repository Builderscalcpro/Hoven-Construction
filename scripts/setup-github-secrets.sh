#!/bin/bash

###############################################################################
# GitHub Secrets Setup Script
# 
# Interactive script to set up GitHub token and sync secrets
###############################################################################

set -e

echo "🔐 GitHub Secrets Setup"
echo "======================="
echo ""

# Check if .env.example exists
if [ ! -f ".env.example" ]; then
    echo "❌ Error: .env.example not found"
    exit 1
fi

# Prompt for GitHub token
echo "📝 GitHub Personal Access Token"
echo "   Create one at: https://github.com/settings/tokens"
echo "   Required scopes: repo"
echo ""
read -sp "Enter your GitHub token: " GITHUB_TOKEN
echo ""

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Token is required"
    exit 1
fi

export GITHUB_TOKEN

# Prompt for repository
echo ""
echo "📦 GitHub Repository"
echo "   Format: owner/repo (e.g., myuser/myrepo)"
echo ""
read -p "Enter your repository: " GITHUB_REPOSITORY

if [ -z "$GITHUB_REPOSITORY" ]; then
    echo "❌ Repository is required"
    exit 1
fi

export GITHUB_REPOSITORY

# Confirm
echo ""
echo "📋 Configuration:"
echo "   Repository: $GITHUB_REPOSITORY"
echo "   Token: ${GITHUB_TOKEN:0:10}..."
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled"
    exit 1
fi

# Run sync script
echo ""
echo "🚀 Syncing secrets..."
echo ""

node scripts/sync-env-to-github-secrets.js

echo ""
echo "✅ Setup complete!"
echo ""
echo "💡 To sync again later, run:"
echo "   GITHUB_TOKEN='your_token' GITHUB_REPOSITORY='owner/repo' node scripts/sync-env-to-github-secrets.js"
echo ""
