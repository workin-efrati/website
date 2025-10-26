import Link from "next/link";
import { relatedShuts } from "@/server/services/shut.service";

interface RelatedQuestionsProps {
   _id?: string;
   tags?: { name: string, _id: string }[];
   title?: string;
   question?: string;
}

export default async function RelatedQuestions(q: RelatedQuestionsProps) {
   // Map tags from { name: string }[] to string[] if tags is present
   const query = { ...q, tags: q.tags?.map((tag) => tag._id) };
   const questions = (await relatedShuts(query)) || []; 

   return (
      <section className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col items-center">
         <h3 className="text-4xl font-bold text-(--light-blue) text-center mb-4">
            שאלות קשורות
         </h3>

         <div className="w-3/4 h-[1.5px] bg-(--blue-gradient) hidden md:block mb-6" />

         <div className="flex flex-col gap-6 w-full font-(--font-bona)">
            {questions.map((q) => (
               <Link
                  key={q._id}
                  href={`/qu/${q._id}`}
                  className="block p-4 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-white"
               >
                  {!q?.titleQuestion && !q.tags?.[0]?.name ? <h4 className="font-bold">שאלה</h4> :
                     <p className="text-(--light-blue) text-xl font-semibold line-clamp-2">
                        {q?.titleQuestion || q.tags?.[0]?.name}
                     </p>}
                  <p className="text-(--txt-color) font-(--font-heebo) mt-2 line-clamp-4">
                     {q?.question}
                  </p>
               </Link>
            ))}
         </div>
      </section>
   );
}
