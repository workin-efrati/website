import HeaderPlaceholder from '@/components/header-placeholder';
import torahBooks from '@/lib/torah_toc.json';
import { Parsha, TorahBook } from '@/lib/vorts-types';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import ViewPDF from '../view-pdf';
import BreadcrumbsSimple from '@/components/breadcrumbs-simple';

export const findParshaByName = (name: string): Parsha | undefined => {
    for (const book of torahBooks as unknown as TorahBook[]) {
        const foundParsha = book.parashot.find(parsha => parsha.name === name);
        if (foundParsha) return foundParsha;
    }
    return undefined;
};

// export const generateStaticParams = async () => {
//     const books = torahBooks as unknown as TorahBook[];
//     return books.flatMap((b) => b.parashot.map((p) => ({ name: encodeURIComponent(p.name) })));
// };
export async function generateMetadata({ params }: { params: Promise<{ name: string, vort: string }> }): Promise<Metadata> {
  const { name, vort } = await params;
  const decoded = decodeURIComponent(name);
  const decodedVort = decodeURIComponent(vort);

  const parsha = findParshaByName(decoded);
  if (!parsha) return {};

  const article = parsha.articles.find(a => a.title === decodedVort);
  if (!article) return {};

  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
  const canonicalUrl = `${baseUrl}/vort/${encodeURIComponent(decoded)}/${encodeURIComponent(decodedVort)}`;
  const desc = `וורט על פרשת ${parsha.name}: ${article.title}.`;

  return {
    title: `${article.title} – פרשת ${parsha.name} | למדני חוקך`,
    description: desc,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title: `${article.title} – פרשת ${parsha.name}`,
      description: desc,
    },
  };
}

export default async function ViewPDFPage({ params }: { params: Promise<{ name: string, vort: string }> }) {
    const { name, vort } = await params;
    const decoded = decodeURIComponent(name);
    const decodedVort = decodeURIComponent(vort);

    const parsha = findParshaByName(decoded);

    if (!parsha) return notFound();

    const article = parsha.articles.find(a => a.title === decodedVort);

    if (!article) return notFound();

    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            { '@type': 'ListItem', position: 1, name: 'דף הבית', item: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '') },
            { '@type': 'ListItem', position: 2, name: 'וורטים', item: `${(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')}/vort` },
            { '@type': 'ListItem', position: 3, name: `פרשת ${parsha.name}`, item: `${(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')}/vort/${encodeURIComponent(decoded)}` },
        ]
    } as const;

    return (
        <>
            <Script id="breadcrumbs-jsonld" type="application/ld+json" strategy="afterInteractive">
                {JSON.stringify(breadcrumbLd)}
            </Script>
            <HeaderPlaceholder />
            <main className="container mx-auto px-4" dir="rtl">
                <header className="my-6 text-center">
                  <BreadcrumbsSimple links={
                    [
                        { href: `/vort`, label: 'וורטים' },
                        { href: `/vort/${encodeURIComponent(decoded)}`, label: `פרשת ${parsha.name}` },
                    ]
                  } current={article?.title} />
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-slate-900">{article?.title}</h1>
                </header>
            </main>
            <section aria-label="PDF Viewer">
                <ViewPDF start={article?.start} end={article?.end} />
            </section>
        </>
    );
}
