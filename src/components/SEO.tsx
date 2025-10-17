import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string;
  schema?: object;
  images?: Array<{
    url: string;
    alt: string;
    width: number;
    height: number;
    caption?: string;
  }>;
}

export const SEO = ({
  title,
  description,
  canonical,
  ogImage = '/og-image.jpg',
  ogType = 'website',
  keywords = 'construction, home renovation, remodeling, contractor',
  schema,
  images = []
}: SEOProps) => {
  const siteUrl = import.meta.env.VITE_APP_DOMAIN 
    ? `https://${import.meta.env.VITE_APP_DOMAIN}` 
    : 'https://heinhoven.com';
  const siteName = import.meta.env.VITE_APP_NAME || 'Hoven Construction Corp.';
  const fullTitle = `${title} | ${siteName}`;


  const canonicalUrl = canonical || window.location.href;

  // Generate ImageObject schema for all images
  const imageSchemas = images.map(img => ({
    "@type": "ImageObject",
    "@id": img.url,
    "url": img.url,
    "contentUrl": img.url,
    "name": img.alt,
    "description": img.caption || img.alt,
    "width": img.width,
    "height": img.height,
    "encodingFormat": img.url.endsWith('.webp') ? 'image/webp' : 'image/jpeg'
  }));

  // Combine custom schema with image schemas
  const combinedSchema = schema || imageSchemas.length > 0 ? {
    "@context": "https://schema.org",
    "@graph": [
      ...(schema ? [schema] : []),
      ...imageSchemas
    ]
  } : null;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* Schema.org JSON-LD */}
      {combinedSchema && (
        <script type="application/ld+json">
          {JSON.stringify(combinedSchema)}
        </script>
      )}
    </Helmet>
  );
};

