import { supabase } from './supabase';

export interface SitemapEntry {
  url: string;
  priority: number;
  changefreq: string;
  lastmod?: string;
  excluded?: boolean;
  pageType?: string;
  image?: string;
}

export interface BlogSitemapConfig {
  priority: number;
  changefreq: string;
  includeImages: boolean;
  enabled: boolean;
}

// Define all application routes
export const APP_ROUTES = [
  { path: '/', pageType: 'home', priority: 1.0, changefreq: 'daily' },
  { path: '/services', pageType: 'services', priority: 0.9, changefreq: 'weekly' },
  { path: '/blog', pageType: 'blog', priority: 0.8, changefreq: 'daily' },
  { path: '/case-studies', pageType: 'case-studies', priority: 0.7, changefreq: 'monthly' },
  { path: '/consultations', pageType: 'consultation', priority: 0.8, changefreq: 'weekly' },
  { path: '/privacy-policy', pageType: 'legal', priority: 0.3, changefreq: 'yearly' },
  { path: '/terms-of-service', pageType: 'legal', priority: 0.3, changefreq: 'yearly' },
];

export async function generateSitemap(baseUrl: string): Promise<string> {
  const { data: config } = await supabase
    .from('sitemap_config')
    .select('*')
    .eq('excluded', false);

  const configMap = new Map(config?.map(c => [c.url, c]) || []);
  
  const entries = APP_ROUTES.map(route => {
    const url = `${baseUrl}${route.path}`;
    const custom = configMap.get(url);
    return {
      url,
      priority: custom?.priority ?? route.priority,
      changefreq: custom?.changefreq ?? route.changefreq,
      lastmod: new Date().toISOString().split('T')[0]
    };
  });

  // Get blog posts from database
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at, featured_image')
    .eq('is_published', true)
    .order('published_date', { ascending: false });

  // Get blog config
  const blogConfig = configMap.get('blog') || { priority: 0.65, changefreq: 'daily', includeImages: true };

  // Add blog post entries
  if (blogPosts && blogPosts.length > 0) {
    blogPosts.forEach(post => {
      entries.push({
        url: `${baseUrl}/blog/${post.slug}`,
        priority: blogConfig.priority || 0.65,
        changefreq: blogConfig.changefreq || 'daily',
        lastmod: post.updated_at ? new Date(post.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        image: blogConfig.includeImages ? post.featured_image : undefined
      });
    });
  }

  return generateXML(entries);
}

export async function generateBlogSitemap(baseUrl: string): Promise<string> {
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at, featured_image, title')
    .eq('is_published', true)
    .order('published_date', { ascending: false });

  if (!blogPosts || blogPosts.length === 0) {
    return generateXML([]);
  }

  const entries = blogPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    priority: 0.65,
    changefreq: 'daily',
    lastmod: post.updated_at ? new Date(post.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    image: post.featured_image,
    pageType: 'blog-post'
  }));

  return generateBlogXML(entries);
}

function generateXML(entries: SitemapEntry[]): string {
  const urls = entries.map(e => {
    let urlContent = `  <url>
    <loc>${e.url}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>`;
    
    if (e.image) {
      urlContent += `
    <image:image>
      <image:loc>${e.image}</image:loc>
    </image:image>`;
    }
    
    urlContent += `
  </url>`;
    return urlContent;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;
}

function generateBlogXML(entries: SitemapEntry[]): string {
  return generateXML(entries);
}

export async function generateSitemapIndex(baseUrl: string): Promise<string> {
  const sitemaps = [
    { loc: `${baseUrl}/sitemap.xml`, lastmod: new Date().toISOString().split('T')[0] },
    { loc: `${baseUrl}/sitemap-blog.xml`, lastmod: new Date().toISOString().split('T')[0] }
  ];

  const sitemapEntries = sitemaps.map(s => 
    `  <sitemap>
    <loc>${s.loc}</loc>
    <lastmod>${s.lastmod}</lastmod>
  </sitemap>`
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;
}
