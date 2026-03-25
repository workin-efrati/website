import { connectToMongodb } from "@/server/connect"
import MamarModel from "@/server/models/mamar.model"
import Link from "next/link"
import { Card, CardContent, CardTitle } from "./ui/card"

export default async function MamarimByHoliday({ holiday }: { holiday: string }) {
   await connectToMongodb()
   const articles = await MamarModel.find({ tags: { $in: [holiday] } })
   if (!articles.length) return null
   return (
      <div className='container mx-auto py-8 px-4'>
         <h3 className='text-3xl md:text-4xl text-center font-bold  text-primary mb-8'>מאמרים ל{holiday}</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article) => (
               <Link href={`/maamarim/${article.slug}`} key={article._id}>
                  <Card className="p-4">
                     <CardTitle className="text-xl font-semibold text-center  text-primary">{article.title}</CardTitle>
                  </Card>
               </Link>
            ))}
         </div>
      </div>
   )
}