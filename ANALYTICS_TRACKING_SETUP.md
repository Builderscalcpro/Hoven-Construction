# Analytics & Tracking Setup Guide

## Overview
Your site now has comprehensive analytics and tracking integrated. This guide explains how to configure each platform.

## 🔧 Configuration Required

### 1. Google Analytics 4 (GA4)
**Location:** `index.html` lines 42-50

**Setup Steps:**
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property for your website
3. Copy your Measurement ID (format: G-XXXXXXXXXX)
4. Replace `G-XXXXXXXXXX` in index.html with your actual ID (appears twice)

**What it tracks:**
- Page views (automatic)
- User sessions and engagement
- Custom events via `analytics.trackEvent()`

### 2. Google Tag Manager (GTM)
**Location:** `index.html` lines 52-57 and 87-89

**Setup Steps:**
1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Create a new container
3. Copy your Container ID (format: GTM-XXXXXXX)
4. Replace `GTM-XXXXXXX` in index.html (appears twice)

**Benefits:**
- Manage all tracking codes from one dashboard
- Add/remove tags without code changes
- Advanced event tracking and triggers

### 3. Microsoft Clarity
**Location:** `index.html` lines 59-66

**Setup Steps:**
1. Go to [Microsoft Clarity](https://clarity.microsoft.com/)
2. Add your website and get Project ID
3. Replace `YOUR_CLARITY_ID` in index.html

**Features:**
- Session recordings
- Heatmaps
- User behavior insights
- Free forever

### 4. Facebook Pixel
**Location:** `index.html` lines 68-83

**Setup Steps:**
1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Create a new Pixel
3. Copy your Pixel ID
4. Replace `YOUR_PIXEL_ID` in index.html (appears twice)

**Tracks:**
- Page views
- Lead submissions
- Quote requests
- Payment events

### 5. Google Search Console
**Location:** `index.html` line 12

**Setup Steps:**
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property
3. Choose HTML tag verification method
4. Copy the verification code
5. Replace `YOUR_VERIFICATION_CODE_HERE`

### 6. Bing Webmaster Tools
**Location:** `index.html` line 15

**Setup Steps:**
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add your site
3. Choose meta tag verification
4. Copy the verification code
5. Replace `YOUR_BING_VERIFICATION_CODE_HERE`

## 📊 Custom Event Tracking

The `src/lib/analytics.ts` file provides helper functions:

```typescript
import { analytics } from '@/lib/analytics';

// Track lead submissions
analytics.trackLeadSubmission('contact-form');

// Track quote requests
analytics.trackQuoteRequest('kitchen-remodel', 50000);

// Track consultations
analytics.trackConsultationBooked('virtual');

// Track contact clicks
analytics.trackContactClick('phone');

// Track payments
analytics.trackPaymentCompleted(5000, 'txn_123');
```

## ✅ Testing

After setup:
1. Visit your site
2. Check GA4 Real-Time reports
3. Verify Clarity recordings appear
4. Test Facebook Pixel with Pixel Helper extension
5. Confirm GTM tags fire correctly

## 🎯 What's Being Tracked

- **Page Views:** Every page navigation
- **Lead Generation:** Form submissions
- **Quote Requests:** Service inquiries
- **Consultations:** Booking events
- **Phone Calls:** Click-to-call interactions
- **Project Views:** Gallery interactions
- **Payments:** Transaction events

All tracking is GDPR/CCPA compliant with your Cookie Consent component.
