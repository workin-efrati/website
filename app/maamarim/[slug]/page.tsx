import BreadcrumbsSimple from '@/components/breadcrumbs-simple';
import HeaderPlaceholder from '@/components/header-placeholder';
import QuickShare from '@/components/quick-share';
import { articles, type Section, type Block } from '@/lib/data/mamarim';
import { baseUrl } from '@/lib/utils';
import { connectToMongodb } from '@/server/connect';
import MamarModel from '@/server/models/mamar.model';
import { Calendar, Tag, User } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Script from 'next/script';

export const generateStaticParams = async () => {
   await connectToMongodb();
   const mamarim = await MamarModel.find({ isActive: true });
   return mamarim.map((mamar) => ({ slug: mamar.slug }));
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
   const { slug } = await params;
   await connectToMongodb();
   const article = await MamarModel.findOne({ isActive: true, slug });

   if (!article) return {};

   const canonicalUrl = `${baseUrl}/maamarim/${slug}`;

   return {
      title: `${article.title} | למדני חוקך`,
      description: `מאמר מאת ${article.author}: ${article.title}`,
      alternates: { canonical: canonicalUrl },
      openGraph: {
         type: 'article',
         url: canonicalUrl,
         title: article.title,
         description: `מאמר מאת ${article.author}: ${article.title}`,
         tags: article.tags,
         publishedTime: article.publishedAt,
         authors: [article.author],
      },
   };
}

// Helper to parse *text* into strong tags for SEO and visual emphasis
const renderTextWithBold = (text: string) => {
   if (!text) return text;
   const parts = text.split(/(\*[^*]+\*)/g);
   if (parts.length === 1) return text;

   return parts.map((part, i) => {
      if (part.startsWith('*') && part.endsWith('*')) {
         return <strong key={i} className="font-bold text-gray-900">{part.slice(1, -1)}</strong>;
      }
      return part;
   });
};

// Helper component for section rendering
const ArticleSection = ({ section }: { section: Section }) => {
   return (
      <section className="mb-6">
         <h2 className="font-bold mb-3 text-2xl md:text-3xl text-gray-900 border-b pb-2">
            {section.title}
         </h2>

         <div className="space-y-3 text-gray-800 leading-relaxed text-lg">
            {section.blocks?.map((block: Block, idx: number) => {
               if (block.type === 'paragraph') {
                  return <p key={idx}>{renderTextWithBold(block.text)}</p>;
               }
               if (block.type === 'list') {
                  const ListTag = block.ordered ? 'ol' : 'ul';
                  return (
                     <ListTag key={idx} className={`${block.ordered ? 'list-decimal' : 'list-disc'} list-inside pr-2 md:pr-4 space-y-1.5`}>
                        {block.items.map((item: string, i: number) => (
                           <li key={i}>{renderTextWithBold(item)}</li>
                        ))}
                     </ListTag>
                  );
               }
               if (block.type === 'heading') {
                  return <h3 key={idx} className="font-bold text-xl md:text-2xl text-gray-800 mt-4">{renderTextWithBold(block.text)}</h3>;
               }
               return null;
            })}
         </div>
      </section>
   );
};

export default async function MaamarPage({ params }: { params: Promise<{ slug: string }> }) {
   const { slug } = await params;
   await connectToMongodb();
   const article = await MamarModel.findOne({ isActive: true, slug });

   if (!article) {
      return notFound();
   }

   const breadcrumbLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
         { '@type': 'ListItem', position: 1, name: 'דף הבית', item: (baseUrl || 'http://localhost:3000').replace(/\/$/, '') },
         { '@type': 'ListItem', position: 2, name: 'מאמרים', item: `${(baseUrl || 'http://localhost:3000').replace(/\/$/, '')}/maamarim` },
         { '@type': 'ListItem', position: 3, name: article.title, item: `${(baseUrl || 'http://localhost:3000').replace(/\/$/, '')}/maamarim/${slug}` },
      ]
   } as const;

   return (
      <>
         <Script id="breadcrumbs-jsonld" type="application/ld+json" strategy="afterInteractive">
            {JSON.stringify(breadcrumbLd)}
         </Script>

         {/* Hero Section styled like QA pages */}
         <div className="relative flex flex-col h-[40vh]">
            <Image
               src={'/cover3.webp'} // Can be '/2.webp' to use the kids learning one if you prefer
               alt={'מאמרים'}
               fill
               fetchPriority="high"
               sizes="(min-width:1024px) 1200px, (min-width:640px) 800px, 600px"
               className="object-cover object-top opacity-80"
               priority
            />
            <div className="absolute inset-0 bg-linear-to-r from-primary/90 via-primary/70 to-primary/60" />
            <HeaderPlaceholder />
            <div className="flex justify-center items-center flex-1 px-4 text-center">
               <h1 className="text-3xl relative z-10 md:text-7xl font-extrabold leading-tight text-white">
                  {article.title}
               </h1>
            </div>
         </div>

         {/* Breadcrumbs */}
         <div className="max-w-6xl mx-auto px-4 pt-4">
            <BreadcrumbsSimple links={[
               { href: `/`, label: 'בית' },
               { href: `/maamarim`, label: 'מאמרים' },
            ]} current={article.title} />
         </div>


         {/* Main Content Area */}
         <main className="container mx-auto px-4 py-6 pb-12" >
            <article className="max-w-4xl mx-auto">
               {article.sections.map((section, idx) => (
                  <ArticleSection key={idx} section={section} />
               ))}

               {/* Article Meta Data below breadcrumbs */}
               <div className="max-w-4xl mx-auto px-4 pt-8">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 border-t border-blue-200 pt-4">
                     <div className="flex items-center gap-1.5">
                        <User className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold">{article.author}</span>
                     </div>

                     <div className="flex items-center gap-1.5">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold">
                           {new Date(article.publishedAt).toLocaleDateString('he-IL')}
                        </span>
                     </div>

                     {article.tags && article.tags.length > 0 && (
                        <div className="flex gap-2 mr-auto">
                           {article.tags.map(tag => (
                              <span key={tag} className="inline-flex items-center gap-1 text-sm font-semibold text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
                                 <Tag className="w-3.5 h-3.5" />
                                 {tag}
                              </span>
                           ))}
                        </div>
                     )}
                  </div>
               </div>

               {/* Share action at the very bottom */}
               <div className="pt-6">
                  <QuickShare title={article.title} url={`${baseUrl}/maamarim/${slug}`} />
               </div>
            </article>
         </main>
      </>
   );
}
