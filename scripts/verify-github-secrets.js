#!/usr/bin/env node

/**
 * GitHub Secrets Verification Script
 * Checks which secrets are configured in GitHub repository
 * Usage: node scripts/verify-github-secrets.js
 */

const https = require('https');
const fs = require('fs');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO || 'username/repo';

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

function githubRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path,
      method: 'GET',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'GitHub-Secrets-Verify',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return [];
  
  const content = fs.readFileSync(filePath, 'utf8');
  const keys = [];
  
  content.split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    
    const match = line.match(/^([^=]+)=/);
    if (match) keys.push(match[1].trim());
  });
  
  return keys;
}

async function main() {
  log('\n🔍 GitHub Secrets Verification\n', 'cyan');
  
  if (!GITHUB_TOKEN) {
    log('❌ GITHUB_TOKEN environment variable is required', 'red');
    process.exit(1);
  }
  
  if (GITHUB_REPO === 'username/repo') {
    log('❌ GITHUB_REPO environment variable is required', 'red');
    process.exit(1);
  }
  
  log(`📦 Repository: ${GITHUB_REPO}`, 'blue');
  log(`🔑 Fetching secrets...\n`, 'blue');
  
  try {
    const data = await githubRequest(`/repos/${GITHUB_REPO}/actions/secrets`);
    const githubSecrets = data.secrets.map(s => s.name);
    
    log(`✅ Found ${githubSecrets.length} secrets in GitHub\n`, 'green');
    
    // Compare with .env
    const envKeys = parseEnvFile('.env');
    
    if (envKeys.length > 0) {
      log('📊 Comparison with .env file:\n', 'cyan');
      
      const missing = envKeys.filter(k => !githubSecrets.includes(k));
      const extra = githubSecrets.filter(k => !envKeys.includes(k));
      const synced = envKeys.filter(k => githubSecrets.includes(k));
      
      log(`✅ Synced: ${synced.length}`, 'green');
      if (synced.length > 0) {
        synced.forEach(k => log(`   • ${k}`, 'green'));
      }
      
      if (missing.length > 0) {
        log(`\n⚠️  Missing in GitHub: ${missing.length}`, 'yellow');
        missing.forEach(k => log(`   • ${k}`, 'yellow'));
      }
      
      if (extra.length > 0) {
        log(`\n📌 Extra in GitHub: ${extra.length}`, 'blue');
        extra.forEach(k => log(`   • ${k}`, 'blue'));
      }
    } else {
      log('GitHub Secrets:', 'cyan');
      githubSecrets.forEach(name => log(`   • ${name}`, 'blue'));
    }
    
    log('\n' + '='.repeat(50), 'cyan');
    log(`🔗 View secrets: https://github.com/${GITHUB_REPO}/settings/secrets/actions`, 'blue');
    log('='.repeat(50) + '\n', 'cyan');
    
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();
