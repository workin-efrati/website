import ResultQuestions from "@/components/result-questions";
import ResultQuestionsSkeleton from "@/components/result-questions-skeleton";
import Search from "@/components/search";
import { Badge } from "@/components/ui/badge";
import { favoriteTags } from "@/lib/favorite-tags-list";
import { findDirectChildrenByPath, findNodeKeysByPath, findParentsByKey } from "@/lib/getTags";
import tagsLeavesToAncestors from "@/lib/tags_leaves_to_ancestors.json";
import { baseUrl } from "@/lib/utils";
import { connectToMongodb } from "@/server/connect";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

interface PageProps {
   params: Promise<{ category: string }>;
   searchParams?: Promise<{
      query?: string;
      page?: string;
   }>;
}

export const generateStaticParams = async () => {
   return favoriteTags.map((t) => ({ category: t.name }));
}

export const generateMetadata = async ({ params }: { params: { category: string } }) => {
   const category = decodeURIComponent(params.category);
   return {
      title: category,
      description: `שאלות בנושא ${category}`,
      alternates: {
         canonical: `${baseUrl}/category/${category}`,
      },
      authors: [{ name: "הרב אפרתי" }],
   };
}

export default async function Page({ params, searchParams }: PageProps) {
   await connectToMongodb();
   let { category } = await params;
   category = decodeURIComponent(category);
   const searchParamsObj = await searchParams;
   const query = searchParamsObj?.query || '';
   const currentPage = Number(searchParamsObj?.page) || 1;

   const dataParents = tagsLeavesToAncestors as Record<string, string[]>;
   const parents: string[] = dataParents[category] || findParentsByKey(category) || [];
   const children = Array.from(new Set(findNodeKeysByPath([...parents, category])))
   const directChildren = findDirectChildrenByPath([...parents, category])

   // console.log({ parents, children })
   // console.log({ directChildren, parents })

   if (!parents.length && !children.length) {
      return (
         <main className="min-h-screen flex items-center justify-center p-6">
            <div className="text-center">
               <h1 className="text-2xl font-semibold">קטגוריה לא נמצאה</h1>
               <p className="mt-2  text-muted-foreground">אולי הוסרה או id לא תקין</p>
            </div>
         </main>
      );
   }

   const bgSrc = favoriteTags.find((t) => t.name === category)?.image || '/2.webp'

   return (
      <>
         <header className="relative w-full h-[60vh] md:h-[64vh] lg:h-[72vh] overflow-hidden">
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

            {/* content */}
            <div className="relative z-10 max-w-5xl mx-auto h-full px-4 flex flex-col justify-center items-center text-center text-white">
               <nav aria-label="breadcrumb" className="mb-4 text-sm opacity-90">
                  <ol className="inline-flex items-center gap-2">
                     {parents.map((p, idx) => (
                        <li key={p} className="flex items-center ">
                           <Link href={`/category/${p}`} className="hover:text-blue-200">
                              {p}
                           </Link>
                           <span className="mx-2 text-xs">›</span>
                        </li>
                     ))}
                  </ol>
               </nav>

               {/* title */}
               <h1 className="text-4xl md:text-7xl font-extrabold leading-tight" >
                  {category}
               </h1>

               {/* children tags */}
               {children.length > 0 && (
                  <div className="mt-6 w-full px-2">
                     <div className="flex flex-wrap justify-center gap-3">
                        {directChildren.map((c) => (
                           <Badge className="px-2 py-1 md:px-3 text-sm md:text-xl" key={c} asChild>
                              <Link href={`/category/${c}`} className="">
                                 {c}
                              </Link>
                           </Badge>
                        ))}
                     </div>
                  </div>
               )}
            </div>
         </header>
         <div className="container mx-auto px-4 py-6 flex justify-center">
            <Search variant='white' placeholder='חפש שאלה...' />
         </div>
         <Suspense key={query + currentPage} fallback={<ResultQuestionsSkeleton />}>
            <ResultQuestions
               currentPage={currentPage}
               query={query}
               category={category}
               tags={[...children, category]}
            />
         </Suspense>
      </>
   );
}
