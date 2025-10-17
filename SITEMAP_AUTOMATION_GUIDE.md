# Automated Sitemap Generator - Complete Guide

## Overview
The automated sitemap generator scans all application routes, generates sitemap.xml, and automatically submits to Google Search Console and Bing Webmaster Tools.

## Features

### 1. **Automatic Route Detection**
- Scans all defined routes in the application
- Automatically includes new pages as they're added
- Categorizes pages by type (home, services, blog, legal, portal)

### 2. **Sitemap Manager UI** (Admin Dashboard)
- **Initialize Routes**: Populate database with all application routes
- **Generate & Download**: Create sitemap.xml file and download
- **Submit to Google**: Automatically submit to Google Search Console
- **Submit to Bing**: Automatically submit to Bing Webmaster Tools
- **Configure URLs**: Set priority and change frequency for each URL
- **Exclude URLs**: Toggle URLs to exclude from sitemap

### 3. **Database Configuration**
Two tables manage sitemap functionality:
- `sitemap_config`: Stores URL settings (priority, changefreq, exclusions)
- `sitemap_submissions`: Tracks submission history to search engines

## How to Use

### Initial Setup

1. **Access Admin Dashboard**
   - Navigate to `/admin-dashboard`
   - Locate the "Sitemap Manager" card

2. **Initialize Routes**
   - Click "Initialize Routes" button
   - This populates the database with all application routes
   - Default priorities and change frequencies are set

3. **Configure URLs** (Optional)
   - Adjust **Priority** (0.0 to 1.0) for each URL
   - Set **Change Frequency**: always, hourly, daily, weekly, monthly, yearly, never
   - Toggle **Excluded** switch to remove URLs from sitemap

### Generate Sitemap

1. **Generate & Download**
   - Click "Generate & Download" button
   - Sitemap.xml is created and downloaded to your computer
   - Upload this file to your website's root directory

2. **Automatic Submission**
   - Click "Submit to Google" to submit to Google Search Console
   - Click "Submit to Bing" to submit to Bing Webmaster Tools
   - Submissions are logged in the database

## Default Route Configuration

| Route | Page Type | Priority | Change Frequency |
|-------|-----------|----------|------------------|
| / | home | 1.0 | daily |
| /services | services | 0.9 | weekly |
| /blog | blog | 0.8 | daily |
| /case-studies | case-studies | 0.7 | monthly |
| /consultations | consultation | 0.8 | weekly |
| /privacy-policy | legal | 0.3 | yearly |
| /terms-of-service | legal | 0.3 | yearly |
| /dashboard | portal | 0.5 | never |
| /client-portal | portal | 0.5 | never |
| /contractor-portal | portal | 0.5 | never |

## API Integration

### Google Search Console
- Uses Google Webmaster Tools API
- Requires OAuth authentication
- Endpoint: `submit-sitemap-google` edge function

### Bing Webmaster Tools
- Uses Bing Webmaster API
- Requires API key (already configured: `BING_WEBMASTER_API_KEY`)
- Endpoint: `submit-sitemap-bing` edge function

## Best Practices

### Priority Guidelines
- **1.0**: Homepage only
- **0.8-0.9**: Main service pages, important content
- **0.5-0.7**: Secondary pages, blog posts, case studies
- **0.3-0.4**: Legal pages, terms, privacy policy
- **0.5 or never**: Portal/dashboard pages (often excluded)

### Change Frequency Guidelines
- **daily**: Homepage, blog listing, frequently updated content
- **weekly**: Service pages, regularly updated sections
- **monthly**: Case studies, testimonials
- **yearly**: Legal pages, rarely changing content
- **never**: User portals, dashboards (often excluded)

### Exclusion Strategy
Exclude these page types:
- Login/signup pages
- User dashboards and portals
- Admin pages
- Thank you pages
- 404 error pages
- Search results pages

## Automation Schedule

### Recommended Workflow
1. **Weekly**: Generate and submit sitemap automatically
2. **After Major Updates**: Manually regenerate and submit
3. **New Pages**: Initialize routes to include new pages
4. **Monthly**: Review submission logs and verify indexing

## Troubleshooting

### Sitemap Not Generating
- Ensure routes are initialized in database
- Check that base URL is correct
- Verify no URLs are accidentally excluded

### Submission Failures
- **Google**: Verify OAuth credentials are configured
- **Bing**: Confirm `BING_WEBMASTER_API_KEY` is set in Supabase
- Check submission logs in `sitemap_submissions` table

### URLs Missing from Sitemap
- Check if URL is marked as excluded in configuration
- Verify route is defined in `APP_ROUTES` array
- Re-initialize routes if new pages were added

## Technical Details

### Edge Functions
- `submit-sitemap-google`: Submits to Google Search Console API
- `submit-sitemap-bing`: Submits to Bing Webmaster Tools API

### Database Tables
```sql
sitemap_config (
  id, url, priority, changefreq, 
  excluded, page_type, created_at, updated_at
)

sitemap_submissions (
  id, search_engine, status, 
  response_data, submitted_at, created_at
)
```

## Next Steps

1. ✅ Initialize routes in Sitemap Manager
2. ✅ Configure priorities and change frequencies
3. ✅ Generate and download sitemap.xml
4. ✅ Upload sitemap.xml to website root directory
5. ✅ Submit to Google Search Console
6. ✅ Submit to Bing Webmaster Tools
7. ✅ Monitor submission logs and indexing status

Your sitemap automation is now complete! 🎉
