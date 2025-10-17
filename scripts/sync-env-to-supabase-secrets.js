#!/usr/bin/env node

/**
 * Automated Supabase Secrets Sync Script
 * Syncs environment variables from .env.example to Supabase project secrets
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function parseEnvFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const secrets = {};
  
  content.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#') && line.includes('=')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=').replace(/^["']|["']$/g, '');
      if (key && value) {
        secrets[key.trim()] = value.trim();
      }
    }
  });
  
  return secrets;
}

function checkSupabaseCLI() {
  try {
    execSync('supabase --version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function getSupabaseProjectId() {
  try {
    const config = fs.readFileSync('.env.example', 'utf-8');
    const match = config.match(/VITE_SUPABASE_URL=https:\/\/([^.]+)\.supabase\.co/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

async function syncSecretsToSupabase() {
  log('\n🔄 Starting Supabase Secrets Sync...', 'cyan');
  
  // Check Supabase CLI
  if (!checkSupabaseCLI()) {
    log('❌ Supabase CLI not found. Install: npm install -g supabase', 'red');
    process.exit(1);
  }
  
  const projectId = getSupabaseProjectId();
  if (!projectId) {
    log('❌ Could not find Supabase project ID in .env.example', 'red');
    process.exit(1);
  }
  
  log(`📦 Project ID: ${projectId}`, 'blue');
  
  const envPath = path.join(process.cwd(), '.env.example');
  if (!fs.existsSync(envPath)) {
    log('❌ .env.example not found', 'red');
    process.exit(1);
  }
  
  const secrets = parseEnvFile(envPath);
  log(`\n📋 Found ${Object.keys(secrets).length} environment variables`, 'blue');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const [key, value] of Object.entries(secrets)) {
    try {
      execSync(
        `supabase secrets set ${key}="${value}" --project-ref ${projectId}`,
        { stdio: 'pipe' }
      );
      log(`✅ ${key}`, 'green');
      successCount++;
    } catch (error) {
      log(`❌ ${key}: ${error.message}`, 'red');
      failCount++;
    }
  }
  
  log(`\n📊 Sync Complete:`, 'cyan');
  log(`   ✅ Success: ${successCount}`, 'green');
  log(`   ❌ Failed: ${failCount}`, 'red');
}

syncSecretsToSupabase().catch(console.error);
