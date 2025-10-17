#!/usr/bin/env node

/**
 * Sync Environment Variables to GitHub Secrets
 * 
 * This script reads .env.example and syncs all variables to GitHub Secrets
 * for CI/CD deployment with validation.
 * 
 * Usage: node scripts/sync-env-to-github-secrets.js
 * 
 * Requirements:
 * - GITHUB_TOKEN environment variable with repo scope
 * - GITHUB_REPOSITORY in format "owner/repo"
 */

const fs = require('fs');
const https = require('https');
const { execSync } = require('child_process');

// Required secrets that must be present
const REQUIRED_SECRETS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_STRIPE_PUBLISHABLE_KEY',
  'VITE_GOOGLE_CLIENT_ID'
];

// Parse .env.example file
function parseEnvFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const vars = {};
  
  content.split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (match) {
      const [, key, value] = match;
      vars[key] = value;
    }
  });
  
  return vars;
}

// Validate required secrets
function validateSecrets(vars) {
  const missing = [];
  const placeholder = [];
  
  REQUIRED_SECRETS.forEach(key => {
    if (!vars[key]) {
      missing.push(key);
    } else if (vars[key].includes('your_') || vars[key].includes('_here')) {
      placeholder.push(key);
    }
  });
  
  return { missing, placeholder };
}

// Get GitHub public key for secret encryption
function getPublicKey(owner, repo, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${owner}/${repo}/actions/secrets/public-key`,
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': 'env-sync-script',
        'Accept': 'application/vnd.github.v3+json'
      }
    };
    
    https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Failed to get public key: ${res.statusCode} ${data}`));
        }
      });
    }).on('error', reject).end();
  });
}

// Encrypt secret using sodium
function encryptSecret(secret, publicKey) {
  try {
    const sodium = require('libsodium-wrappers');
    return sodium.ready.then(() => {
      const binkey = sodium.from_base64(publicKey, sodium.base64_variants.ORIGINAL);
      const binsec = sodium.from_string(secret);
      const encBytes = sodium.crypto_box_seal(binsec, binkey);
      return sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL);
    });
  } catch (error) {
    console.warn('libsodium not available, using base64 encoding');
    return Promise.resolve(Buffer.from(secret).toString('base64'));
  }
}

// Set GitHub secret
async function setSecret(owner, repo, token, name, value, keyId, publicKey) {
  const encryptedValue = await encryptSecret(value, publicKey);
  
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      encrypted_value: encryptedValue,
      key_id: keyId
    });
    
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${owner}/${repo}/actions/secrets/${name}`,
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': 'env-sync-script',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };
    
    const req = https.request(options, res => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        if (res.statusCode === 201 || res.statusCode === 204) {
          resolve();
        } else {
          reject(new Error(`Failed to set ${name}: ${res.statusCode} ${responseData}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Main function
async function main() {
  console.log('🔄 GitHub Secrets Sync Tool\n');
  
  // Check for required environment variables
  const token = process.env.GITHUB_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY || process.env.GITHUB_REPO;
  
  if (!token) {
    console.error('❌ GITHUB_TOKEN environment variable is required');
    console.error('   Create a token at: https://github.com/settings/tokens');
    console.error('   Required scopes: repo\n');
    process.exit(1);
  }
  
  if (!repository) {
    console.error('❌ GITHUB_REPOSITORY environment variable is required');
    console.error('   Format: owner/repo (e.g., myuser/myrepo)\n');
    process.exit(1);
  }
  
  const [owner, repo] = repository.split('/');
  if (!owner || !repo) {
    console.error('❌ Invalid GITHUB_REPOSITORY format. Use: owner/repo\n');
    process.exit(1);
  }
  
  // Parse .env.example
  console.log('📖 Reading .env.example...');
  const envVars = parseEnvFile('.env.example');
  console.log(`   Found ${Object.keys(envVars).length} environment variables\n`);
  
  // Validate secrets
  console.log('✅ Validating required secrets...');
  const { missing, placeholder } = validateSecrets(envVars);
  
  if (missing.length > 0) {
    console.error('❌ Missing required secrets:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('');
    process.exit(1);
  }
  
  if (placeholder.length > 0) {
    console.warn('⚠️  Warning: Placeholder values detected:');
    placeholder.forEach(key => console.warn(`   - ${key}: ${envVars[key]}`));
    console.warn('   These should be replaced with actual values\n');
  }
  
  // Get GitHub public key
  console.log('🔑 Fetching GitHub public key...');
  const { key, key_id } = await getPublicKey(owner, repo, token);
  console.log('   Public key retrieved\n');
  
  // Sync secrets
  console.log('🚀 Syncing secrets to GitHub...');
  let successCount = 0;
  let failCount = 0;
  
  for (const [name, value] of Object.entries(envVars)) {
    try {
      await setSecret(owner, repo, token, name, value, key_id, key);
      console.log(`   ✓ ${name}`);
      successCount++;
    } catch (error) {
      console.error(`   ✗ ${name}: ${error.message}`);
      failCount++;
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   ✓ Synced: ${successCount}`);
  console.log(`   ✗ Failed: ${failCount}`);
  
  if (failCount > 0) {
    console.error('\n❌ Some secrets failed to sync');
    process.exit(1);
  }
  
  console.log('\n✅ All secrets synced successfully!');
}

main().catch(error => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
