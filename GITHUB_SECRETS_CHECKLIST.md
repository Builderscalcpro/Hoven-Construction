# 🔐 GitHub Secrets Configuration Checklist

## How to Add Secrets to GitHub

Go to: **https://github.com/Builderscalcpro/Hoven-Construction/settings/secrets/actions**

Or navigate: **Settings → Secrets and variables → Actions → New repository secret**

---

## ✅ REQUIRED Secrets for Deployment

### Supabase (CRITICAL)
- [ ] `VITE_SUPABASE_URL` = `https://qdxondojktchkjbbrtaq.supabase.co`
- [ ] `VITE_SUPABASE_ANON_KEY` = (Get from Supabase Dashboard)
- [ ] `SUPABASE_ACCESS_TOKEN` = (For Edge Functions deployment)
- [ ] `SUPABASE_PROJECT_ID` = `qdxondojktchkjbbrtaq`

### Google Services (CRITICAL)
- [ ] `VITE_GOOGLE_CLIENT_ID` = `309881425631-rlso29r8fj72194v07n1j5eo5sspa7ck.apps.googleusercontent.com`
- [ ] `VITE_GOOGLE_API_KEY` = `AIzaSyAO8kN_Je2kfLgq8FtE2r7gb03stDJ5sPw`

### Analytics (CRITICAL)
- [ ] `VITE_GA_MEASUREMENT_ID` = `G-KB485Y4Z44`

### Stripe Payments (CRITICAL)
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` = `pk_live_51SDvDkRjm0dYOknbAMJHX7fmG6eZ3RgLqPKYvJycLz9XAob2cMGp2YyUtjUqWskFntwSFgqwJhEDcrgF2kVv2ih900dITjclwB`

---

## 🔧 DEPLOYMENT Platform Secrets

### Vercel (if using Vercel)
- [ ] `VERCEL_TOKEN` = (Get from Vercel account settings)
- [ ] `VERCEL_ORG_ID` = (Get from Vercel project settings)
- [ ] `VERCEL_PROJECT_ID` = (Get from Vercel project settings)

### Netlify (if using Netlify)
- [ ] `NETLIFY_AUTH_TOKEN` = (Get from Netlify user settings)
- [ ] `NETLIFY_SITE_ID` = (Get from Netlify site settings)

---

## 📊 OPTIONAL Secrets (Recommended)

### Error Tracking
- [ ] `VITE_SENTRY_DSN` = (Get from Sentry.io project)

### Advanced Analytics
- [ ] `VITE_GTM_ID` = (Google Tag Manager ID, format: GTM-XXXXXXX)

### Notifications
- [ ] `SLACK_WEBHOOK_URL` = (For deployment notifications)

---

## 🔍 How to Verify Secrets Are Set

1. Go to: https://github.com/Builderscalcpro/Hoven-Construction/settings/secrets/actions
2. You should see a list of secret names (values are hidden)
3. Count should match the checkboxes above

---

## 🚨 CRITICAL: Secrets vs Environment Variables

**GitHub Secrets** (for CI/CD):
- Set in GitHub repository settings
- Used by GitHub Actions during build/deploy
- Never visible in logs

**Supabase Secrets** (for Edge Functions):
- Set in Supabase Dashboard or via CLI
- Used by backend Edge Functions
- Examples: `ANTHROPIC_API_KEY`, `STRIPE_SECRET_KEY`, `SENDGRID_API_KEY`

---

## ⚡ Quick Setup Commands

To verify which secrets you need from Supabase:
```bash
# Login to Supabase CLI
supabase login

# List current secrets
supabase secrets list --project-ref qdxondojktchkjbbrtaq
```

---

## 📋 Current Status

**Repository**: https://github.com/Builderscalcpro/Hoven-Construction

**Next Steps**:
1. Add all REQUIRED secrets above
2. Push code to trigger deployment
3. Monitor GitHub Actions for success/failure
4. Check deployment logs if issues occur
