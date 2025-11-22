import { IShut } from "@/server/models/shut.model";
import { relatedShuts } from "@/server/services/shut.service";
import QuestionCard from "./question-card";

interface RelatedQuestionsProps {
   _id?: string;
   tag?: string;
   title?: string;
   question?: string;
}

export default async function RelatedQuestions(q: RelatedQuestionsProps) {
   const query = { ...q, tag: q.tag };
   const questions = (await relatedShuts(query)) || [];

   return (
      <section className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col items-center">
         <h3 className="text-4xl font-bold text-(--light-blue) text-center mb-4">
            שאלות קשורות
         </h3>

         <div className="w-3/4 h-[1.5px] bg-(--blue-gradient) hidden md:block mb-6" />

         <div className="flex flex-col gap-6 w-full font-(--font-bona)">
            {questions.map((q: IShut) => (
               <QuestionCard
                  rankTitle="h4"
                  tag={q.tag}
                  key={q._id}
                  question={q.question}
                  id={q._id}
                  title={q.titleQuestion}
               />
            ))}
         </div>
      </section>
   );
}
