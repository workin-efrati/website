import { connectToMongodb } from "@/server/connect";
import { getAllChildTagIdsDeep } from "@/server/controllers/tags.controller";
import genericFilterWithPagination, { GenericFilterOptions } from "@/server/services/shut.generic.service";
import Question from "./question-card";
import Pagination from "./ui/pagination";
import { IShut } from "@/server/models/shut.model";

interface Props { query: string; currentPage: number, categoryId?: string, pageLength?: number }

export default async function ResultQuestions({ query, currentPage, categoryId, pageLength = 24 }: Props) {

   const fetchDataFromServer = async () => {
      const arrToSearch = query.trim().split(" ");
      const queryObj: GenericFilterOptions = {
         queryFilterType: "$and",
         selector: ["question", "titleQuestion", "titleStatment"],
         pages: { pageLocation: currentPage - 1, pageLength: pageLength },
         regFilter: {
            searchType: "$and",
            searchValues: arrToSearch.map((v) => {
               return {
                  fields: ["question"],
                  value: v,
                  searchType: "$and",
               };
            }),
         },
      };

      await connectToMongodb()

      if (categoryId) {
         const tagsIds = await getAllChildTagIdsDeep(categoryId)
         queryObj.includeFilter = {
            searchType: "$or",
            searchValues: [
               {
                  field: "tags",
                  type: "_id",
                  values: tagsIds,
                  searchType: "$or",
               },
            ],
         }
         // console.log(queryObj.includeFilter.searchValues)
      }

      const result = await genericFilterWithPagination(queryObj)
      return result
   };

   const QuestionsResult = await fetchDataFromServer()
   const { res: questions, totalCount } = QuestionsResult || { res: [], totalCount: 0 };

   // console.log(questions)
   
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
                        {query && (
                           <span className="block mt-1 text-sm text-gray-500">
                              עבור: "{query}"
                           </span>
                        )}
                     </>
                  ) : (
                     <>
                        לא נמצאו תוצאות  { query ? `עבור "${query}"`: null}
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
                     question={question.question}
                     title={question.titleQuestion || question.titleStatment || 'שאלה'}
                     answer={question.answer}
                  />
               ))}
            </div>
         ) : query ? (
            <div className="text-center py-12">
               <div className="text-gray-400 text-6xl mb-4">🔍</div>
               <h3 className="text-xl font-semibold text-gray-600 mb-2" >
                  לא נמצאו תוצאות
               </h3>
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
