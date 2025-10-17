# Google Business Profile Integration Guide

## Overview
This application integrates with Google Business Profile API to sync reviews, business information, and manage your online presence.

## Setup Instructions

### Method 1: OAuth 2.0 (Recommended)

#### Prerequisites
1. Google Cloud Console project with Google Business Profile API enabled
2. OAuth 2.0 credentials configured

#### Configuration

**Environment Variables (.env.local):**
```
VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID=309881425631-4blqrff1i32ijj2qqfhngpb8j8m51n07.apps.googleusercontent.com
VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_SECRET=your_client_secret_here
```

**OAuth Redirect URI:**
Add this to your Google Cloud Console OAuth 2.0 credentials:
```
http://localhost:5173/google-business-callback
https://yourdomain.com/google-business-callback
```

- Update contact information
- Manage business address
- Sync photos and media

### 4. Dashboard Features
- View all reviews in one place
- Respond to reviews with one click
- Track sync status and history
- Manage connection settings

## Setup Instructions

### Option 1: API Key Setup (Recommended)

1. **Get Your Google Business Profile API Key**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable "Google My Business API"
   - Go to "Credentials" → "Create Credentials" → "API Key"
   - Copy the API Key

2. **Find Your Account and Location IDs**
   - Use Google My Business API Explorer
   - Account ID format: `accounts/1234567890`
   - Location ID format: `locations/0987654321`

3. **Connect in Dashboard**
   - Navigate to Dashboard → Google Business Profile
   - Enter your API Key
   - Enter your Account ID
   - Enter your Location ID
   - Click "Connect"

### Option 2: OAuth Setup (Advanced)

1. **Google Cloud Console Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 Client ID
   - Add redirect URI: `https://yourdomain.com/google-business-callback`
   - Copy Client ID and Client Secret

2. **Configure Environment Variables**
   - `GOOGLE_BUSINESS_PROFILE_CLIENT_ID`
   - `GOOGLE_BUSINESS_PROFILE_CLIENT_SECRET`

## Database Setup

The `google_business_tokens` table stores:
- API credentials (access tokens)
- Account and location IDs
- Last sync timestamp
- Row Level Security enabled

## Usage

### For Business Owners

1. Navigate to Dashboard
2. Click "Google Business Profile" card
3. Enter your API credentials
4. Start managing reviews and syncing data

### For Developers

#### Using the Service Layer

```typescript
import { fetchGoogleReviews, replyToReview } from '@/lib/googleBusinessService';

// Fetch reviews
const reviews = await fetchGoogleReviews(tokenData);

// Reply to a review
const success = await replyToReview(tokenData, reviewId, 'Thank you!');
```

## Components

### Dashboard Components
- `GoogleBusinessDashboard.tsx` - Main dashboard container
- `GoogleBusinessAPISetup.tsx` - API key setup form
- `GoogleBusinessReviews.tsx` - Review management interface
- `GoogleBusinessSync.tsx` - Sync settings and controls
- `GoogleBusinessInfo.tsx` - Business information display

### Public Components
- `GoogleReviewsDisplay.tsx` - Display reviews on website (with demo data fallback)

### Service Layer
- `googleBusinessService.ts` - API interaction functions

## API Endpoints

### Google Business Profile API
- Base URL: `https://mybusiness.googleapis.com/v4/`
- Scope: `https://www.googleapis.com/auth/business.manage`

### Key Endpoints
- `{account}/{location}/reviews` - Get reviews
- `{account}/{location}/reviews/{id}/reply` - Reply to reviews
- `{account}/{location}` - Get business info

## Security

- API credentials stored encrypted in Supabase
- Row Level Security ensures users only access their own data
- API calls made with proper authentication
- No sensitive data exposed to frontend

## Troubleshooting

### Connection Issues
- Verify API key is correct and active
- Check Account ID and Location ID format
- Ensure API is enabled in Google Cloud Console

### Review Display Issues
- Sample reviews display by default when not connected
- Real reviews appear after successful API connection
- Check browser console for error messages

## Future Enhancements
- Automatic review response templates
- Sentiment analysis for reviews
- Photo sync from Google Business Profile
- Performance metrics and insights
- Multi-location support
