import QuestionCard from '@/components/question-card'
import { readThreeShutsByHolidayService, readThreeShutsByParashaService } from '@/server/services/shut.service'
import { getCurrentDateInfo } from '../lib/getHolidaysAndParashot'

export const revalidate = 60 * 60

export default async function RelevantQuestions() {

    const { currentParasha, upcomingHoliday, currentHeDate, currentDate } = await getCurrentDateInfo()

    const [parashaQuestions, holidaysQuestions] = await Promise.all([
        currentParasha ? readThreeShutsByParashaService(currentParasha) : null,
        upcomingHoliday ? readThreeShutsByHolidayService(upcomingHoliday) : null
    ])

    // console.log(parashaQuestions)
    // console.log(holidaysQuestions)

    return (
        <section className='pb-12' >
            <div className='flex justify-center items-center h-[30vh] bg-primary/50 text-white px-4 mb-8'>
                <h2 className='text-3xl md:text-5xl  text-center font-bold '>{currentHeDate} - {currentDate}</h2>
            </div>
            <div className='container mx-auto  px-4'>
                {currentParasha && <article>
                    <h3 className='text-3xl md:text-4xl text-center font-bold mb-8'>
                        פרשת
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
                </article>}
                {upcomingHoliday &&
                    <article>
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
                    </article>
                }
            </div>
        </section>
    )
}
