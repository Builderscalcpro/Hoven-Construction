#!/usr/bin/env node

/**
 * Validate GitHub Secrets
 * 
 * Checks if all required secrets are present in GitHub repository
 * before deployment.
 * 
 * Usage: node scripts/validate-secrets.js
 */

const https = require('https');

const REQUIRED_SECRETS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_STRIPE_PUBLISHABLE_KEY',
  'VITE_GOOGLE_CLIENT_ID',
  'VITE_GA_MEASUREMENT_ID'
];

function getSecrets(owner, repo, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${owner}/${repo}/actions/secrets`,
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': 'validate-secrets-script',
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
          reject(new Error(`Failed to get secrets: ${res.statusCode} ${data}`));
        }
      });
    }).on('error', reject).end();
  });
}

async function main() {
  console.log('🔍 Validating GitHub Secrets\n');
  
  const token = process.env.GITHUB_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY || process.env.GITHUB_REPO;
  
  if (!token || !repository) {
    console.error('❌ GITHUB_TOKEN and GITHUB_REPOSITORY required');
    process.exit(1);
  }
  
  const [owner, repo] = repository.split('/');
  
  console.log(`📦 Repository: ${owner}/${repo}\n`);
  
  const { secrets } = await getSecrets(owner, repo, token);
  const secretNames = secrets.map(s => s.name);
  
  console.log(`✅ Found ${secretNames.length} secrets\n`);
  
  const missing = REQUIRED_SECRETS.filter(name => !secretNames.includes(name));
  
  if (missing.length > 0) {
    console.error('❌ Missing required secrets:');
    missing.forEach(name => console.error(`   - ${name}`));
    console.error('\nRun: node scripts/sync-env-to-github-secrets.js\n');
    process.exit(1);
  }
  
  console.log('✅ All required secrets present!');
  REQUIRED_SECRETS.forEach(name => console.log(`   ✓ ${name}`));
  console.log('');
}

main().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
