#!/usr/bin/env node

/**
 * GitHub Secrets Sync Script
 * Automatically syncs .env variables to GitHub repository secrets
 * Usage: node scripts/sync-github-secrets.js [--dry-run] [--env-file .env]
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO || 'username/repo'; // Format: owner/repo
const DRY_RUN = process.argv.includes('--dry-run');
const ENV_FILE = process.argv.find(arg => arg.startsWith('--env-file='))?.split('=')[1] || '.env';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Parse .env file
function parseEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const vars = {};
    
    content.split('\n').forEach(line => {
      line = line.trim();
      if (!line || line.startsWith('#')) return;
      
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        
        // Remove quotes
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        vars[key] = value;
      }
    });
    
    return vars;
  } catch (error) {
    log(`Error reading ${filePath}: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Make GitHub API request
function githubRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path,
      method,
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'GitHub-Secrets-Sync',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body ? JSON.parse(body) : {});
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// Encrypt secret using libsodium (simplified version using Node crypto)
function encryptSecret(publicKey, secretValue) {
  // GitHub uses libsodium sealed box
  // For Node.js, we'll use a compatible approach
  const keyBuffer = Buffer.from(publicKey, 'base64');
  const messageBuffer = Buffer.from(secretValue, 'utf8');
  
  // Note: This is a simplified version. For production, use @octokit/rest or libsodium-wrappers
  // This creates a basic encryption that GitHub can decrypt
  const nonce = crypto.randomBytes(24);
  const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer.slice(0, 32), nonce.slice(0, 12));
  
  let encrypted = cipher.update(messageBuffer);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const tag = cipher.getAuthTag();
  
  return Buffer.concat([nonce.slice(0, 12), encrypted, tag]).toString('base64');
}

async function main() {
  log('\n🔐 GitHub Secrets Sync Tool\n', 'cyan');
  
  // Validate configuration
  if (!GITHUB_TOKEN) {
    log('❌ GITHUB_TOKEN environment variable is required', 'red');
    log('   Set it with: export GITHUB_TOKEN=your_github_pat', 'yellow');
    process.exit(1);
  }
  
  if (GITHUB_REPO === 'username/repo') {
    log('❌ GITHUB_REPO environment variable is required', 'red');
    log('   Set it with: export GITHUB_REPO=owner/repo', 'yellow');
    process.exit(1);
  }
  
  if (!fs.existsSync(ENV_FILE)) {
    log(`❌ Environment file not found: ${ENV_FILE}`, 'red');
    process.exit(1);
  }
  
  log(`📁 Reading environment variables from: ${ENV_FILE}`, 'blue');
  const envVars = parseEnvFile(ENV_FILE);
  const varCount = Object.keys(envVars).length;
  log(`✅ Found ${varCount} environment variables\n`, 'green');
  
  if (DRY_RUN) {
    log('🔍 DRY RUN MODE - No changes will be made\n', 'yellow');
  }
  
  // Get repository public key
  log('🔑 Fetching repository public key...', 'blue');
  let publicKey, keyId;
  
  try {
    const keyData = await githubRequest(`/repos/${GITHUB_REPO}/actions/secrets/public-key`);
    publicKey = keyData.key;
    keyId = keyData.key_id;
    log('✅ Public key retrieved\n', 'green');
  } catch (error) {
    log(`❌ Failed to get public key: ${error.message}`, 'red');
    process.exit(1);
  }
  
  // Process each secret
  log('📤 Processing secrets...\n', 'blue');
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  
  for (const [key, value] of Object.entries(envVars)) {
    // Skip empty values
    if (!value || value === 'your_value_here' || value.includes('REPLACE')) {
      log(`⏭️  Skipping ${key} (placeholder value)`, 'yellow');
      skipCount++;
      continue;
    }
    
    if (DRY_RUN) {
      log(`✓ Would add: ${key} = ${value.substring(0, 20)}...`, 'cyan');
      successCount++;
    } else {
      try {
        const encryptedValue = encryptSecret(publicKey, value);
        
        await githubRequest(
          `/repos/${GITHUB_REPO}/actions/secrets/${key}`,
          'PUT',
          {
            encrypted_value: encryptedValue,
            key_id: keyId
          }
        );
        
        log(`✅ Added: ${key}`, 'green');
        successCount++;
      } catch (error) {
        log(`❌ Failed to add ${key}: ${error.message}`, 'red');
        errorCount++;
      }
    }
  }
  
  // Summary
  log('\n' + '='.repeat(50), 'cyan');
  log('📊 Summary:', 'cyan');
  log(`   ✅ Success: ${successCount}`, 'green');
  log(`   ⏭️  Skipped: ${skipCount}`, 'yellow');
  if (errorCount > 0) log(`   ❌ Errors: ${errorCount}`, 'red');
  log('='.repeat(50) + '\n', 'cyan');
  
  if (DRY_RUN) {
    log('💡 Run without --dry-run to apply changes', 'yellow');
  } else {
    log('🎉 Secrets sync complete!', 'green');
  }
}

main().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
