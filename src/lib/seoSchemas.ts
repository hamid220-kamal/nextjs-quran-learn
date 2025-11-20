/**
 * SEO Utilities Library
 * Contains JSON-LD schemas, metadata generators, and SEO helpers
 */

/**
 * Organization Schema for structured data
 * Helps Google understand your website's organization
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'QuranicLearn',
    url: 'https://quraniclearn.com',
    logo: 'https://quraniclearn.com/your-quran-logo.svg',
    description: 'Interactive Quranic learning platform for spiritual growth and understanding.',
    sameAs: [
      'https://www.facebook.com/quraniclearn',
      'https://twitter.com/quraniclearn',
      'https://www.instagram.com/quraniclearn',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@quraniclearn.com',
    },
  };
}

/**
 * Website Schema for search functionality
 * Enables search action in Google search results
 */
export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'QuranicLearn',
    url: 'https://quraniclearn.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://quraniclearn.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * BreadcrumbList Schema for navigation SEO
 * Improves navigation in search results
 */
export function getBreadcrumbSchema(breadcrumbs: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * Article Schema for blog posts and learning content
 * Improves rich snippets in search results
 */
export function getArticleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  author,
  articleBody,
}: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: string;
  articleBody: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image,
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: author,
    },
    articleBody,
  };
}

/**
 * Course Schema for educational content
 * Perfect for Quranic learning platform
 */
export function getCourseSchema({
  name,
  description,
  provider,
  duration,
  level,
  courseCode,
}: {
  name: string;
  description: string;
  provider: string;
  duration: string;
  level: string;
  courseCode: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: provider,
    },
    duration: duration,
    educationLevel: level,
    courseCode,
  };
}

/**
 * FAQPage Schema for FAQ pages
 * Improves rich snippet display in search
 */
export function getFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * LocalBusiness Schema for location-based services
 * Good if you have prayer times tied to locations
 */
export function getLocalBusinessSchema({
  name,
  description,
  address,
  telephone,
  url,
}: {
  name: string;
  description: string;
  address: string;
  telephone: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
    },
    telephone,
    url,
  };
}

/**
 * Event Schema for Islamic events
 * Great for prayer times, Hajj, Ramadan events
 */
export function getEventSchema({
  name,
  description,
  startDate,
  endDate,
  location,
  image,
}: {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  image: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    description,
    startDate,
    endDate,
    location: {
      '@type': 'Place',
      name: location,
    },
    image,
  };
}

/**
 * Video Schema for video content
 * Improves video discovery in search
 */
export function getVideoSchema({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  embedUrl,
}: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string;
  embedUrl: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description,
    thumbnailUrl,
    uploadDate,
    duration,
    embedUrl,
  };
}

/**
 * Aggregate Rating Schema
 * Show ratings and reviews in search results
 */
export function getAggregateRatingSchema({
  ratingValue,
  ratingCount,
  reviewCount,
}: {
  ratingValue: number;
  ratingCount: number;
  reviewCount: number;
}) {
  return {
    '@type': 'AggregateRating',
    ratingValue,
    ratingCount,
    reviewCount,
  };
}

/**
 * Generate JSON-LD script tag as string
 * Ready to be injected into <head>
 */
export function generateJsonLdScript(schema: any): string {
  return JSON.stringify(schema);
}

/**
 * Generate Open Graph meta tags object
 * For social media sharing optimization
 */
export function getOpenGraphTags({
  title,
  description,
  url,
  image,
  type = 'website',
  locale = 'en_US',
}: {
  title: string;
  description: string;
  url: string;
  image: string;
  type?: string;
  locale?: string;
}) {
  return {
    title,
    description,
    url,
    siteName: 'QuranicLearn',
    images: [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
    locale,
    type,
  };
}

/**
 * Generate Twitter Card meta tags
 * For Twitter sharing optimization
 */
export function getTwitterCardTags({
  title,
  description,
  image,
  card = 'summary_large_image',
}: {
  title: string;
  description: string;
  image: string;
  card?: string;
}) {
  return {
    card,
    title,
    description,
    images: [image],
    creator: '@quraniclearn',
    site: '@quraniclearn',
  };
}

/**
 * Generate canonical URL
 * Prevents duplicate content issues
 */
export function getCanonicalUrl(path: string): string {
  const baseUrl = 'https://quraniclearn.com';
  return `${baseUrl}${path}`;
}

/**
 * Generate hreflang tags for multilingual SEO
 * If you support multiple languages
 */
export function getHrefLangTags(path: string, languages: string[] = ['en']) {
  return languages.map((lang) => ({
    rel: 'alternate',
    hrefLang: lang,
    href: `https://quraniclearn.com/${lang}${path}`,
  }));
}

/**
 * Check if content is SEO optimized
 * Run audits on your pages
 */
export function auditPageSEO({
  title,
  description,
  headings,
  images,
  links,
}: {
  title: string;
  description: string;
  headings: string[];
  images: { src: string; alt: string }[];
  links: { href: string; text: string }[];
}): { issues: string[]; score: number } {
  const issues: string[] = [];

  // Check title
  if (!title || title.length < 30 || title.length > 60) {
    issues.push('Title should be 30-60 characters');
  }

  // Check description
  if (!description || description.length < 120 || description.length > 160) {
    issues.push('Meta description should be 120-160 characters');
  }

  // Check headings
  if (!headings.includes('h1') || headings.filter((h) => h === 'h1').length !== 1) {
    issues.push('Page should have exactly one H1 tag');
  }

  // Check images
  images.forEach((img) => {
    if (!img.alt || img.alt.trim().length === 0) {
      issues.push(`Image ${img.src} missing alt text`);
    }
  });

  // Check links
  links.forEach((link) => {
    if (!link.text || link.text.trim().length === 0) {
      issues.push(`Link to ${link.href} missing anchor text`);
    }
  });

  const score = Math.max(0, 100 - issues.length * 10);

  return { issues, score };
}
