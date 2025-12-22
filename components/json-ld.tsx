import Script from 'next/script';

interface JsonLdProps {
   data: Record<string, any>;
   id?: string;
}

/**
 * Component to render JSON-LD structured data
 * Used for SEO to help search engines understand page content
 */
export function JsonLd({ data, id }: JsonLdProps) {
   return (
      <Script
         id={id || `json-ld-${Math.random()}`}
         type="application/ld+json"
         strategy="afterInteractive"
         dangerouslySetInnerHTML={{
            __html: JSON.stringify(data),
         }}
      />
   );
}

/**
 * Creates BreadcrumbList schema for Google Search
 * @param items - Array of breadcrumb items with name and url
 */
export function createBreadcrumbSchema(items: { name: string; url: string }[]) {
   return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
         '@type': 'ListItem',
         position: index + 1,
         name: item.name,
         item: item.url,
      })),
   };
}

/**
 * Creates WebSite schema with search action
 */
export function createWebSiteSchema(baseUrl: string, siteName: string) {
   return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName,
      url: baseUrl,
      potentialAction: {
         '@type': 'SearchAction',
         target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/qa?query={search_term_string}`,
         },
         'query-input': 'required name=search_term_string',
      },
   };
}

/**
 * Creates Organization schema
 */
export function createOrganizationSchema(baseUrl: string) {
   return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'למדני חוקך',
      url: baseUrl,
      logo: `${baseUrl}/icon-512.png`,
      founder: {
         '@type': 'Person',
         name: 'הרב ברוך אפרתי',
      },
      contactPoint: {
         '@type': 'ContactPoint',
         contactType: 'Customer Service',
         availableLanguage: ['Hebrew'],
      },
   };
}
