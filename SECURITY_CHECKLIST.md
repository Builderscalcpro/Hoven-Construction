# Security Checklist

## ✅ Completed
- [x] Environment variables configured (.env)
- [x] .env added to .gitignore
- [x] Supabase API keys moved to environment variables
- [x] HTTPS/SSL ready (automatic on Vercel/Netlify)
- [x] Privacy Policy page created
- [x] Terms of Service page created
- [x] Cookie consent banner implemented

## 🔒 Pre-Launch Security Tasks

### Supabase Security
- [ ] Enable Row Level Security (RLS) on all tables
- [ ] Review and test RLS policies
- [ ] Rotate Supabase anon key if previously exposed
- [ ] Set up Supabase auth email templates
- [ ] Configure Supabase auth redirects

### API Keys & Secrets
- [ ] Verify all API keys are in environment variables
- [ ] Set up production environment variables on hosting platform
- [ ] Never commit .env file to git
- [ ] Use different keys for dev/staging/production

### Authentication
- [ ] Test password reset flow
- [ ] Configure email verification
- [ ] Set up OAuth providers (Google, etc.)
- [ ] Implement rate limiting on auth endpoints

### Data Protection
- [ ] Encrypt sensitive data at rest
- [ ] Use HTTPS only (no HTTP)
- [ ] Implement CORS properly
- [ ] Sanitize all user inputs
- [ ] Validate file uploads

### Monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Enable Supabase logs
- [ ] Monitor API usage
- [ ] Set up alerts for suspicious activity

## 📋 Regular Maintenance
- Rotate API keys every 90 days
- Review user permissions monthly
- Update dependencies regularly
- Backup database weekly
