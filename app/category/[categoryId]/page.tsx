// app/category/[categoryId]/page.tsx
import Image from "next/image";
import Link from "next/link";
// import TagCategory from "@/components/TagCategory";
// import SearchQuestions from "@/components/SearchQuestions";
import ResultQuestions from "@/components/result-questions";
import Search from "@/components/search";
import { Badge } from "@/components/ui/badge";
import { connectToMongodb } from "@/server/connect";
import { CategoryFamilyResult, familyOfCategoryService } from "@/server/services/tags.service";
import { Suspense } from "react";

interface PageProps {
   params: Promise<{ categoryId: string }>;
   searchParams?: Promise<{
      query?: string;
      page?: string;
   }>;
}

export default async function Page({ params, searchParams }: PageProps) {
   await connectToMongodb();
   const { categoryId } = await params;
   const searchParamsObj = await searchParams;
   const query = searchParamsObj?.query || '';
   const currentPage = Number(searchParamsObj?.page) || 1;

   const categoryData = (await familyOfCategoryService({ _id: categoryId })) as CategoryFamilyResult;
   const { categoryObject, parents = [], children = [] } = categoryData || {};

   if (!categoryObject) {
      return (
         <main className="min-h-screen flex items-center justify-center p-6">
            <div className="text-center">
               <h1 className="text-2xl font-semibold">קטגוריה לא נמצאה</h1>
               <p className="mt-2 text-sm text-muted-foreground">אולי הוסרה או id לא תקין</p>
            </div>
         </main>
      );
   }

   // breadcrumb should go from top-level -> current
   const breadcrumb = [...parents].reverse();

   const bgSrc = categoryObject.coverImage || categoryObject.topicImages?.[0] || "/images/image.png";

   return (
      <>
         <header className="relative w-full h-[60vh] md:h-[64vh] lg:h-[72vh] overflow-hidden">
            {/* background image */}
            <div className="absolute inset-0 -z-10">
               <Image
                  src={bgSrc}
                  alt={categoryObject.name}
                  fill
                  sizes="(min-width:1024px) 1200px, (min-width:640px) 800px, 600px"
                  className="object-cover object-center opacity-80"
                  priority
               />
               {/* overlay gradient to improve text contrast */}
               <div className="absolute inset-0 bg-linear-to-r from-blue-900/80 via-blue-800/60 to-transparent" />
            </div>

            {/* content */}
            <div className="relative z-10 max-w-5xl mx-auto h-full px-4 flex flex-col justify-center items-center text-center text-white">
               {/* <nav aria-label="breadcrumb" className="mb-4 text-sm opacity-90">
                  <ol className="inline-flex items-center gap-2">
                     {breadcrumb.map((p, idx) => (
                        <li key={p._id} className="flex items-center text-sm">
                           <Link href={`/category/${p._id}`} className="hover:text-blue-200">
                              {p.name}
                           </Link>
                           <span className="mx-2 text-xs">›</span>
                        </li>
                     ))}
                     <li className="text-sm font-medium">{categoryObject.name}</li>
                  </ol>
               </nav> */}

               {/* title */}
               <h1 className="text-4xl md:text-7xl font-extrabold leading-tight" >
                  {categoryObject.name}
               </h1>

               {/* children tags */}
               {children.length > 0 && (
                  <div className="mt-6 w-full px-2">
                     <div className="flex flex-wrap justify-center gap-3">
                        {children.map((c) => (
                           <Badge className="px-2 py-1 md:px-3 md:text-lg" key={c._id} asChild>
                              <Link href={`/category/${c._id}`} className="">
                                 {c.name}
                              </Link>
                           </Badge>
                        ))}
                     </div>
                  </div>
               )}
            </div>
         </header>

         <main className="max-w-5xl mx-auto px-4 py-8">
            {/* Optional description - uncomment if you want to show it */}
            {/* {categoryObject.description && (
          <p className="mb-6 text-base text-muted-foreground">{categoryObject.description}</p>
        )} */}

            <div className="container mx-auto px-4 py-6 flex justify-center">
               <Search variant='white' placeholder='חפש שאלה...' />
            </div>
            <Suspense key={query + currentPage} fallback={<> loading... </>}>
               <ResultQuestions
                  currentPage={currentPage}
                  query={query}
                  categoryId={categoryId}
               />
            </Suspense>
         </main>
      </>
   );
}
