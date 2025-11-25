import QuestionCard from '@/components/question-card'
import { readThreeShutsByHolidayService, readThreeShutsByParashaService } from '@/server/services/shut.service'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getCurrentDateInfo } from '../lib/getHolidaysAndParashot'
import { findParshaByName } from './vort/[name]/page'

export const revalidate = 60 * 60

export default async function RelevantQuestions() {

    const { currentParasha, upcomingHoliday, currentHeDate, currentDate } = await getCurrentDateInfo()

    const [parashaQuestions, holidaysQuestions] = await Promise.all([
        currentParasha ? readThreeShutsByParashaService(currentParasha) : null,
        upcomingHoliday ? readThreeShutsByHolidayService(upcomingHoliday) : null
    ])

    const parashaVorts = currentParasha ? findParshaByName(currentParasha) : null


    // console.log(parashaQuestions)
    // console.log(holidaysQuestions)

    return (
        <section className='pb-12 ' >
            <div className='flex flex-col justify-center items-center h-[30vh] bg-primary  text-white px-4 mb-8 relative'>
                <p className='opacity-80 mb-4'>התאריך היום</p>
                <h2 className='text-3xl md:text-5xl  text-center font-bold '>{currentHeDate} - {currentDate}</h2>
            </div>
            <div className='container mx-auto py-8 px-4'>
                {currentParasha &&
                    <>
                        <article>
                            <h3 className='text-3xl md:text-4xl text-center font-bold mb-8'>
                                פרשת השבוע
                                {" "}
                                {currentParasha}
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                {parashaQuestions?.map((shut) => (
                                    <QuestionCard
                                        key={shut._id}
                                        question={shut.question}
                                        answer={shut.answer}
                                        isAnswer={true}
                                        id={shut._id}
                                        rankTitle='h4'
                                        tag={shut.tag}
                                        title={shut.titleQuestion}
                                    />
                                ))}
                            </div>
                        </article>
                        {parashaVorts &&
                            <article className='my-8'>
                                <h3 className='text-3xl md:text-4xl text-center font-bold mb-8 flex items-center gap-4 justify-center'>וורטים לפרשת {currentParasha}
                                    <Link href={`/vort/${currentParasha}`} className='flex items-center gap-2 text-sm'>הצג הכל <ArrowLeft /></Link>
                                </h3>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {parashaVorts.articles.map((article, index) => (
                                        <li key={index}>
                                            <Link
                                                href={`/vort/${currentParasha}/${article.title}`}
                                                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 hover:shadow-sm hover:border-slate-300 transition"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <span className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
                                                        {index + 1}
                                                    </span>
                                                    <span className="font-medium text-slate-800 truncate" title={article.title}>
                                                        {article.title}
                                                    </span>
                                                </div>
                                                <span className="shrink-0 text-xs md:text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                                                    עמודים {article.start}-{article.end}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        }
                    </>
                }
            </div>
            {upcomingHoliday &&
                <article className='bg-slate-50 py-12'>
                    <div className="container mx-auto px-4">
                        <h3 className='text-3xl md:text-4xl text-center font-bold mb-8'>{upcomingHoliday}</h3>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                            {holidaysQuestions?.map((shut) => (
                                <QuestionCard
                                    key={shut._id}
                                    question={shut.question}
                                    answer={shut.answer}
                                    isAnswer={true}
                                    id={shut._id}
                                    rankTitle='h4'
                                    tag={shut.tag}
                                    title={shut.titleQuestion}
                                />
                            ))}
                        </div>
                    </div>
                </article>
            }
        </section>
    )
}
