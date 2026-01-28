import { connectToMongodb } from "@/server/connect";
import { IShut } from "@/server/models/shut.model";
import genericFilterWithPagination, { GenericFilterOptions } from "@/server/services/shut.generic.service";
import Question from "./question-card";
import Pagination from "./ui/pagination";

interface Props { query: string; currentPage: number, fields: string[], pageLength?: number }

export default async function ResultQuestions({ query, currentPage, fields, pageLength = 24 }: Props) {
   // console.log({tags})

   const fetchDataFromServer = async () => {
      const arrToSearch = query.trim().split(" ");
      const queryObj: GenericFilterOptions = {
         queryFilterType: "$and",
         selector: ["question", "titleQuestion", "titleStatment", 'tag'],
         pages: { pageLocation: currentPage - 1, pageLength: pageLength },
         regFilter: {
            searchType: "$and",
            searchValues: arrToSearch.map((v) => {
               return {
                  fields,
                  value: v,
                  searchType: "$and",
               };
            }),
         },
      };

      await connectToMongodb()

      const result = await genericFilterWithPagination(queryObj)
      return result
   };

   const QuestionsResult = await fetchDataFromServer()
   const { res: questions, totalCount } = QuestionsResult || { res: [], totalCount: 0 };

   // Calculate pagination info
   const startResult = (currentPage - 1) * pageLength + 1;
   const endResult = Math.min(currentPage * pageLength, totalCount);
   const totalPages = Math.ceil(totalCount / pageLength);

   return (
      <section className="container mx-auto px-4 py-4">

         {/* Result count display */}
         <div className="mb-6 text-center">
            <p className="text-gray-600 text-lg">
               {totalCount > 0 ? (
                  <>
                     מציג {startResult}-{endResult} מתוך {totalCount} תוצאות
                  </>
               ) : (
                  <>
                     לא נמצאו תוצאות  {query ? `עבור "${query}"` : null}
                  </>
               )}
            </p>
         </div>


         {/* Questions list */}
         {questions.length > 0 ? (
            <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3 ">
               {questions.map((question: IShut) => (
                  <Question
                     key={question._id}
                     id={question._id}
                     tag={question.tag}
                     question={question.question}
                     title={question.titleQuestion || question.titleStatment || 'שאלה'}
                     answer={question.answer}
                     rankTitle="h2"
                  />
               ))}
            </div>
         ) : query ? (
            <div className="text-center py-12">
               <div className="text-gray-400 text-6xl mb-4">🔍</div>
               <h2 className="text-xl font-semibold text-gray-600 mb-2" >
                  לא נמצאו תוצאות
               </h2>
               <p className="text-gray-500">
                  נסה לשנות את מילות החיפוש או לבדוק את האיות
               </p>
            </div>
         ) : null}

         {/* Pagination */}
         {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
               <Pagination totalPages={totalPages} />
            </div>
         )}
      </section>
   )
}
