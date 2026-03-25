import { connectToMongodb } from "@/server/connect"
import MamarModel from "@/server/models/mamar.model"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { BookOpen } from "lucide-react"

export default async function MamarimByHoliday({ holiday }: { holiday: string }) {
   await connectToMongodb()
   const articles = await MamarModel.find({ tags: { $in: [holiday] } })
   if (!articles.length) return null
   return (
      <div className='container mx-auto py-8 px-4'>
         <h3 className='text-3xl md:text-4xl text-center font-bold text-primary mb-8'>מאמרים ל{holiday}</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
               <Link
                  href={`/maamarim/${article.slug}`}
                  key={article._id}
                  className={cn(
                     "group relative border flex flex-col border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 bg-white overflow-hidden",
                     "hover:border-blue-200 hover:-translate-y-1"
                  )}
               >
                  <div className="flex items-center gap-3 p-4 bg-linear-to-tr h-20 text-white group-hover:from-primary/20 from-primary group-hover:to-primary/10 to-primary/80">
                     <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-primary transition-colors duration-200">
                        <BookOpen className="w-4 h-4 text-primary group-hover:text-white transition-colors duration-200" />
                     </div>
                     <h4 className="flex-1 text-xl font-semibold group-hover:text-primary transition-colors duration-200 leading-tight line-clamp-2">
                        {article.title}
                     </h4>
                  </div>
                  
                  <div className="px-4 pb-4 mt-4 flex-1">
                     {article.author && (
                        <p className="text-gray-600 leading-relaxed text-sm mb-2 font-medium">
                           {article.author}
                        </p>
                     )}
                  </div>
                  
                  <div className="flex items-center text-sm font-medium text-primary group-hover:text-blue-700 pb-6 pr-4">
                     {/* Read more indicator matching question-card flow */}
                  </div>
               </Link>
            ))}
         </div>
      </div>
   )
}