import React from 'react';

export const getLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  "name": "Hoven Construction Corp.",
  "alternateName": "Hein Hoven Construction",
  "image": "https://d64gsuwffb70l.cloudfront.net/6851e91275b884fa54047eb7_1759425593381_497bd79a.webp",
  "@id": "https://heinhoven.com",
  "url": "https://heinhoven.com",
  "telephone": "+1-310-853-2131",
  "email": "hein@hovenconstruction.com",
  "priceRange": "$$-$$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "641 S Ridgeley Dr",
    "addressLocality": "Los Angeles",
    "addressRegion": "CA",
    "postalCode": "90036",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 34.0622,
    "longitude": -118.3437
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Los Angeles",
      "containedInPlace": {
        "@type": "State",
        "name": "California"
      }
    },
    {
      "@type": "City",
      "name": "Beverly Hills"
    },
    {
      "@type": "City",
      "name": "Santa Monica"
    }
  ],
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "09:00",
      "closes": "16:00"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "500",
    "bestRating": "5"
  },
  "sameAs": [
    "https://facebook.com/hovenconstruction",
    "https://instagram.com/hovenconstruction",
    "https://linkedin.com/company/hovenconstruction"
  ]
});


export const getServiceSchema = (serviceName: string, description: string, price?: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": serviceName,
  "provider": {
    "@type": "GeneralContractor",
    "name": "Hoven Construction Corp.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "641 S Ridgeley Dr",
      "addressLocality": "Los Angeles",
      "addressRegion": "CA",
      "postalCode": "90036",
      "addressCountry": "US"
    },
    "telephone": "+1-310-853-2131",
    "url": "https://heinhoven.com"
  },
  "areaServed": {
    "@type": "City",
    "name": "Los Angeles",
    "state": "CA"
  },
  "description": description,
  ...(price && { "offers": { "@type": "Offer", "price": price, "priceCurrency": "USD" } })
});

export const getFAQSchema = (faqs: Array<{question: string, answer: string}>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

export const getBreadcrumbSchema = (items: Array<{name: string, url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});


interface StructuredDataProps {
  data: object;
}

const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export default StructuredData;
