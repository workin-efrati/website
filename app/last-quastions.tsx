import Link from "next/link";
import { readLast3ShutsService, relatedShuts } from "@/server/services/shut.service";

export default async function LastQuestions() {
    // Map tags from { name: string }[] to string[] if tags is present
    const questions = (await readLast3ShutsService([{ path:  'tags', select: 'name' }])) || [];

    return (
        <section className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col items-center">
            <h3 className="text-4xl font-bold text-(--light-blue) text-center mb-4">
                שאלות אחרונות
            </h3>

            <div className="w-3/4 h-[1.5px] bg-(--blue-gradient) hidden md:block mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full font-(--font-bona)">
                {questions.map((q) => (
                    <Link
                        key={q._id}
                        href={`/qu/${q._id}`}
                        className="group relative block p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 bg-white overflow-hidden"
                    >
                        {/* @ts-ignore */}
                        {!q?.titleQuestion && !q.tags?.[0]?.name ? <h4 className="font-bold">שאלה</h4> :
                            <p className="text-(--light-blue) text-xl font-semibold line-clamp-2">
                                {/* @ts-ignore */}
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