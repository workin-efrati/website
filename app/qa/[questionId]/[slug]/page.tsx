import HeaderPlaceholder from "@/components/header-placeholder";
import QuickShare from "@/components/quick-share";
import RelatedQuestions from "@/components/related-question";
import { Badge } from "@/components/ui/badge";
import { baseUrl, cleanSlug } from "@/lib/utils";
import { connectToMongodb } from "@/server/connect";
import { readAllShutService, readOneShutWithPopulateService } from "@/server/services/shut.service";
import { Tags } from "lucide-react";
import mongoose from "mongoose";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";

interface QuestionPageProps {
   params: Promise<{ questionId: string }>;
}

export const generateStaticParams = async () => {
   await connectToMongodb();
   const res = await readAllShutService();
   // console.log(res.length)
   if (process.env.NEXT_PUBLIC_DEV === 'true')
      return res.slice(0, 10).map((question: any) => ({ questionId: question._id.toString(), slug: cleanSlug(question.titleQuestion || 'שאלה') }));
   else
      return res.map((question: any) => ({ questionId: question._id.toString(), slug: cleanSlug(question.titleQuestion || 'שאלה') }));
};

export async function generateMetadata({ params }: QuestionPageProps): Promise<Metadata> {
   await connectToMongodb();
   const { questionId } = await params
   if (!mongoose.Types.ObjectId.isValid(questionId)) return {}

   const data = await readOneShutWithPopulateService({ _id: questionId });
   if (!data) return {}

   const canonicalUrl = `${baseUrl}/qa/${questionId}`;

   return {
      title: data?.titleQuestion || `תשובה בנושא ${data?.tag || 'כללי'}`,
      description: (data.question || data.titleStatment || '').replace(/\n+/g, ' '),
      authors: [{ name: "הרב ברוך אפרתי" }],
      alternates: {
         canonical: canonicalUrl
      },
      metadataBase: new URL(baseUrl),
   };
}

export default async function QuestionPage({ params }: QuestionPageProps) {
   await connectToMongodb();
   const { questionId } = await params
   if (!mongoose.Types.ObjectId.isValid(questionId))
      return notFound()

   const question = await readOneShutWithPopulateService({ _id: questionId });

   if (!question)
      return notFound()

   return (
      <>
         <Script id={`qa-${question._id}`} type="application/ld+json" strategy="afterInteractive">
            {JSON.stringify({
               "@context": "https://schema.org",
               "@type": "QAPage",
               "mainEntity": {
                  "@type": "Question",
                  "name": question.titleQuestion,
                  "text": question.question,
                  "answerCount": 1,
                  "dateCreated": question.createdAt,
                  "acceptedAnswer": {
                     "@type": "Answer",
                     "text": question.answer,
                     "dateCreated": question.updatedAt,
                     "author": { "@type": "Person", "name": "הרב אפרתי" }
                  }
               }
            })}
         </Script>
         <div className="relative flex flex-col h-[40vh]">
            <Image
               src={'/2.webp'}
               alt={'people learning'}
               fill
               fetchPriority="high"
               sizes="(min-width:1024px) 1200px, (min-width:640px) 800px, 600px"
               className="object-cover object-top opacity-80"
               priority
            />
            <div className="absolute inset-0 bg-linear-to-r from-primary/90 via-primary/70 to-primary/60" />
            <HeaderPlaceholder />
            <div className="flex justify-center items-center flex-1 px-4 text-center">
               <h1 className="text-3xl relative z-10 md:text-7xl font-extrabold leading-tight text-white" >
                  {question.titleQuestion || question?.tag || 'שאלה'}
               </h1>
            </div>
         </div>
         {/* Main Grid */}
         <div className="grid grid-cols-1 md:grid-cols-[6fr_3fr] gap-8 max-w-6xl mx-auto py-8 px-4 md:px-0">
            {/* Left side – main content */}
            <section className="flex flex-col gap-8 md:pr-4">
               {/* Question */}
               <div>
                  <h2 className="text-(--primary-blue) font-bold text-xl mb-2">שאלה</h2>
                  <p className="text-(--txt-color) text-lg whitespace-pre-line leading-relaxed">
                     {question.question}
                  </p>
               </div>

               {/* Tag */}
               <div className="flex flex-wrap justify-center items-center gap-3 border-b border-blue-200 pb-4">
                  {question.tag && <> <Tags size={24} strokeWidth={1.8} className="text-(--primary-blue)" />
                     <Badge className="px-2 py-1 md:px-3 md:text-lg" asChild>
                        <Link href={`/category/${question.tag}`} className="">
                           {question.tag}
                        </Link>
                     </Badge></>}
               </div>

               {/* Answer */}
               <div>
                  <h2 className="text-(--primary-blue) font-bold text-xl mb-2">תשובה</h2>
                  <p className="text-(--txt-color) text-lg whitespace-pre-line leading-relaxed">
                     {question.answer}
                  </p>
               </div>

               {/* Share links */}
               <QuickShare title={question.titleQuestion} url={`${baseUrl}/qa/${question._id}/${cleanSlug(question.titleQuestion || 'שאלה')}`} />
            </section>

            {/* Right side – related questions */}
            <aside className="md:border-r border-blue-200 ">
               <RelatedQuestions
                  question={question.question}
                  tag={question.tag}
               />
            </aside>
         </div>
      </>
   );
}
