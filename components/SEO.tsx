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
  title: 'ScholarXafrica | Research Papers & Academic Projects Zimbabwe — All Disciplines',
  description: 'Zimbabwe\'s trusted academic research service. Turnitin-checked, plagiarism-free research papers, dissertations, proposals, and projects across all disciplines — Humanities, Sciences, Engineering, Business, Law, Medicine. AI content removal included.',
  keywords: 'research papers Zimbabwe, dissertation help Zimbabwe, thesis writing, academic writing, Turnitin check, AI content removal, plagiarism-free, literature review, data analysis, SPSS, essay writing, all academic subjects, student assignments, coursework help, research proposals, academic projects',
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
  "description": "Research papers, dissertations, theses, proposals, and academic projects across all disciplines. Turnitin-checked, plagiarism-free, AI-free. Serving students across Zimbabwe.",
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
  "telephone": "+26784286089",
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
    "name": "Academic Research and Project Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Research Paper Writing",
          "description": "Research papers, essays, and academic writing across all disciplines with proper referencing"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Dissertation & Thesis Support",
          "description": "Full dissertation and thesis writing from proposal to final chapter"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Turnitin Plagiarism Checking",
          "description": "Academic similarity detection and plagiarism checking using Turnitin"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "AI Content Detection & Removal",
          "description": "Identify and rewrite AI-generated content to pass all major AI detectors"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Data Analysis & Statistics",
          "description": "SPSS, Stata, R, Python analysis with interpretation and visualization"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Software & Engineering Projects",
          "description": "Custom and ready-made software, IoT, and engineering projects"
        }
      }
    ]
  }
};

export const faqStructuredData = (faqs: { question: string; answer: string }[]) => ({
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
