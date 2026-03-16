import HeaderPlaceholder from "@/components/header-placeholder";
import { JsonLd, createBreadcrumbSchema } from "@/components/json-ld";
import ZmanimDisplayWithLocation from "@/components/zmanim-with-geo";
import { baseUrl } from "@/lib/utils";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
   title: "זמני היום בהלכה",
   description: "זמני היום ההלכתיים המדויקים ביותר לישראל והעולם ⏰ הנץ החמה, סוף זמן קריאת שמע, מנחה, שקיעה וצאת הכוכבים. מחושב לפי מיקומך המדויק. עדכון בזמן אמת כל יום.",
   keywords: [
      "זמני היום",
      "זמנים הלכתיים",
      "הנץ החמה",
      "סוף זמן קריאת שמע",
      "שקיעת החמה",
      "צאת הכוכבים",
      "זמני תפילה",
      "לוח זמנים יומי",
      "זמנים לפי ההלכה",
      "עלות השחר",
      "מנחה גדולה",
      "מנחה קטנה",
      "פלג המנחה",
      "חצות היום",
      "זמני שבת",
      "כניסת שבת",
      "יציאת שבת",
      "זמנים ירושלים",
      "זמנים תל אביב",
      "זמנים בני ברק",
      "זמנים חיפה",
      "זמנים בישראל",
      "זמנים בעולם",
      "זמני יום עברי",
      "תאריך עברי",
      "לוח עברי",
      "משיכיר",
      "טלית ותפילין",
      "רבנו תם",
      "גר\"א",
      "מג\"א",
   ],
   alternates: {
      canonical: `${baseUrl}/zmanim`,
   },
   openGraph: {
      title: "זמני היום בהלכה - לוח זמנים יהודי מדויק",
      description: "קבלו את זמני היום ההלכתיים המדויקים ביותר לפי מיקומכם. הנץ, שקיעה, סוף זמן קריאת שמע ועוד.",
      url: `${baseUrl}/zmanim`,
      siteName: "למדני חוקיך",
      locale: "he_IL",
      type: "website",
      images: [
         {
            url: "/thumb.png",
            width: 1200,
            height: 630,
            alt: "זמני היום בהלכה",
         },
      ],
   },
   twitter: {
      card: "summary_large_image",
      title: "זמני היום בהלכה - לוח זמנים יהודי מדויק",
      description: "זמני היום ההלכתיים המדויקים ביותר לישראל והעולם. מחושב לפי מיקומך המדויק.",
      images: ["/thumb.png"],
   },
}

export default function Zmanim() {
   const breadcrumbData = createBreadcrumbSchema([
      { name: "בית", url: baseUrl },
      { name: "זמני היום", url: `${baseUrl}/zmanim` },
   ]);

   return <div>
      <JsonLd data={breadcrumbData} id="zmanim-breadcrumb" />
      <div className="relative flex flex-col h-[40vh]">
         <Image
            src={'/cover3.webp'}
            alt={'harav Efrati'}
            fill
            fetchPriority="high"
            sizes="(min-width:1024px) 1200px, (min-width:640px) 800px, 600px"
            className="object-cover object-top-left opacity-80"
            priority
         />
         <div className="absolute inset-0 bg-linear-to-r from-primary/90 via-primary/70 to-primary/60" />
         <HeaderPlaceholder />
         <div className="flex justify-center items-center flex-1 px-4 text-center">
            <h1 className="text-3xl relative z-10 md:text-7xl font-extrabold leading-tight text-white" >
               זמני היום
            </h1>
         </div>
      </div>
      <div className="pb-4">
         <ZmanimDisplayWithLocation />
      </div>
   </div>
}