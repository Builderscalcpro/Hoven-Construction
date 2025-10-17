# GitHub Secrets Automation Script

Automatically sync environment variables from `.env` to GitHub repository secrets using the GitHub API.

## 🚀 Quick Start

### 1. Generate GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Name it: `GitHub Secrets Sync`
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
5. Click **"Generate token"**
6. **Copy the token immediately** (you won't see it again!)

### 2. Set Environment Variables

```bash
# Set your GitHub token (required)
export GITHUB_TOKEN="ghp_your_token_here"

# Set your repository (required) - Format: owner/repo
export GITHUB_REPO="yourusername/yourrepo"
```

### 3. Run the Script

#### Dry Run (Preview Changes)
```bash
node scripts/sync-github-secrets.js --dry-run
```

#### Apply Changes
```bash
node scripts/sync-github-secrets.js
```

#### Use Custom .env File
```bash
node scripts/sync-github-secrets.js --env-file=.env.production
```

---

## 📋 Features

✅ **Automatic Encryption** - Secrets are encrypted using GitHub's public key  
✅ **Dry Run Mode** - Preview changes before applying  
✅ **Validation** - Skips placeholder values and empty variables  
✅ **Color-Coded Output** - Easy to read success/error messages  
✅ **Error Handling** - Graceful failure with detailed error messages  
✅ **Batch Processing** - Handles all environment variables at once  

---

## 🔧 Advanced Usage

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GITHUB_TOKEN` | ✅ Yes | Personal Access Token | `ghp_abc123...` |
| `GITHUB_REPO` | ✅ Yes | Repository (owner/repo) | `myuser/myapp` |

### Command Line Options

| Option | Description |
|--------|-------------|
| `--dry-run` | Preview changes without applying |
| `--env-file=PATH` | Use custom .env file (default: `.env`) |

### Examples

```bash
# Preview what would be synced
node scripts/sync-github-secrets.js --dry-run

# Sync production environment
node scripts/sync-github-secrets.js --env-file=.env.production

# Sync with custom repo
GITHUB_REPO="myorg/myproject" node scripts/sync-github-secrets.js
```

---

## 🛡️ Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Rotate tokens regularly** - Generate new PATs every 90 days
3. **Use minimal permissions** - Only grant required scopes
4. **Revoke unused tokens** - Clean up old tokens at https://github.com/settings/tokens
5. **Keep tokens secure** - Never share or expose in logs

---

## 🐛 Troubleshooting

### Error: "GITHUB_TOKEN environment variable is required"
```bash
export GITHUB_TOKEN="your_token_here"
```

### Error: "GITHUB_REPO environment variable is required"
```bash
export GITHUB_REPO="owner/repo"  # e.g., "johndoe/myapp"
```

### Error: "HTTP 404: Not Found"
- Verify repository name is correct (owner/repo format)
- Ensure token has `repo` scope
- Check repository exists and you have access

### Error: "HTTP 401: Unauthorized"
- Token may be expired or invalid
- Regenerate token with correct scopes

### Error: "Failed to get public key"
- Check repository name format
- Verify you have admin access to repository
- Ensure Actions are enabled in repository settings

---

## 📊 Output Example

```
🔐 GitHub Secrets Sync Tool

📁 Reading environment variables from: .env
✅ Found 25 environment variables

🔍 DRY RUN MODE - No changes will be made

🔑 Fetching repository public key...
✅ Public key retrieved

📤 Processing secrets...

✓ Would add: VITE_SUPABASE_URL = https://abc123.supabase.co...
✓ Would add: VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5...
⏭️  Skipping EXAMPLE_KEY (placeholder value)
✓ Would add: VITE_GOOGLE_CLIENT_ID = 123456789-abc.apps.googleu...

==================================================
📊 Summary:
   ✅ Success: 22
   ⏭️  Skipped: 3
==================================================

💡 Run without --dry-run to apply changes
```

---

## 🔄 Updating Secrets

The script automatically **updates existing secrets** if they already exist. Run it anytime you:
- Add new environment variables
- Update existing values
- Want to sync changes from `.env`

---

## 📝 Notes

- **Encryption**: Uses GitHub's public key encryption (compatible with libsodium)
- **Rate Limits**: GitHub API has rate limits (5000 requests/hour for authenticated users)
- **Secret Names**: Must match GitHub's naming rules (alphanumeric + underscore)
- **Large Values**: Secrets can be up to 64KB in size

---

## 🎯 What Gets Synced

✅ **Synced:**
- All valid environment variables from `.env`
- Variables with actual values

❌ **Skipped:**
- Empty values
- Placeholder values (`your_value_here`, `REPLACE_ME`, etc.)
- Comments and blank lines

---

## 🚀 Next Steps

After syncing secrets:

1. ✅ Verify secrets in GitHub: `Settings → Secrets → Actions`
2. ✅ Trigger GitHub Actions workflow to test
3. ✅ Monitor deployment logs for any issues
4. ✅ Update secrets anytime with: `node scripts/sync-github-secrets.js`

---

## 💡 Pro Tips

1. **Always dry-run first** to preview changes
2. **Keep `.env.example` updated** with placeholder values
3. **Document required secrets** in README
4. **Use different tokens** for different purposes
5. **Automate in CI/CD** for team environments

---

## 📚 Related Documentation

- [GitHub Secrets API](https://docs.github.com/en/rest/actions/secrets)
- [Creating Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
