import Image from 'next/image';
import { Suspense } from 'react';
import Search from '../components/search';
import LastQuestions from './last-quastions';
import Tags from './tags';
import RelevantQuestions from './relevant-questions';

export default function home() {
  return (
    <>
      <section
        className="relative w-full min-h-[500px] md:h-[700px] flex flex-col items-center justify-center"
      >
        <Image
          src="/cover2.webp"
          alt="harav Efrati"
          fill
          priority
          fetchPriority="high"
          className="object-cover object-top-left absolute inset-0"
        />
        <div
          className="absolute inset-0 bg-primary/70"
        />

        <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center justify-center">

          <div className="text-center mb-8">
            <h1 className="text-6xl mb-2 md:text-9xl font-bold text-white tracking-wider leading-tight"

            >
              לַמְּדֵנִי חֻקֶּיךָ          </h1>
            <p className="text-white text-base my-8 opacity-90">
              פּסקי דינים ונתיבות אמונה, ממשנת הרב ברוך אפרתי
            </p>
            <Suspense fallback={<div>טוען...</div>}>
              <Search placeholder='חפש שאלה לפי מלל חופשי' addPathName="qa" />
            </Suspense>
          </div>
        </div>
      </section>
      <Tags />
      <RelevantQuestions />
      <LastQuestions />
    </>
  );
}