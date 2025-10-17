# Cloudflare DDoS Protection & CDN Setup Guide

## Quick Setup (15 minutes)

### Step 1: Create Cloudflare Account
1. Go to https://cloudflare.com and sign up (Free plan includes DDoS protection)
2. Add your domain: `yourdomain.com`
3. Cloudflare will scan existing DNS records

### Step 2: Update Nameservers
1. Cloudflare will provide 2 nameservers like:
   - `nina.ns.cloudflare.com`
   - `todd.ns.cloudflare.com`
2. Update these at your domain registrar (GoDaddy, Namecheap, etc.)
3. Wait 5-24 hours for propagation

### Step 3: Configure DNS Records
```
Type    Name    Content                 Proxy Status
A       @       Your-Server-IP          Proxied (Orange Cloud)
A       www     Your-Server-IP          Proxied (Orange Cloud)
CNAME   api     your-api-domain.com     Proxied
```

### Step 4: Enable Security Features

#### DDoS Protection (Auto-Enabled)
- **Free Plan**: Protects against Layer 3/4 DDoS attacks
- **Settings**: Security > DDoS > Sensitivity: High

#### Firewall Rules
1. Go to Security > WAF
2. Create custom rules:
```
Rule 1: Block Bad Bots
Expression: (cf.client.bot) and not (cf.verified_bot)
Action: Block

Rule 2: Challenge Suspicious Countries
Expression: (ip.geoip.country in {"CN" "RU" "KP"})
Action: Managed Challenge

Rule 3: Rate Limiting
Expression: (http.request.uri.path contains "/api/")
Action: Rate limit (10 requests per minute)
```

### Step 5: Configure CDN & Performance

#### Caching
1. Caching > Configuration
2. Browser Cache TTL: 4 hours
3. Always Online: ON

#### Speed Optimizations
- Auto Minify: JavaScript, CSS, HTML ✓
- Brotli: ON
- Rocket Loader: ON
- Early Hints: ON

#### Page Rules (3 free)
```
Rule 1: /*
- Cache Level: Standard
- Edge Cache TTL: 2 hours

Rule 2: /api/*
- Cache Level: Bypass
- Security Level: High

Rule 3: /admin/*
- Security Level: High
- Disable Performance
```

### Step 6: SSL/TLS Configuration
1. SSL/TLS > Overview
2. Mode: Full (strict)
3. Edge Certificates > Always Use HTTPS: ON
4. Minimum TLS Version: 1.2

### Step 7: Additional Security

#### Bot Protection
- Security > Bots > Bot Fight Mode: ON
- Challenge Passage: 30 minutes

#### Hotlink Protection
Prevent image theft:
```
Scrape Shield > Hotlink Protection: ON
Protected Extensions: jpg, jpeg, png, gif, webp
```

## Environment Variables Update

Add to your `.env`:
```bash
# Cloudflare Configuration
CLOUDFLARE_ZONE_ID=your_zone_id_here
CLOUDFLARE_API_TOKEN=your_api_token_here
CLOUDFLARE_ACCOUNT_ID=your_account_id_here

# CDN URLs (after setup)
VITE_CDN_URL=https://cdn.yourdomain.com
VITE_IMAGE_CDN=https://yourdomain.com
```

## Monitoring Dashboard

### Key Metrics to Watch
1. **Analytics**: Traffic, Bandwidth Saved, Threats Blocked
2. **Security Events**: Firewall Events, DDoS Attacks
3. **Performance**: Cache Hit Ratio, Origin Response Time

### Alert Configuration
1. Notifications > Create
2. Alert types to enable:
   - DDoS Attack
   - Origin Error Rate
   - SSL Certificate Expiration
   - Weekly Summary

## Testing Your Setup

### Verify CDN is Working
```bash
curl -I https://yourdomain.com
# Look for: cf-cache-status: HIT
# Server: cloudflare
```

### Check Security Headers
```bash
curl -I https://yourdomain.com
# Should see:
# cf-ray: [ray-id]
# cf-cache-status: DYNAMIC
```

### Test DDoS Protection
Use Cloudflare's Attack Simulator (Enterprise only) or monitor real traffic

## Free Plan Limitations
- 3 Page Rules
- Basic DDoS Protection
- No Image Optimization
- No Custom WAF Rules (only 5 free)

## Upgrade Benefits (Pro - $20/month)
- Advanced DDoS Protection
- WAF with OWASP Core Ruleset
- 20 Page Rules
- Image Optimization (Polish, Mirage)
- Mobile Optimization
- Automatic Platform Optimization

## Troubleshooting

### Site Not Loading
- Check DNS propagation: https://dnschecker.org
- Verify SSL mode matches origin server
- Temporarily set to "DNS only" mode to bypass Cloudflare

### Too Many Redirects
- SSL/TLS > Edge Certificates > Always Use HTTPS
- Check origin server isn't also forcing HTTPS

### API Issues
- Create Page Rule to bypass cache for /api/*
- Ensure CORS headers are preserved

## Post-Setup Checklist
- [ ] Nameservers updated
- [ ] DNS records proxied (orange cloud)
- [ ] SSL mode set to Full (strict)
- [ ] Security level configured
- [ ] Caching rules created
- [ ] Firewall rules active
- [ ] Bot protection enabled
- [ ] Monitoring alerts configured
- [ ] Test site loading through Cloudflare
- [ ] Verify caching is working

## Support Resources
- Cloudflare Dashboard: https://dash.cloudflare.com
- Community: https://community.cloudflare.com
- Support: https://support.cloudflare.com
- Status: https://cloudflarestatus.com

---

**Setup Time**: 15-30 minutes (plus DNS propagation)
**Cost**: Free (Pro recommended for business)
**Impact**: Instant DDoS protection, 50-80% bandwidth savings, 30-50% faster load times