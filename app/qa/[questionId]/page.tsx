import { baseUrl, cleanSlug } from "@/lib/utils";
import { connectToMongodb } from "@/server/connect";
import { readOneShutWithPopulateService } from "@/server/services/shut.service";
import mongoose from "mongoose";
import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

interface QuestionPageProps {
   params: Promise<{ questionId: string }>;
}

export async function generateMetadata({ params }: QuestionPageProps): Promise<Metadata> {
   await connectToMongodb();
   const { questionId } = await params
   if (!mongoose.Types.ObjectId.isValid(questionId)) return {}

   const data = await readOneShutWithPopulateService({ _id: questionId });
   if (!data) return {}

   const canonicalUrl = `${baseUrl}/qa/${questionId}/${cleanSlug(data.titleQuestion || 'שאלה')}`;

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

   permanentRedirect(encodeURI(`/qa/${questionId}/${cleanSlug(question.titleQuestion || 'שאלה')}`));
}
