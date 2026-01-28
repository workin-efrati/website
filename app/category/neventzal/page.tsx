import { JsonLd, createBreadcrumbSchema } from "@/components/json-ld";
import ResultQuestionsFilter from "@/components/result-questions-filter";
import ResultQuestionsSkeleton from "@/components/result-questions-skeleton";
import { favoriteTags } from "@/lib/favorite-tags-list";
import { baseUrl } from "@/lib/utils";
import { connectToMongodb } from "@/server/connect";
import Image from "next/image";
import { Suspense } from "react";

interface PageProps {
   params: Promise<{ category: string }>;
   searchParams?: Promise<{
      page?: string;
   }>;
}

export const generateMetadata = async () => {
   return {
      title: "הרב נבנצאל",
      description: `שאלות ותשובות של הרב נבנצאל`,
      alternates: {
         canonical: `${baseUrl}/category/neventzal`,
      },
      authors: [{ name: "הרב אפרתי" }],
   };
}

export default async function Page({ params, searchParams }: PageProps) {
   await connectToMongodb();
   let { category } = await params;
   category = decodeURIComponent(category);
   const searchParamsObj = await searchParams;
   const query = "נבנצאל|נבנצל";
   const currentPage = Number(searchParamsObj?.page) || 1;
   const bgSrc = favoriteTags.find((t) => t.name === category)?.image || '/2.webp'

   // Build breadcrumb schema
   const breadcrumbItems = [
      { name: 'דף הבית', url: baseUrl },
      { name: 'שאלות ותשובות', url: `${baseUrl}/qa` },
      {
         name: 'הרב נבנצאל',
         url: `${baseUrl}/category/neventzal`,
      },
   ];

   return (
      <>
         {/* Breadcrumb Structured Data */}
         <JsonLd
            id={`breadcrumb-${category}`}
            data={createBreadcrumbSchema(breadcrumbItems)}
         />

         <header className="relative w-full h-[60vh] md:h-[64vh] lg:h-[72vh] overflow-hidden">{/* content */}
            <div className="absolute inset-0 -z-10">
               <Image
                  src={bgSrc}
                  alt={`background of ${category}`}
                  fill
                  sizes="(min-width:1024px) 1200px, (min-width:640px) 800px, 600px"
                  className="object-cover object-center opacity-80"
                  priority
               />
               <div className="absolute inset-0 bg-linear-to-r from-primary/80 via-primary/70 to-primary/40" />
            </div>
            <div className="h-20"></div>
            {/* content */}
            <div className="relative z-10 max-w-5xl mx-auto h-[calc(100%-80px)] px-4 flex flex-col justify-center items-center text-center text-white">
               {/* title */}
               <h1 className="text-4xl md:text-7xl font-extrabold leading-tight" >
                  הרב נבנצאל
               </h1>
            </div>
         </header>

         <Suspense key={query + currentPage} fallback={<ResultQuestionsSkeleton />}>
            <ResultQuestionsFilter
               currentPage={currentPage}
               query={query}
               fields={['answer', 'question']}
            />
         </Suspense>
      </>
   );
}
