import HeaderPlaceholder from '@/components/header-placeholder';
// import { torahBooks } from '@/lib/parashot';
import torahBooks from '@/lib/torah_toc.json';
import { Parsha, TorahBook } from '@/lib/vorts-types';
import { BookOpen, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
    title: 'וורטים על פרשיות השבוע | למדני חוקך',
    description: 'וורטים ומאמרים על פרשיות השבוע לפי חומש ופרשה. צפייה נוחה בקבצי PDF. בחר חומש כדי לפתוח את רשימת הפרשות.',
    alternates: { canonical: '/vort' },
    openGraph: {
        type: 'website',
        url: '/vort',
        title: 'וורטים על פרשיות השבוע',
        description: 'קטלוג וורטים ומאמרים על פרשיות השבוע לפי חומש ופרשה.',
    },
};

const TorahParshiot = () => {
    return (
        <>
            <Script id="breadcrumbs-jsonld" type="application/ld+json" strategy="afterInteractive">
                {JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'BreadcrumbList',
                    itemListElement: [
                        { '@type': 'ListItem', position: 1, name: 'דף הבית', item: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '') },
                        { '@type': 'ListItem', position: 2, name: 'וורטים', item: `${(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')}/vort` },
                    ],
                })}
            </Script>
            <div className="relative w-full h-[42vh] md:h-[44vh] lg:h-[52vh] overflow-hidden flex flex-col">
                <Image
                    src="/hero.webp"
                    alt={`רקע אזור הוורטים`}
                    fill
                    sizes="(min-width:1024px) 1200px, (min-width:640px) 800px, 600px"
                    className="object-cover object-center opacity-80"
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-r from-blue-900/80 via-blue-800/60 to-transparent" />
                <HeaderPlaceholder />
                <div className="max-w-4xl m-auto relative z-4 flex-1 flex items-center px-2">
                    <div className="bg-white rounded-lg shadow-xl w-full p-8 mb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <BookOpen className="w-10 h-10 text-blue-600" />
                            <h1 className="text-4xl font-bold text-gray-800">חומשי התורה</h1>
                        </div>
                        <p className="text-gray-600 text-lg">לחץ על חומש כדי לראות את הפרשות</p>
                    </div>
                </div>
            </div>

            <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 p-8" dir="rtl">
                <div className="space-y-4">
                    {torahBooks?.map?.((book: TorahBook, index: number) => (
                        <details
                            key={book.name}
                            className="bg-white rounded-lg shadow-lg overflow-hidden group"
                        >
                            <summary className="cursor-pointer list-none p-6 hover:bg-blue-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                                            {index + 1}
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">{book.name}</h2>
                                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                            {book.parashot.length} פרשות
                                        </span>
                                    </div>
                                    <ChevronDown className="w-6 h-6 text-gray-400 transition-transform group-open:rotate-180" />
                                </div>
                            </summary>

                            <div className="border-t border-gray-200 bg-linear-to-br from-blue-50 to-purple-50">
                                <div className="p-6">
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {book.parashot.map((parsha: Parsha, pIndex: number) => (
                                            <Link
                                                key={pIndex}
                                                href={`/vort/${encodeURIComponent(parsha.name)}`}
                                                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow border-r-4 border-blue-600 hover:border-purple-600 cursor-pointer"
                                            >
                                                <div className="text-sm text-gray-500 mb-1">פרשה {pIndex + 1}</div>
                                                <div className="font-semibold text-gray-800 text-lg">{parsha.name}</div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </details>
                    ))}
                </div>

                {/* <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">סיכום</h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {torahBooks.map((book, index) => (
                                <div key={index} className="text-center p-4 bg-blue-50 rounded-lg">
                                    <div className="text-3xl font-bold text-blue-600 mb-1">
                                        {book.parshiot.length}
                                    </div>
                                    <div className="text-sm text-gray-600">{book.name}</div>
                                </div>
                            ))}
                            <div className="text-center p-4 bg-purple-100 rounded-lg md:col-span-5">
                                <div className="text-3xl font-bold text-purple-600 mb-1">
                                    {torahBooks.reduce((sum, book) => sum + book.parshiot.length, 0)}
                                </div>
                                <div className="text-sm text-gray-600">סה"כ פרשות</div>
                            </div>
                        </div>
                    </div> */}
            </div>
        </>
    );
};

export default TorahParshiot;