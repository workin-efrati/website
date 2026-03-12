import HeaderPlaceholder from '@/components/header-placeholder';
import { articles } from '@/lib/data/mamarim';
import { baseUrl } from '@/lib/utils';
import { BookOpen, Calendar, Tag, User } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
   title: 'מאמרים | למדני חוקך',
   description: 'מאמרים תורניים, הלכות, ודברי תורה.',
   alternates: { canonical: '/maamarim' },
   openGraph: {
      type: 'website',
      url: '/maamarim',
      title: 'מאמרים תורניים',
      description: 'מאמרים תורניים, הלכות, ודברי תורה.',
   },
};

const MaamarimPage = () => {
   return (
      <>
         <Script id="breadcrumbs-jsonld" type="application/ld+json" strategy="afterInteractive">
            {JSON.stringify({
               '@context': 'https://schema.org',
               '@type': 'BreadcrumbList',
               itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'דף הבית', item: baseUrl.replace(/\/$/, '') },
                  { '@type': 'ListItem', position: 2, name: 'מאמרים', item: `${baseUrl.replace(/\/$/, '')}/maamarim` },
               ],
            })}
         </Script>
         <HeaderPlaceholder className="bg-primary" />

         {/* Hero Section */}
         <div className="relative flex flex-col h-[40vh]">
            <Image
               src={'/cover3.webp'}
               alt={'harav Efrati'}
               fill
               fetchPriority="high"
               sizes="(min-width:1024px) 1200px, (min-width:640px) 800px, 600px"
               className="object-cover object-top-left opacity-80"
               priority
            />
            <div className="absolute inset-0 bg-linear-to-r from-primary/90 via-primary/70 to-primary/60" />
            <div className="flex justify-center items-center flex-1 px-4 text-center">
               <h1 className="text-3xl relative z-10 md:text-7xl font-extrabold leading-tight text-white" >
                  מאמרים
               </h1>
            </div>
         </div>
         {/* Content Section */}
         < div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 p-6 md:p-8 lg:p-12" dir="rtl" >
            <div className="max-w-5xl mx-auto space-y-6">
               {articles.map((article) => (
                  <Link
                     key={article.id}
                     href={`/maamarim/${article.slug}`}
                     className="bg-white rounded-lg shadow-lg overflow-hidden group block hover:shadow-xl transition-all duration-300 border-r-4 border-blue-600 hover:border-purple-600 cursor-pointer"
                  >
                     <div className="p-6 md:p-8 flex flex-col justify-between">
                        <div>
                           <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors">
                              {article.title}
                           </h2>
                           {article.excerpt && (
                              <p className="text-gray-600 text-lg mb-6 line-clamp-2">
                                 {article.excerpt}
                              </p>
                           )}

                           {article.tags && article.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                 {article.tags.map((tag) => (
                                    <span
                                       key={tag}
                                       className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100"
                                    >
                                       <Tag className="w-3 h-3" />
                                       {tag}
                                    </span>
                                 ))}
                              </div>
                           )}
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 pt-4 border-t border-gray-100">
                           <div className="flex items-center gap-2">
                              <div className="bg-gray-100 p-1.5 rounded-full">
                                 <User className="w-4 h-4 text-gray-600" />
                              </div>
                              <span className="font-medium">{article.author}</span>
                           </div>

                           <div className="flex items-center gap-2">
                              <div className="bg-gray-100 p-1.5 rounded-full">
                                 <Calendar className="w-4 h-4 text-gray-600" />
                              </div>
                              <span className="font-medium">
                                 {new Date(article.publishedAt).toLocaleDateString('he-IL')}
                              </span>
                           </div>
                        </div>
                     </div>
                  </Link>
               ))}

               {articles.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                     <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                     <h3 className="text-xl font-bold text-gray-600 mb-2">אין מאמרים כרגע</h3>
                     <p className="text-gray-500">בדוק שוב בקרוב למאמרים חדשים.</p>
                  </div>
               )}
            </div>
         </div >
      </>
   );
};

export default MaamarimPage;
