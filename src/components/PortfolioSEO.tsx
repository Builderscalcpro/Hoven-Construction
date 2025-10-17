import { Helmet } from 'react-helmet-async';

interface PortfolioSEOProps {
  category: 'kitchens' | 'bathrooms' | 'adus' | 'outdoor';
  projects?: Array<{ id: number; title: string; location: string; image: string }>;
}

const categoryData = {
  kitchens: {
    title: 'Kitchen Remodeling Portfolio | Los Angeles',
    description: 'Explore our stunning kitchen remodeling projects across Los Angeles. From Beverly Hills to Santa Monica, see our modern, traditional, and custom kitchen renovations.',
    keywords: 'kitchen remodeling Los Angeles, kitchen renovation Beverly Hills, custom kitchens Santa Monica, modern kitchen design LA, kitchen contractors Pasadena',
    h1: 'Kitchen Remodeling Portfolio'
  },
  bathrooms: {
    title: 'Bathroom Renovation Portfolio | Los Angeles',
    description: 'View our luxury bathroom renovation projects throughout LA. Spa-like retreats, modern designs, and custom bathrooms in Beverly Hills, Santa Monica, and beyond.',
    keywords: 'bathroom remodeling Los Angeles, luxury bathroom renovation Beverly Hills, spa bathroom design LA, modern bathroom contractors Santa Monica',
    h1: 'Bathroom Renovation Portfolio'
  },
  adus: {
    title: 'ADU Construction Portfolio | Los Angeles',
    description: 'See our ADU and guest house projects across Los Angeles. Modern accessory dwelling units, backyard cottages, and basement conversions in Santa Monica, Echo Park, and more.',
    keywords: 'ADU construction Los Angeles, accessory dwelling unit LA, guest house builders Santa Monica, backyard cottage Echo Park, ADU contractors Beverly Hills',
    h1: 'ADU & Guest House Portfolio'
  },
  outdoor: {
    title: 'Outdoor Living Space Portfolio | Los Angeles',
    description: 'Discover our outdoor living projects in LA. Custom decks, pergolas, patios, and outdoor entertainment spaces in Beverly Hills, Santa Monica, and Pasadena.',
    keywords: 'outdoor living spaces Los Angeles, deck builders LA, pergola construction Beverly Hills, patio design Santa Monica, outdoor contractors Pasadena',
    h1: 'Outdoor Living Portfolio'
  }
};

export default function PortfolioSEO({ category, projects = [] }: PortfolioSEOProps) {
  const data = categoryData[category];
  const canonicalUrl = `https://yoursite.com/portfolio/${category}`;
  
  const imageGallerySchema = projects.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": data.h1,
    "description": data.description,
    "image": projects.map(p => ({
      "@type": "ImageObject",
      "url": p.image,
      "name": p.title,
      "contentLocation": p.location
    }))
  } : null;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": "Your Construction Company",
    "image": projects[0]?.image || "",
    "description": data.description,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Los Angeles",
      "addressRegion": "CA",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "34.0522",
      "longitude": "-118.2437"
    },
    "areaServed": ["Los Angeles", "Beverly Hills", "Santa Monica", "Pasadena", "West Hollywood"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": data.h1,
      "itemListElement": projects.map(p => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": p.title,
          "image": p.image,
          "areaServed": p.location
        }
      }))
    }
  };

  return (
    <Helmet>
      <title>{data.title}</title>
      <meta name="description" content={data.description} />
      <meta name="keywords" content={data.keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={data.title} />
      <meta property="og:description" content={data.description} />
      <meta property="og:url" content={canonicalUrl} />
      {projects[0] && <meta property="og:image" content={projects[0].image} />}
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={data.title} />
      <meta name="twitter:description" content={data.description} />
      {projects[0] && <meta name="twitter:image" content={projects[0].image} />}
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
      {imageGallerySchema && (
        <script type="application/ld+json">
          {JSON.stringify(imageGallerySchema)}
        </script>
      )}
    </Helmet>
  );
}
