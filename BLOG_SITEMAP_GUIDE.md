# Blog Sitemap Integration Guide

## Overview
The sitemap generator now dynamically includes all published blog posts from the database with SEO-optimized settings including featured images, lastmod dates, and customizable priorities.

## Features

### 1. Dynamic Blog Post Integration
- Automatically queries `blog_posts` table for published posts
- Generates individual URLs for each post: `/blog/{slug}`
- Includes lastmod dates based on `updated_at` timestamp
- Supports featured image inclusion in sitemap

### 2. Separate Blog Sitemap
- **Main Sitemap** (`sitemap.xml`): Core site pages + blog posts
- **Blog Sitemap** (`sitemap-blog.xml`): Blog posts only
- **Sitemap Index** (`sitemap-index.xml`): References both sitemaps

### 3. Blog-Specific Configuration
Configure blog post SEO settings in the Admin Dashboard:

#### Priority Settings
- **Recommended**: 0.6-0.7 for blog posts
- **Default**: 0.65
- Adjustable per your content strategy

#### Change Frequency
- **Recommended**: Daily (for active blogs)
- Options: always, hourly, daily, weekly, monthly
- Signals to search engines how often content updates

#### Featured Images
- Toggle to include/exclude featured images in sitemap
- Uses Google Image Sitemap extension
- Helps with image SEO and discovery

## Database Schema

### blog_posts Table
```sql
- id: Serial primary key
- title: Post title
- slug: URL-friendly identifier (unique)
- excerpt: Short description
- content: Full post content
- featured_image: Image URL for sitemap
- category: Post category
- published_date: Publication timestamp
- updated_at: Last modification (used for lastmod)
- is_published: Boolean (only published posts in sitemap)
```

## Admin Dashboard Usage

### Access Sitemap Manager
1. Navigate to Admin Dashboard
2. Scroll to "Sitemap Manager" section
3. Click "Blog Settings" tab

### Configure Blog Sitemap
1. **Enable/Disable**: Toggle blog sitemap generation
2. **Set Priority**: Adjust default priority (0.6-0.7 recommended)
3. **Change Frequency**: Select update frequency (daily recommended)
4. **Include Images**: Toggle featured image inclusion
5. Click "Save Blog Settings"

### Generate Sitemaps
- **Main Sitemap**: Core pages + blog posts
- **Blog Sitemap**: Blog posts only (for large blogs)
- **Sitemap Index**: Master file referencing all sitemaps

### Submit to Search Engines
After generating sitemaps:
1. Click "Submit to Google" for Google Search Console
2. Click "Submit to Bing" for Bing Webmaster Tools
3. Submissions are logged in `sitemap_submissions` table

## XML Structure

### Blog Post Entry Example
```xml
<url>
  <loc>https://yoursite.com/blog/kitchen-renovation-cost-2025</loc>
  <lastmod>2025-10-01</lastmod>
  <changefreq>daily</changefreq>
  <priority>0.65</priority>
  <image:image>
    <image:loc>https://cdn.example.com/kitchen-image.jpg</image:loc>
  </image:image>
</url>
```

### Sitemap Index Structure
```xml
<sitemapindex>
  <sitemap>
    <loc>https://yoursite.com/sitemap.xml</loc>
    <lastmod>2025-10-05</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://yoursite.com/sitemap-blog.xml</loc>
    <lastmod>2025-10-05</lastmod>
  </sitemap>
</sitemapindex>
```

## Best Practices

### Priority Guidelines
- Homepage: 1.0
- Main services: 0.9
- Blog index: 0.8
- Blog posts: 0.6-0.7
- Legal pages: 0.3

### Change Frequency
- Blog posts: Daily (if updated regularly)
- Static pages: Monthly or Yearly
- News/updates: Hourly or Daily

### Image Optimization
- Always include featured images for better SEO
- Ensure images are optimized and accessible
- Use descriptive filenames and alt text

### Update Schedule
- Regenerate sitemap after publishing new posts
- Submit to search engines after major updates
- Set up automated regeneration (weekly recommended)

## Automation Tips

### Automatic Regeneration
Consider triggering sitemap regeneration:
- After new blog post publication
- On scheduled basis (weekly/daily)
- When post content is updated
- Via webhook or cron job

### Monitoring
Track sitemap submissions in `sitemap_submissions` table:
- Submission timestamp
- Search engine (Google/Bing)
- Success/failure status
- Response data

## Troubleshooting

### Blog Posts Not Appearing
1. Verify posts have `is_published = true`
2. Check blog sitemap is enabled in settings
3. Ensure posts have valid slugs
4. Regenerate sitemap after changes

### Images Not Showing
1. Confirm "Include Featured Images" is enabled
2. Verify `featured_image` URLs are valid
3. Check image accessibility (not blocked by robots.txt)

### Search Engine Submission Fails
1. Verify API keys are configured (Bing)
2. Check site is verified in Search Console
3. Review error logs in `sitemap_submissions`
4. Ensure sitemap URL is publicly accessible

## SEO Benefits

### For Blog Posts
- Faster indexing of new content
- Better image discovery
- Accurate update signals
- Improved crawl efficiency

### For Overall Site
- Organized content structure
- Clear site hierarchy
- Better search engine communication
- Enhanced discoverability

## Next Steps

1. Migrate existing blog posts to database (if needed)
2. Configure blog sitemap settings
3. Generate and download sitemaps
4. Submit to Google and Bing
5. Monitor indexing in Search Console
6. Set up regular regeneration schedule

## Support

For issues or questions:
- Check sitemap XML validity at xml-sitemaps.com
- Review Search Console coverage reports
- Verify blog post database entries
- Test sitemap URLs in browser
