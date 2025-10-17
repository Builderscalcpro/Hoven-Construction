# ⚡ Quick Start: Supabase Secrets Sync

## 🎯 5-Minute Setup

### Step 1: Install Supabase CLI
```bash
npm install -g supabase
```

### Step 2: Login to Supabase
```bash
supabase login
```
This opens a browser window for authentication.

### Step 3: Sync All Secrets
```bash
npm run sync-supabase-secrets
```
Automatically syncs all variables from `.env.example` to your Supabase project.

### Step 4: Validate
```bash
npm run validate-supabase-secrets
```
Ensures all edge functions have required secrets.

### Step 5: Deploy
```bash
bash deploy-supabase-functions.sh
```
Deploys all edge functions with automatic validation.

## ✅ That's It!

Your Supabase edge functions now have all required secrets and are ready to deploy.

## 🔄 Regular Usage

When you update secrets in `.env.example`:

```bash
npm run sync-supabase-secrets && npm run validate-supabase-secrets
```

## 🆘 Need Help?

See `SUPABASE_SECRETS_SETUP.md` for detailed documentation and troubleshooting.

## 🔍 Check Current Secrets

```bash
supabase secrets list --project-ref YOUR_PROJECT_ID
```

## 📝 Common Commands

| Command | Purpose |
|---------|---------|
| `npm run sync-supabase-secrets` | Sync all secrets |
| `npm run validate-supabase-secrets` | Validate secrets |
| `bash deploy-supabase-functions.sh` | Deploy with validation |
| `supabase secrets list` | View current secrets |
