# 📊 Analytics & Tracking Setup Guide

This guide covers setting up all analytics and tracking tools used on the site.

## 🎯 Tracking Tools Overview

The site uses multiple tracking platforms:
1. **Google Analytics 4** (GA4) - Primary analytics
2. **Google Tag Manager** (GTM) - Tag management
3. **Microsoft Clarity** - Session recordings & heatmaps
4. **Facebook Pixel** - Ad tracking & retargeting

## 1️⃣ Google Analytics 4 Setup

### Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (gear icon)
3. Click **Create Property**
4. Fill in property details:
   - Property name: "Hoven Construction"
   - Time zone: Pacific Time (US)
   - Currency: USD
5. Click **Next** → Select industry & business size
6. Click **Create** and accept terms

### Add Data Stream

1. Click **Data Streams** → **Add stream** → **Web**
2. Enter website URL: `https://heinhoven.com`
3. Stream name: "Hoven Construction Website"
4. Click **Create stream**
5. **Copy the Measurement ID** (format: G-XXXXXXXXXX)

### Update Configuration

**In `.env` file:**
```env
VITE_GA_MEASUREMENT_ID=G-VB8WCV9VEW
```

**In Supabase Dashboard:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Project Settings** → **Edge Functions** → **Secrets**
4. Find or add `VITE_GA_MEASUREMENT_ID`
5. Set value to: `G-VB8WCV9VEW`
6. Click **Save**

**In `index.html` (lines 45 & 50):**
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-VB8WCV9VEW"></script>
<script>
  gtag('config', 'G-VB8WCV9VEW', {
```


### Verify Tracking

1. Run `npm run dev`
2. Open GA4 → Reports → Realtime
3. Navigate your site
4. Verify events appear in real-time

## 2️⃣ Google Tag Manager Setup

### Create GTM Container

1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Click **Create Account**
3. Account name: "Hoven Construction"
4. Container name: "heinhoven.com"
5. Target platform: **Web**
6. Click **Create** and accept terms
7. **Copy the Container ID** (format: GTM-XXXXXXX)

### Update Configuration

**In `index.html` (lines 56 & 94):**
```html
<!-- Head section -->
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>

<!-- Body section -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
```

### Configure GTM Tags

1. In GTM, click **Add a new tag**
2. Tag Configuration → **Google Analytics: GA4 Configuration**
3. Measurement ID: Your GA4 ID (G-XXXXXXXXXX)
4. Trigger: **All Pages**
5. Save and **Submit** → **Publish**

## 3️⃣ Microsoft Clarity Setup

### Create Clarity Project

1. Go to [Microsoft Clarity](https://clarity.microsoft.com/)
2. Sign in with Microsoft account
3. Click **Add new project**
4. Project name: "Hoven Construction"
5. Website URL: `https://heinhoven.com`
6. Click **Add new project**
7. **Copy the Project ID** (format: alphanumeric string)

### Update Configuration

**In `index.html` (line 68):**
```html
})(window, document, "clarity", "script", "YOUR_CLARITY_ID");
```

### Features to Enable

In Clarity dashboard:
- ✅ Session recordings
- ✅ Heatmaps
- ✅ Rage clicks detection
- ✅ Dead clicks detection
- ✅ Excessive scrolling

## 4️⃣ Facebook Pixel Setup

### Create Facebook Pixel

1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Click **Connect Data Sources** → **Web** → **Facebook Pixel**
3. Name: "Hoven Construction Website"
4. Website URL: `https://heinhoven.com`
5. Click **Continue** → **Install code manually**
6. **Copy the Pixel ID** (numeric)

### Update Configuration

**In `index.html` (lines 81 & 90):**
```html
<!-- Head section -->
fbq('init', 'YOUR_PIXEL_ID');

<!-- Body section -->
src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"
```

### Configure Standard Events

The site already tracks these events:
- PageView (automatic)
- Lead (form submissions)
- InitiateCheckout (quote requests)
- Schedule (consultation bookings)
- Purchase (payment completion)

## 📋 Complete Setup Checklist

- [ ] Google Analytics 4
  - [ ] Property created
  - [ ] Data stream added
  - [ ] Measurement ID copied
  - [ ] Updated in .env
  - [ ] Updated in index.html (2 places)
  - [ ] Real-time tracking verified

- [ ] Google Tag Manager
  - [ ] Container created
  - [ ] Container ID copied
  - [ ] Updated in index.html (2 places)
  - [ ] GA4 tag configured
  - [ ] Container published
  - [ ] Preview mode tested

- [ ] Microsoft Clarity
  - [ ] Project created
  - [ ] Project ID copied
  - [ ] Updated in index.html
  - [ ] Session recordings verified
  - [ ] Heatmaps enabled

- [ ] Facebook Pixel
  - [ ] Pixel created
  - [ ] Pixel ID copied
  - [ ] Updated in index.html (2 places)
  - [ ] Test event sent
  - [ ] Pixel Helper verified

## 🧪 Testing All Tracking

### 1. Browser Extensions
Install these to verify tracking:
- [Google Tag Assistant](https://tagassistant.google.com/)
- [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/)
- [Clarity Extension](https://clarity.microsoft.com/)

### 2. Test Each Platform

**GA4:**
```
1. Open GA4 Real-time report
2. Navigate site in incognito
3. Verify page views appear
4. Submit a form
5. Verify custom events appear
```

**GTM:**
```
1. Enable Preview mode in GTM
2. Navigate to your site
3. Verify tags fire correctly
4. Check dataLayer events
```

**Clarity:**
```
1. Open Clarity dashboard
2. Navigate site
3. Wait 5 minutes
4. Check for new session recording
```

**Facebook Pixel:**
```
1. Install Pixel Helper extension
2. Navigate to your site
3. Verify pixel fires (green checkmark)
4. Submit form
5. Verify Lead event fires
```

## 🚨 Common Issues

### GA4 not tracking
- Check Measurement ID format (G-XXXXXXXXXX)
- Verify .env file is loaded
- Check browser console for errors
- Disable ad blockers

### GTM not firing
- Verify Container ID format (GTM-XXXXXXX)
- Check GTM preview mode
- Ensure container is published
- Clear browser cache

### Clarity not recording
- Wait 5-10 minutes for first session
- Check project ID is correct
- Verify site is live (not localhost)
- Check privacy settings

### Facebook Pixel not firing
- Verify Pixel ID is numeric only
- Check Pixel Helper for errors
- Ensure ad blockers disabled
- Verify domain is verified in Business Manager

## 📊 Key Metrics to Track

### Conversion Goals
- Quote requests
- Consultation bookings
- Contact form submissions
- Phone calls (click-to-call)
- Email clicks

### Engagement Metrics
- Time on site
- Pages per session
- Bounce rate
- Scroll depth
- Video plays

### Traffic Sources
- Organic search
- Direct traffic
- Referrals
- Social media
- Paid ads

## 🎯 Next Steps

After setup:
1. Set up conversion goals in GA4
2. Create custom dashboards
3. Set up automated reports
4. Configure alerts for anomalies
5. Create Facebook custom audiences
6. Set up remarketing campaigns

---

**Need Help?** See [API_KEYS_SETUP_GUIDE.md](./API_KEYS_SETUP_GUIDE.md) for more details.
