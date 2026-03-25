import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
   title: "אודות | שו״ת הרב ברוך אפרתי",
   description: "על האתר ועל הרב ברוך אפרתי - מאגר שאלות ותשובות הלכתיות.",
};

export default function AboutPage() {
   return (
      <main className="min-h-screen bg-background pb-20 text-foreground" dir="rtl">
         {/* Hero Section */}
         <section className="relative h-[45vh] min-h-[400px] w-full overflow-hidden">
            <Image
               src="/cover2.webp"
               alt="הרב ברוך אפרתי"
               fill
               className="object-cover object-top"
               priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/70 to-background" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10">
               <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-xl tracking-wide">
                  להגדיל תורה ולהאדירה
               </h1>
               <p className="text-lg md:text-2xl text-white/95 font-medium max-w-3xl leading-relaxed">
                  מאגר השו״ת המקיף של הרב ברוך אפרתי
               </p>
            </div>
         </section>

         {/* Main Content Container */}
         <div className="max-w-5xl mx-auto px-4 md:px-6 relative z-20 -mt-20">

            {/* Intro Card - Website Purpose */}
            <Card className="bg-card/95 backdrop-blur-md shadow-xl mb-12">
               <CardContent className="p-8 md:p-12 text-right">
                  <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3">
                     <span className="text-4xl">📖</span>
                     על האתר
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-loose">
                     <p className="text-xl font-medium text-foreground">
                        אתר זה מרכז ומנגיש את אוצר השאלות והתשובות של הרב ברוך אפרתי שליט"א.
                     </p>
                     <p>
                        במשך שנים רבות, השיב הרב למאות אלפי פניות בנושאים מגוונים – החל מהלכות יום-יום ועד לסוגיות אקטואליות מורכבות – הן באופן פרטי והן בקבוצות ייעודיות. הידע העצום הזה, עבר תהליך מקיף של עריכה וסידור על ידי צוות מסור של תלמידים מתנדבים.
                     </p>
                     <p>
                        מטרתנו אחת היא - <strong>להנגיש תוכן תורני מדויק ואמיתי לכל דורש, בכל רגע נתון.</strong> בהכרעות הלכתיות בכל חלקי התורה, ובענייני אמונה, חינוך וזוגיות.
                        אנו רואים באתר זה כלי להפצת תורה ומצוות בתוֹם ובטהרה, ומקווים שיהיה לעזר ולתועלת לכל המבקש את דבר ד'.
                     </p>
                  </div>
               </CardContent>
            </Card>

            {/* Images Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
               {[
                  { src: "/1.webp", alt: "לימוד תורה" },
                  { src: "/2.webp", alt: "הרב ברוך אפרתי" },
                  { src: "/3.webp", alt: "שיעור תורה" },
               ].map((img, idx) => (
                  <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
                     <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                     />
                     <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  </div>
               ))}
            </div>

            {/* Biography Section */}
            <div className="grid md:grid-cols-12 gap-8 items-start">
               <div className="md:col-span-12">
                  <h2 className="text-3xl font-bold text-primary mb-8 flex items-center gap-3 border-b pb-4">
                     על הרב ברוך אפרתי
                  </h2>
               </div>

               <div className="md:col-span-12 grid md:grid-cols-1 gap-8">
                  <div className="space-y-12 text-lg text-muted-foreground leading-relaxed">
                     <p>
                        הרב ברוך אפרתי מכהן כרב ביישוב אפרת, ומשמש כפוסק הלכה ועמקוּת אמונה, ברחבי הארץ.
                        דמותו משלבת למדנות מעמיקה עם רגישות חברתית וחינוכית, והוא מוכר כדמות רבנית מובילה בציונות הדתית.
                     </p>
                     <p>
                        הרב מלמד בשורה של ישיבות ומדרשות, ומעמיד תלמידים הרבה.
                        גישתו הייחודית מבקשת תמיד להאזין לתורה כמקור החיים עצמם, מתוך אמונה כי מעט מן האור דוחה הרבה מן החושך, ומתוך המבט של חזרת השכינה לציון במדינת ישראל.
                     </p>
                     <p>
                        התשובות באתר נוגעות בעומקי האמונה לצד פסיקת הלכה, הדרכה להורים לצד עצה לזוגות, טהרת המשפחה ועוד.

                        באתר מובאות לעת עתה רק חלק קטן מן התשובות שענה הרב, והעבודה עוד רבה בשל הריבוי הגדול. העיקר עוד לפנינו, ובשם השם נעשה ונצליח!
                     </p>

                     {/* <p>
                        הרב ברוך אפרתי, יליד רמת גן, מכהן כרב ביישוב אפרת ומשמש כיושב ראש ארגון רבני "דרך אמונה".
                        דמותו משלבת למדנות מעמיקה עם רגישות חברתית וחינוכית, והוא מוכר כדמות רבנית מובילה בציונות הדתית.
                     </p>
                     <p>
                        כמחנך דגול, הרב מלמד בשורה של ישיבות ומדרשות, ומעמיד תלמידים הרבה. גישתו הייחודית מבקשת תמיד לחבר את התורה לחיים עצמם,
                        מתוך אמונה כי "מעט מן האור דוחה הרבה מן החושך".
                     </p> */}
                  </div>

                  {/* <div className="space-y-6">
                     <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                        <h3 className="font-bold text-xl mb-3 text-foreground flex items-center gap-2">
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-pulse"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" /></svg>
                           נפש בריאה בגוף בריא
                        </h3>
                        <p className="text-muted-foreground">
                           הרב אפרתי מוביל קו מחשבתי ייחודי של "תשובה גופנית", בהשראת משנת הרמב"ם.
                           הוא רואה בשמירה על בריאות הגוף וחוסנו נדבך מרכזי בעבודת ה', המאפשר לאדם לפעול בעולם במלוא כוחותיו.
                        </p>
                     </div>

                     <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                        <h3 className="font-bold text-xl mb-3 text-foreground flex items-center gap-2">
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                           מנהיגות ציבורית
                        </h3>
                        <p className="text-muted-foreground">
                           כיו"ר "דרך אמונה", פועל הרב לחיזוק הזהות היהודית בציבוריות הישראלית,
                           מתוך גישה ממלכתית ואחריות לאומית, תוך שילוב בין נאמנות להלכה לבין הבנת אתגרי השעה.
                        </p>
                     </div>
                  </div> */}
               </div>
            </div>

         </div>
      </main>
   );
}
