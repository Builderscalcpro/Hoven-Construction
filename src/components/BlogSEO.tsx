import { Helmet } from 'react-helmet-async';
import { BlogPost } from '@/data/blogPosts';

interface BlogSEOProps {
  post: BlogPost;
  url: string;
}

export function BlogSEO({ post, url }: BlogSEOProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.image,
    "datePublished": post.date,
    "dateModified": post.date,
    "author": {
      "@type": "Person",
      "name": post.author.name,
      "jobTitle": post.author.credentials,
      "image": post.author.image,
      "description": post.author.bio
    },
    "publisher": {
      "@type": "Organization",
      "name": "Hoven Construction Corp.",
      "logo": {
        "@type": "ImageObject",
        "url": "https://heinhoven.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "articleSection": post.category,
    "wordCount": post.content.split(/\s+/).length,
    "timeRequired": post.readTime,
    "keywords": post.keywords?.join(', ') || post.category
  };

  return (
    <Helmet>
      <title>{post.title} | Hoven Construction</title>
      <meta name="description" content={post.excerpt} />
      <meta name="keywords" content={post.keywords?.join(', ') || `${post.category}, construction, renovation`} />
      <link rel="canonical" href={url} />
      
      {/* Open Graph */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.excerpt} />
      <meta property="og:image" content={post.image} />
      <meta property="og:url" content={url} />
      <meta property="article:published_time" content={post.date} />
      <meta property="article:author" content={post.author.name} />
      <meta property="article:section" content={post.category} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={post.title} />
      <meta name="twitter:description" content={post.excerpt} />
      <meta name="twitter:image" content={post.image} />
      
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}