import HeaderPlaceholder from "@/components/header-placeholder";
import RelatedQuestions from "@/components/related-question";
import { Badge } from "@/components/ui/badge";
import { connectToMongodb } from "@/server/connect";
import { readAllShutService, readOneShutWithPopulateService } from "@/server/services/shut.service";
import { Tags } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

interface QuestionPageProps {
   params: Promise<{ questionId: string }>;
}

export const generateStaticParams = async () => {
   await connectToMongodb();
   const res = await readAllShutService();
   console.log(res.length)
   return res.map((question: any) => ({ questionId: question._id.toString() }));
};

export async function generateMetadata({ params }: QuestionPageProps): Promise<Metadata> {
   await connectToMongodb();
   const { questionId } = await params
   const data = await readOneShutWithPopulateService({ _id: questionId });
   return {
      //@ts-ignore
      title: data?.titleQuestion || `תשובה בנושא ${data?.tags?.[0]?.name}`,
      description: data?.titleStatment || "שאלות ותשובות עם הרב אפרתי",
   };
}

export default async function QuestionPage({ params }: QuestionPageProps) {

   await connectToMongodb();
   const { questionId } = await params
   const question = await readOneShutWithPopulateService({ _id: questionId });

   console.log(question)

   if (!question) {
      return (
         <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
            לא נמצאה שאלה זו.
         </div>
      );
   }

   return (
      <>
         <div className="relative flex flex-col h-[40vh]">
            <Image
               src={'/hero.png'}
               alt={'people learning'}
               fill
               sizes="(min-width:1024px) 1200px, (min-width:640px) 800px, 600px"
               className="object-cover object-center opacity-80"
               priority
            />
            <div className="absolute inset-0 bg-linear-to-r from-blue-900/80 via-blue-800/60 to-transparent" />
            <HeaderPlaceholder />
            <div className="flex justify-center items-center flex-1">
               <h1 className="text-3xl relative z-10 md:text-7xl font-extrabold leading-tight text-white" >
                  {/* @ts-ignore */}
                  {question.titleQuestion || question?.tags?.[0]?.name || 'שאלה'}
               </h1>
            </div>
         </div>
         {/* Main Grid */}
         <div className="grid grid-cols-1 md:grid-cols-[6fr_3fr] gap-8 max-w-6xl mx-auto py-8 px-4 md:px-0">
            {/* Left side – main content */}
            <section className="flex flex-col gap-8">
               {/* Question */}
               <div>
                  <h3 className="text-(--primary-blue) font-bold text-xl mb-2">שאלה</h3>
                  <p className="text-(--txt-color) text-lg whitespace-pre-line leading-relaxed">
                     {question.question}
                  </p>
               </div>

               {/* Tags */}
               <div className="flex flex-wrap justify-center items-center gap-3 border-b border-blue-200 pb-4">
                  <Tags size={24} strokeWidth={1.8} className="text-(--primary-blue)" />
                  {question.tags?.map((tag: any) => (
                     <Badge className="px-2 py-1 md:px-3 md:text-lg" key={tag._id} asChild>
                        <Link href={`/category/${tag._id}`} className="">
                           {tag.name}
                        </Link>
                     </Badge>
                  ))}
               </div>

               {/* Answer */}
               <div>
                  <h3 className="text-(--primary-blue) font-bold text-xl mb-2">תשובה</h3>
                  <p className="text-(--txt-color) text-lg whitespace-pre-line leading-relaxed">
                     {question.answer}
                  </p>
               </div>

               {/* Share links */}
               <div className="w-full flex justify-center">
                  <div className="w-full max-w-xl">
                     {/* <ShareLinks /> */}
                  </div>
               </div>
            </section>

            {/* Right side – related questions */}
            <aside className="md:border-r border-blue-200 pr-4 md:pr-0 ">
               <RelatedQuestions
                  question={question.question}
                  tags={question.tags?.map((tag: any) => ({
                     // If already has name/_id shape, use as is; otherwise, fallback
                     name: tag.name ?? '',
                     _id: tag._id?.toString?.() ?? tag._id ?? ''
                  }))}
               />
            </aside>
         </div>
      </>
   );
}
