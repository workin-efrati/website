import QuestionCard from "@/components/question-card";
import { IShut } from "@/server/models/shut.model";
import { readLast3ShutsService } from "@/server/services/shut.service";

export default async function LastQuestions() {
    // Map tags from { name: string }[] to string[] if tags is present
    const questions = (await readLast3ShutsService([{ path: 'tags', select: 'name' }])) || [];

    return (
        <section className="container mx-auto px-4 py-8 flex flex-col items-center">
            <h2 className="text-4xl font-bold text-(--light-blue) text-center mb-4">
                שאלות אחרונות
            </h2>

            <div className="w-3/4 h-[1.5px] bg-(--blue-gradient) hidden md:block mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full font-(--font-bona)">
                {questions.map((q: IShut) => (
                    <QuestionCard
                        rankTitle="h3"
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