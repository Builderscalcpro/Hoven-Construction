# Cloudflare CDN Quick Setup (5 Minutes)

## Instant Setup Steps

### 1. Sign Up (2 min)
```
1. Go to: https://cloudflare.com/sign-up
2. Enter email and password
3. Click "Create Account"
4. Add your domain: yourdomain.com
5. Select FREE plan ($0/month)
```

### 2. Update Nameservers (1 min)
Cloudflare will show 2 nameservers. Copy them.

**At Your Domain Registrar:**
- GoDaddy: Domain Settings > Nameservers > Change
- Namecheap: Domain List > Manage > Nameservers > Custom DNS
- Google Domains: DNS > Custom name servers

Replace with Cloudflare's nameservers.

### 3. Quick Security (2 min)
In Cloudflare Dashboard:

**Auto-Applied Protection:**
- ✅ DDoS Protection (automatic)
- ✅ SSL Certificate (automatic)
- ✅ Bot Protection (automatic)

**One-Click Enables:**
1. SSL/TLS > Edge Certificates > Always Use HTTPS: **ON**
2. Security > Settings > Security Level: **Medium**
3. Security > Bots > Bot Fight Mode: **ON**
4. Speed > Optimization > Auto Minify: **Check all boxes**

## That's It! 🎉

Your site now has:
- **DDoS Protection**: Blocks attacks automatically
- **Global CDN**: 285+ data centers worldwide
- **Free SSL**: Encrypted connections
- **Faster Loading**: 30-50% speed improvement
- **Bandwidth Savings**: 60% less server load

## Verify It's Working

Visit your site and check for:
- 🔒 Padlock icon (SSL working)
- Faster page loads
- View source: Look for "cf-ray" header

## DNS Propagation Time
- Usually: 5-30 minutes
- Maximum: 24 hours
- Check status: https://dnschecker.org

## Emergency Rollback
If issues occur:
1. Cloudflare Dashboard > DNS
2. Click orange clouds to make them gray (bypasses Cloudflare)
3. Or revert nameservers at registrar

## Next Steps (Optional)
- Set up Page Rules for specific paths
- Configure firewall rules
- Enable more speed optimizations
- Upgrade to Pro ($20/month) for advanced features

---

**Total Setup Time**: 5 minutes
**Cost**: FREE
**Protection**: Immediate after DNS propagation