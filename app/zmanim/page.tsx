import HeaderPlaceholder from "@/components/header-placeholder";
import ZmanimDisplayWithLocation from "@/components/zmanim-with-geo";
import { Metadata } from "next";

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
}

export default function Zmanim() {
   return <div>
      <HeaderPlaceholder />
      <div className="py-4">
         <ZmanimDisplayWithLocation />
      </div>
   </div>
}