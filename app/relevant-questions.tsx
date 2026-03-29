import QuestionCard from '@/components/question-card'
import ZmanimWidget from '@/components/zmanim-widget'
import { readThreeShutsByHolidayService } from '@/server/services/shut.service'
import { ArrowLeft } from 'lucide-react'
import { unstable_cache } from 'next/cache'
import Link from 'next/link'
import { getCurrentDateInfo } from '../lib/getHolidaysAndParashot'
import { findParshaByName } from './vort/[name]/page'
import MamarimByHoliday from '@/components/mamarim-by-holiday'

// Cache the data fetching functions
const getCachedDateInfo = unstable_cache(
    async () => getCurrentDateInfo(),
    ['date-info'],
    {
        revalidate: 60 * 60, // 1 hour
        tags: ['date-info']
    }
)

const _getCachedHolidayQuestions = (holiday: string) =>
    unstable_cache(
        async () => readThreeShutsByHolidayService(holiday),
        ['holiday-questions', encodeURIComponent(holiday)],
        {
            revalidate: 60 * 60,
            tags: ['holiday-questions']
        }
    )()

const getCachedHolidayQuestions = (holiday: string) =>
    _getCachedHolidayQuestions(holiday)

export default async function RelevantQuestions() {
    const { currentParasha, upcomingHoliday, currentHeDate, currentDate } =
        await getCachedDateInfo()

    console.log(upcomingHoliday)

    const holidaysQuestions = upcomingHoliday
        ? await getCachedHolidayQuestions(upcomingHoliday)
        : null

    const parashaVorts = currentParasha ? findParshaByName(currentParasha) : null

    return (
        <section className='pb-12 mt-4' >
            <div className='flex flex-col py-12 justify-center items-center min-h-[30vh] bg-primary  text-white px-4 mb-8 relative'>
                <p className='opacity-80 mb-4'>התאריך היום</p>
                <h2 className='text-3xl md:text-5xl mb-8 text-center font-bold'>{currentHeDate} - {currentDate}</h2>
                <ZmanimWidget />
            </div>
            <div className='container mx-auto py-8 px-4'>
                {currentParasha &&
                    <article className='flex flex-col items-center justify-center my-8'>
                        <p className='text-sm opacity-80 mb-2'> פרשת השבוע</p>
                        <h2 className='text-3xl md:text-6xl text-center font-bold mb-8 text-primary'>
                            {currentParasha}
                        </h2>
                        {parashaVorts &&
                            <>
                                <h3 className='text-3xl text-center font-bold mb-8 flex items-center gap-4 justify-center'>מאמרים לפרשת השבוע
                                    <Link href={`/vort/${currentParasha}`} className='flex hidden md:flex items-center gap-2 text-sm'>הצג הכל <ArrowLeft /></Link>
                                </h3>
                                <ul className="grid grid-cols-1 gap-2 w-full">
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
                                                    {article.end - article.start + 1}
                                                    {' '}
                                                    עמודים
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        }
                    </article>}
            </div>
            {upcomingHoliday &&
                <article className='bg-slate-50 py-12'>
                    <div className="container mx-auto px-4">
                        <p className='text-center text-sm opacity-80 mb-2'>החג הקרוב</p>
                        <h3 className='text-4xl md:text-5xl text-center font-bold  text-primary'>{upcomingHoliday}</h3>
                        <article className='bg-slate-50 py-12'>
                            <MamarimByHoliday holiday={upcomingHoliday} />
                            <hr />
                        </article>
                        {holidaysQuestions?.length && holidaysQuestions.length > 0 ?
                            <>
                                <h3 className='text-3xl md:text-4xl text-center font-bold text-primary mb-8'>שו"ת</h3>
                                <div className='grid grid-cols-1 mt-8 md:grid-cols-3 gap-4'>

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
                                </div></> : ''}

                    </div>
                </article>
            }
            {/* {upcomingHoliday && <MamarimByHoliday holiday={upcomingHoliday} />} */}
        </section>
    )
}
