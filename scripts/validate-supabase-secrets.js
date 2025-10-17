#!/usr/bin/env node

/**
 * Supabase Edge Function Secrets Validator
 * Ensures all edge functions have required secrets before deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Required secrets for edge functions
const EDGE_FUNCTION_SECRETS = {
  'ai-chatbot': ['ANTHROPIC_API_KEY', 'VITE_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'],
  'ai-email-suggestions': ['ANTHROPIC_API_KEY', 'SUPABASE_SERVICE_ROLE_KEY'],
  'ai-project-estimator': ['ANTHROPIC_API_KEY', 'SUPABASE_SERVICE_ROLE_KEY'],
  'google-calendar-auth': ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'],
  'google-business-auth': ['VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'],
  'stripe-process-payment': ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'],
  'send-email': ['SENDGRID_API_KEY'],
  'sync-google-reviews': ['VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET']
};

function getSupabaseSecrets(projectId) {
  try {
    const output = execSync(
      `supabase secrets list --project-ref ${projectId}`,
      { encoding: 'utf-8', stdio: 'pipe' }
    );
    return output.split('\n').map(line => line.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

function getProjectId() {
  try {
    const config = fs.readFileSync('.env.example', 'utf-8');
    const match = config.match(/VITE_SUPABASE_URL=https:\/\/([^.]+)\.supabase\.co/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

function validateSecrets() {
  log('\n🔍 Validating Supabase Edge Function Secrets...', 'cyan');
  
  const projectId = getProjectId();
  if (!projectId) {
    log('❌ Could not find Supabase project ID', 'red');
    process.exit(1);
  }
  
  const existingSecrets = getSupabaseSecrets(projectId);
  log(`\n📦 Found ${existingSecrets.length} secrets in Supabase project`, 'cyan');
  
  let allValid = true;
  
  for (const [func, requiredSecrets] of Object.entries(EDGE_FUNCTION_SECRETS)) {
    log(`\n🔧 ${func}:`, 'cyan');
    
    const missing = requiredSecrets.filter(secret => 
      !existingSecrets.some(s => s.includes(secret))
    );
    
    if (missing.length === 0) {
      log(`   ✅ All required secrets present`, 'green');
    } else {
      log(`   ❌ Missing secrets:`, 'red');
      missing.forEach(s => log(`      - ${s}`, 'yellow'));
      allValid = false;
    }
  }
  
  if (allValid) {
    log('\n✅ All edge functions have required secrets!', 'green');
    process.exit(0);
  } else {
    log('\n❌ Some edge functions are missing required secrets', 'red');
    log('Run: npm run sync-supabase-secrets', 'yellow');
    process.exit(1);
  }
}

validateSecrets();
