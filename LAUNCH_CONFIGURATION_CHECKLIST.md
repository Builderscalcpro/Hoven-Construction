# 🚀 LAUNCH CONFIGURATION CHECKLIST
## Critical Items to Configure Before Going Live

---

## ⚠️ REQUIRED BEFORE LAUNCH

### 1. Google Analytics 4 Setup
**File:** `index.html` (lines 44-53)

**Current Status:** ❌ Using placeholder `G-XXXXXXXXXX`

**Action Required:**
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property for heinhoven.com
3. Copy your Measurement ID (format: G-XXXXXXXXXX)
4. Replace BOTH instances in index.html:
   - Line 45: `src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA4_ID"`
   - Line 50: `gtag('config', 'YOUR_GA4_ID'...`

---

### 2. Google Tag Manager Setup (Optional but Recommended)
**File:** `index.html` (lines 55-60, 94)

**Current Status:** ❌ Using placeholder `GTM-XXXXXXX`

**Action Required:**
1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Create a new container for heinhoven.com
3. Copy your Container ID (format: GTM-XXXXXXX)
4. Replace in 2 locations:
   - Line 60: `'GTM-XXXXXXX'`
   - Line 94: `GTM-XXXXXXX`

**Alternative:** If not using GTM, remove lines 55-60 and 93-95

---

### 3. Microsoft Clarity Setup (Optional)
**File:** `index.html` (lines 62-69)

**Current Status:** ❌ Using placeholder `YOUR_CLARITY_ID`

**Action Required:**
1. Go to [Microsoft Clarity](https://clarity.microsoft.com/)
2. Create a new project for heinhoven.com
3. Copy your Project ID
4. Replace `YOUR_CLARITY_ID` on line 68

**Alternative:** If not using Clarity, remove lines 62-69

---

### 4. Facebook Pixel Setup (Optional)
**File:** `index.html` (lines 71-83, 88-91)

**Current Status:** ❌ Using placeholder `YOUR_PIXEL_ID`

**Action Required:**
1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Create a new Pixel
3. Copy your Pixel ID
4. Replace in 3 locations:
   - Line 81: `fbq('init', 'YOUR_PIXEL_ID')`
   - Line 90: `YOUR_PIXEL_ID`

**Alternative:** If not using Facebook Pixel, remove lines 71-83 and 88-91

---

### 5. Google Search Console Verification
**File:** `index.html` (line 12)

**Current Status:** ❌ Using placeholder `YOUR_VERIFICATION_CODE_HERE`

**Action Required:**
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: heinhoven.com
3. Choose "HTML tag" verification method
4. Copy the verification code from the meta tag
5. Replace `YOUR_VERIFICATION_CODE_HERE` on line 12
6. Submit your sitemap: https://heinhoven.com/sitemap.xml

---

### 6. Bing Webmaster Tools Verification
**File:** `index.html` (line 15)

**Current Status:** ❌ Using placeholder `YOUR_BING_VERIFICATION_CODE_HERE`

**Action Required:**
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add your site: heinhoven.com
3. Choose "Meta tag" verification method
4. Copy the verification code
5. Replace `YOUR_BING_VERIFICATION_CODE_HERE` on line 15
6. Submit your sitemap: https://heinhoven.com/sitemap.xml

---

### 7. Environment Variables
**File:** `.env` (create from `.env.example`)

**Action Required:**
1. Copy `.env.example` to `.env`
2. Fill in all required values:
   ```
   VITE_SUPABASE_URL=your_actual_supabase_url
   VITE_SUPABASE_ANON_KEY=your_actual_supabase_key
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_GOOGLE_API_KEY=your_google_api_key
   VITE_APP_DOMAIN=heinhoven.com
   VITE_APP_NAME=Hoven Construction Corp.
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX (your actual GA4 ID)
   ```

---

## ✅ ALREADY CONFIGURED

- ✅ Domain references updated to heinhoven.com
- ✅ Business name standardized to "Hoven Construction Corp."
- ✅ Structured data (Schema.org) properly configured
- ✅ Open Graph images set to hero image
- ✅ Sitemap.xml exists and is properly formatted
- ✅ robots.txt configured correctly
- ✅ SEO meta tags on all pages
- ✅ Mobile responsive design
- ✅ Image optimization with WebP
- ✅ Proper heading hierarchy

---

## 📋 POST-LAUNCH TASKS

### Immediately After Launch:
1. ✅ Verify Google Analytics is receiving data
2. ✅ Submit sitemap to Google Search Console
3. ✅ Submit sitemap to Bing Webmaster Tools
4. ✅ Test all forms and conversion tracking
5. ✅ Verify structured data with [Google Rich Results Test](https://search.google.com/test/rich-results)
6. ✅ Test mobile usability with [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
7. ✅ Check page speed with [PageSpeed Insights](https://pagespeed.web.dev/)

### Within First Week:
8. Monitor Google Search Console for indexing issues
9. Set up Google Analytics goals for:
   - Form submissions
   - Phone clicks
   - Consultation bookings
   - Quote requests
10. Monitor Core Web Vitals
11. Check for broken links
12. Verify all social sharing works correctly

### Within First Month:
13. Request reviews from recent clients
14. Create Google Business Profile posts
15. Monitor keyword rankings
16. Analyze user behavior in GA4
17. Optimize based on performance data

---

## 🔗 USEFUL LINKS

- [Google Analytics](https://analytics.google.com/)
- [Google Search Console](https://search.google.com/search-console)
- [Google Tag Manager](https://tagmanager.google.com/)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [Microsoft Clarity](https://clarity.microsoft.com/)
- [Facebook Events Manager](https://business.facebook.com/events_manager)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [PageSpeed Insights](https://pagespeed.web.dev/)

---

## 📞 NEED HELP?

If you need assistance with any of these configurations, refer to:
- SEO_AEO_AUDIT_REPORT.md for detailed analysis
- Each platform's documentation linked above
- Your web hosting provider's support for DNS/domain issues
