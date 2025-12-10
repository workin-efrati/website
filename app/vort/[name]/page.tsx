import BreadcrumbsSimple from '@/components/breadcrumbs-simple';
import HeaderPlaceholder from '@/components/header-placeholder';
import torahBooks from '@/lib/torah_toc.json';
import { baseUrl } from '@/lib/utils';
import { Parsha, TorahBook } from '@/lib/vorts-types';
import { ArrowDown } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import ViewPDF from './view-pdf';

export const findParshaByName = (name: string): Parsha | undefined => {
  for (const book of torahBooks as unknown as TorahBook[]) {
    const foundParsha = book.parashot.find(parsha => parsha.name === name);
    if (foundParsha) return foundParsha;
  }
  return undefined;
};

export const generateStaticParams = async () => {
  const books = torahBooks as unknown as TorahBook[];
  return books.flatMap((b) => b.parashot.map((p) => ({ name: p.name })));
};

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params;
  const decoded = decodeURIComponent(name);
  const parsha = findParshaByName(decoded);
  if (!parsha) return {};

  const canonicalUrl = `${baseUrl}/vort/${decoded}`;
  const articleTitles = (parsha.articles || []).slice(0, 6).map(a => a.title).join(', ');

  return {
    title: `פרשת ${parsha.name} – מאמרים | למדני חוקך`,
    description: articleTitles ? `מאמרים נבחרים על פרשת ${parsha.name}: ${articleTitles}. צפייה נוחה ב-PDF.` : `מאמרים על פרשת ${parsha.name}. צפייה נוחה ב-PDF.`,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title: `פרשת ${parsha.name} – מאמרים`,
      description: articleTitles ? `מאמרים על פרשת ${parsha.name}: ${articleTitles}` : `מאמרים על פרשת ${parsha.name}`,
    },
  };
}

const findSisterParashot = (parsha: string): Parsha[] => {
  const book = torahBooks.find(b => b.parashot.find(p => p.name === parsha));
  if (!book) return [];
  return book.parashot;
};

export default async function ViewPDFPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const decoded = decodeURIComponent(name);

  const parsha = findParshaByName(decoded);

  if (!parsha) {
    return notFound();
  }

  // const sisterParashot = findSisterParashot(decoded);

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', position: 1, name: 'דף הבית', item: (baseUrl || 'http://localhost:3000').replace(/\/$/, '') },
      { '@type': 'ListItem', position: 2, name: 'מאמרים', item: `${(baseUrl || 'http://localhost:3000').replace(/\/$/, '')}/vort` },
      { '@type': 'ListItem', position: 3, name: `פרשת ${parsha.name}`, item: `${(baseUrl || 'http://localhost:3000').replace(/\/$/, '')}/vort/${decoded}` },
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
              { href: `/`, label: 'בית' },
              { href: `/vort`, label: 'מאמרים' },
            ]
          } current={parsha.name} />
          {/* <CarouselNav items={sisterParashot.map(p => ({ label: p.name, href: `/vort/${encodeURIComponent(p.name)}` }))} />  */}
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-slate-900">פרשת {parsha.name}</h1>
          <p className="text-slate-600">צפייה נוחה בקובץ PDF</p>
        </header>

        {parsha.articles && parsha.articles.length > 0 && (
          <section aria-labelledby="toc-heading" className="mb-8">
            <details className="group rounded-xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm">
              <summary className="cursor-pointer list-none px-6 py-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors rounded-xl">
                <div>
                  <h2 id="toc-heading" className="text-lg md:text-xl font-semibold text-slate-800">תוכן עניינים</h2>
                  <p className="text-sm text-slate-500">רשימת המאמרים והעמודים במסמך</p>
                </div>
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold group-open:rotate-180 transition-transform">
                  <ArrowDown />
                </span>
              </summary>

              <div className="px-4 pb-4">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {parsha.articles.map((article, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 hover:shadow-sm hover:border-slate-300 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
                          {index + 1}
                        </span>
                        <span className="font-medium text-slate-800 truncate" title={article.title}>
                          {article.title}
                        </span>
                      </div>
                      <span className="shrink-0 text-xs md:text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                        עמודים {article.start}-{article.end}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </section>
        )}
      </main>

      <section aria-label="PDF Viewer">
        <ViewPDF start={parsha.page_start} end={parsha.page_end} />
      </section>
    </>
  );
}
