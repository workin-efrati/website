import HeaderPlaceholder from '@/components/header-placeholder';
import ResultQuestions from '@/components/result-questions';
import ResultQuestionsSkeleton from '@/components/result-questions-skeleton';
import Search from '@/components/search';
import { Metadata } from 'next';
import Image from 'next/image';
import { Suspense } from 'react';


const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

export const metadata: Metadata = {
  title: 'שאלות ותשובות',
  description: 'דף שאלות ותשובות עם אופציה לחיפוש חופשי בנושאי הלכה, אמונה ויהדות.',
  alternates: {
    canonical: `${baseUrl}/qa`, 
  },
  metadataBase: new URL(baseUrl),
};


interface Props {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}

export default async function Qa(props: Props) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <>
      <div className="relative flex flex-col h-[40vh]">
        <Image
          src={'/2.webp'}
          alt={'people learning'}
          fill
          sizes="(min-width:1024px) 1200px, (min-width:640px) 800px, 600px"
          className="object-cover object-center opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-blue-900/80 via-blue-800/60 to-transparent" />
        <HeaderPlaceholder />
        <div className="flex justify-center items-center flex-1">
          <h1 className="text-4xl relative z-10 md:text-7xl font-extrabold leading-tight text-white" >
            שאלות ותשובות
          </h1>
        </div>
      </div>
      <div className="container mx-auto px-4 py-6 flex justify-center">
        <Search autoFocus variant='white' placeholder='חפש שאלה...' />
      </div>
      <Suspense key={query + currentPage} fallback={<ResultQuestionsSkeleton />}>
        <ResultQuestions
          currentPage={currentPage}
          query={query}
        />
      </Suspense>
    </>
  )
}
