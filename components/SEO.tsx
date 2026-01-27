import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  structuredData?: object;
}

const defaultSEO = {
  title: 'ScholarXafrica | Academic Projects & Software Development Services in Zimbabwe',
  description: 'Leading academic project assistance and custom software development in Zimbabwe. Get ready-made or custom projects in Data Science, Machine Learning, Web Development, IoT & Software Engineering. Fast delivery, plagiarism-free work.',
  keywords: 'academic projects Zimbabwe, software development Zimbabwe, data science projects, machine learning projects, web development Harare, IoT projects Zimbabwe, custom software Zimbabwe, student projects, final year projects Zimbabwe, Harare software developer, Zimbabwe tech services',
  ogImage: 'https://scholarxafrica.com/scholarxafrica-logo.png',
  siteName: 'ScholarXafrica',
  url: 'https://scholarxafrica.com'
};

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  structuredData
}) => {
  const fullTitle = title ? `${title} | ScholarXafrica` : defaultSEO.title;
  const metaDescription = description || defaultSEO.description;
  const metaKeywords = keywords || defaultSEO.keywords;
  const canonical = canonicalUrl || defaultSEO.url;
  const image = ogImage || defaultSEO.ogImage;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={defaultSEO.siteName} />
      <meta property="og:locale" content="en_ZW" />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

// Structured data templates for Zimbabwe-focused services
export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ScholarXafrica",
  "url": "https://scholarxafrica.com",
  "logo": "https://scholarxafrica.com/scholarxafrica-logo.png",
  "description": "Academic projects and custom software development services in Zimbabwe",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "ZW",
    "addressLocality": "Zimbabwe"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Zimbabwe"
  },
  "sameAs": [
    "https://www.facebook.com/scholarxafrica",
    "https://twitter.com/scholarxafrica",
    "https://www.linkedin.com/company/scholarxafrica"
  ]
};

export const localBusinessStructuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "ScholarXafrica",
  "image": "https://scholarxafrica.com/scholarxafrica-logo.png",
  "@id": "https://scholarxafrica.com",
  "url": "https://scholarxafrica.com",
  "telephone": "+263-XXX-XXXXX",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "ZW",
    "addressLocality": "Zimbabwe"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -17.8252,
    "longitude": 31.0335
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ],
    "opens": "00:00",
    "closes": "23:59"
  },
  "sameAs": [
    "https://www.facebook.com/scholarxafrica",
    "https://twitter.com/scholarxafrica"
  ]
};

export const servicesStructuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Academic Projects and Software Development",
  "provider": {
    "@type": "Organization",
    "name": "ScholarXafrica"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Zimbabwe"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Academic and Software Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Data Science Projects",
          "description": "Custom and ready-made data science projects for academic purposes"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Machine Learning Projects",
          "description": "ML projects with implementation and documentation"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Web Development",
          "description": "Custom web applications and websites"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "IoT Projects",
          "description": "Internet of Things projects and solutions"
        }
      }
    ]
  }
};

export const breadcrumbStructuredData = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});
