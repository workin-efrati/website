import Image from 'next/image';
import { Suspense } from 'react';
import Search from '../components/search';
import LastQuestions from './last-quastions';
import Tags from './tags';
import RelevantQuestions from './relevant-questions';
// import Link from 'next/link';
// import { SearchBar } from './search/SearchBar'; // Import the Client Component


// const categories = [
//   { title: 'שו"ת בהלכה', slug: 'halacha' },
//   { title: 'שו"ת זוגיות', slug: 'zugiut' },
//   { title: 'שו"ת אמונה', slug: 'emuna' },
//   { title: 'שו"ת חינוך', slug: 'chinuch' },
//   { title: 'שיעורי וידאו', slug: 'video' },
//   { title: 'פרשות שבוע', slug: 'parashot' },
// ];


// const CategoryButton = ({ title, slug }: { title: string, slug: string }) => (
//   <Link href={`/category/${slug}`} passHref>
//     <div
//       className="w-full h-16 flex items-center justify-center 
//                    text-white font-semibold text-lg p-4 rounded-xl border border-white/20 hover:border-white/50
//                    bg-primary/50 shadow-lg cursor-pointer transition hover:shadow-xl"
//     >
//       {title}
//     </div>
//   </Link>
// );

export default function home() {
  return (
    <>
      <section
        className="relative w-full min-h-[500px] md:h-[700px] flex flex-col items-center justify-center"
      >
        <Image
          src="/2.webp"
          alt="Students studying in a Jewish Yeshiva"
          fill
          priority
          className="object-cover absolute inset-0"
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

          {/* <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-3xl">
            {categories.map((cat, index) => (
              <CategoryButton key={index} title={cat.title} slug={cat.slug} />
            ))}
          </div> */}

        </div>
      </section>
      <Tags />
      <RelevantQuestions/>
      <LastQuestions />
    </>
  );
}