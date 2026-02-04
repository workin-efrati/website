import HeaderPlaceholder from "@/components/header-placeholder";
import ZmanimDisplayWithLocation from "@/components/zmanim-with-geo";
import { Metadata } from "next";
import { baseUrl } from "@/lib/utils";
import { JsonLd, createBreadcrumbSchema } from "@/components/json-ld";

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
      siteName: "למדני חוקך",
      locale: "he_IL",
      type: "website",
      images: [
         {
            url: "/og-image.png",
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
      images: ["/og-image.png"],
   },
}

export default function Zmanim() {
   const breadcrumbData = createBreadcrumbSchema([
      { name: "בית", url: baseUrl },
      { name: "זמני היום", url: `${baseUrl}/zmanim` },
   ]);

   return <div>
      <JsonLd data={breadcrumbData} id="zmanim-breadcrumb" />
      <HeaderPlaceholder />
      <div className="py-4">
         <ZmanimDisplayWithLocation />
      </div>
   </div>
}