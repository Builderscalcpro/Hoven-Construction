# Deployment Guide - Hein Hoven Construction

## Pre-Deployment Checklist

### 1. Environment Variables
Create a `.env` file with the following variables:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_DOMAIN=heinhoven.com
VITE_APP_NAME=Hein Hoven Construction
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_API_KEY=your_google_api_key
VITE_GA_MEASUREMENT_ID=your_google_analytics_id
```

### 2. Build the Application
```bash
npm install
npm run build
```

### 3. Deploy to Hosting Provider

#### Option A: Vercel
```bash
npm install -g vercel
vercel --prod
```

#### Option B: Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### 4. Configure Domain
- Point your domain (heinhoven.com) to your hosting provider
- Enable SSL/HTTPS (automatic on Vercel/Netlify)
- Update DNS records

### 5. Post-Deployment Tasks
- [ ] Test all forms and submissions
- [ ] Verify Google Calendar integration
- [ ] Test payment processing
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Analytics
- [ ] Test email notifications
- [ ] Verify mobile responsiveness

## Security Notes
- Never commit `.env` file to version control
- Rotate API keys regularly
- Enable Supabase Row Level Security (RLS)
- Use HTTPS only in production
