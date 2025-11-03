import parshiyotObjectJson from "./parashot20Years.json";
import holidaysObjectJson from "./holiday20Years.json";
import axios from "axios";

type ParshaMap = Record<string, { inHebrew: string }>;
type HolidayMap = Record<string, { inHebrew: string; mainTag: string | null }>;

const parshiyotObject = parshiyotObjectJson as ParshaMap;
const holidaysObject = holidaysObjectJson as HolidayMap;

// 🕓 קבלת תאריך נוכחי, תאריך עברי, פרשה וחג קרוב
export interface DateInfo {
  currentDate: string;
  currentHeDate: string | null;
  currentParasha: string | null;
  upcomingHoliday: string | null;
}

// 🌙 הפונקציה הראשית
export const getCurrentDateInfo = async (): Promise<DateInfo> => {
  return {
    currentDate: getCurrentDateInIsrael(),
    currentHeDate: await getHebrewDateFromAPI(getCurrentDateInIsraelForAPI()),
    currentParasha: getCurrentParashaFromJSON(),
    upcomingHoliday: getUpcomingHolidayFromJSON(),
  };
};

// 📖 קבלת פרשת השבוע
export const getCurrentParashaFromJSON = (): string | null => {
  const todayDateStr = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' }).split(',')[0];
  const todayNumber = new Date(todayDateStr).getDay();
  const daysUntilSaturday = (6 - todayNumber + 7) % 7;

  const padZero = (num: number): string => (num < 10 ? `0${num}` : `${num}`);

  const [month, day, year] = todayDateStr.split('/').map(Number);
  const nextSaturday = new Date(`${year}-${padZero(month)}-${padZero(day)}T00:00:00.001Z`);
  nextSaturday.setDate(nextSaturday.getDate() + daysUntilSaturday);

  const nextSaturdayDateString = nextSaturday.toISOString().split('T')[0];
  const nextParsha = parshiyotObject?.[nextSaturdayDateString]?.inHebrew ?? null;

  if (nextParsha) {
    console.log(`פרשת השבוע הקרובה (${nextSaturdayDateString}) היא: ${nextParsha}`);
  } else {
    console.log(`לא נמצאה פרשה לשבת הקרובה (${nextSaturdayDateString}).`);
  }

  return nextParsha;
};

// 🎉 קבלת חג קרוב
export const getUpcomingHolidayFromJSON = (): string | null => {
  const today = new Date();
  const twoWeeksFromNow = new Date(today.getTime() + 34 * 24 * 60 * 60 * 1000); // 34 ימים קדימה
  let upcomingHolidayWithTag: { inHebrew: string; mainTag: string | null } | null = null;

  for (const [dateStr, holiday] of Object.entries(holidaysObject)) {
    const holidayDate = new Date(dateStr);

    if (holidayDate >= today && holidayDate <= twoWeeksFromNow) {
      if (holiday.mainTag !== null) {
        console.log(`החג הקרוב הוא: ${holiday.inHebrew}, תג: ${holiday.mainTag}`);
        return holiday.mainTag;
      } else if (upcomingHolidayWithTag === null) {
        upcomingHolidayWithTag = holiday;
      }
    }
  }

  console.log('אין חגים עם תג בשבועות הקרובים');
  return null;
};



// 🧩 טיפוס למבנה תגובה של Hebcal
interface HebcalResponse {
  hebrew?: string;
  items?: { category: string; hebrew: string }[];
}

// 🧮 ממירה מחרוזת תאריך בלבד למבנה חודש/יום/שנה
export function parseDate(dateString: string = getCurrentDateInIsraelForAPI()): string {
  const regex = /^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2}|\d{4})$/;
  const match = dateString.match(regex);

  if (!match) throw new Error("Invalid date format");

  let part1 = parseInt(match[1], 10);
  let part2 = parseInt(match[2], 10);
  let part3 = parseInt(match[3], 10);

  if (part3 < 100) part3 += 2000;

  let day: number, month: number;
  if (part1 > 12) {
    day = part1;
    month = part2;
  } else if (part2 > 12) {
    day = part2;
    month = part1;
  } else {
    month = part1;
    day = part2;
  }

  const monthStr = month < 10 ? `0${month}` : `${month}`;
  const dayStr = day < 10 ? `0${day}` : `${day}`;
  return `${monthStr}/${dayStr}/${part3}`;
}

// 📅 קבלת תאריך עברי נוכחי או לפי תאריך מסוים
export const getHebrewDateFromAPI = async (date?: string): Promise<string | null> => {
  const requestedDay = new Date(parseDate(date ?? getCurrentDateInIsraelForAPI()));

  if (isNaN(requestedDay.getFullYear())) {
    throw new Error("Invalid date requested");
  }

  try {
    const url = `https://www.hebcal.com/converter?cfg=json&gy=${requestedDay.getFullYear()}&gm=${requestedDay.getMonth() + 1}&gd=${requestedDay.getDate()}&g2h=1`;
    const response = await axios.get<HebcalResponse>(url);
    const dateInHe = response.data?.hebrew?.replace(/[\u0591-\u05C7]/g, "") ?? null;
    console.log(dateInHe);
    return dateInHe;
  } catch (error: any) {
    console.error("Error fetching data:", error.message);
    throw error;
  }
};

// 📆 תאריך לועזי נוכחי במבנה יום/חודש/שנה לפי שעון ישראל
export const getCurrentDateInIsrael = (): string => {
  const todayDateStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Jerusalem" }).split(",")[0];
  const padZero = (num: number) => (num < 10 ? `0${num}` : `${num}`);
  const [month, day, year] = todayDateStr.split("/").map(Number);
  const formatted = `${padZero(day)}/${padZero(month)}/${year}`;
  console.log(formatted);
  return formatted;
};

// 📆 תאריך לועזי נוכחי במבנה חודש/יום/שנה לפי שעון ישראל
export const getCurrentDateInIsraelForAPI = (): string => {
  const todayDateStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Jerusalem" }).split(",")[0];
  const padZero = (num: number) => (num < 10 ? `0${num}` : `${num}`);
  const [month, day, year] = todayDateStr.split("/").map(Number);
  const formatted = `${padZero(month)}/${padZero(day)}/${year}`;
  console.log(formatted);
  return formatted;
};

// 📅 קבלת תאריך לועזי בעברית
export const getDateInHe = (date?: string | Date): string => {
  const requestedDay = date ? new Date(date) : new Date();
  console.log("🚀 ~ getDateInHe ~ today:", requestedDay);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formatted = requestedDay.toLocaleDateString("he-IL", options);
  console.log(formatted);
  return formatted;
};

// 🧭 ממיר כל תאריך למחרוזת שנה-חודש-יום (ל־API)
export const formatDateForAPI = (date?: string | Date): string => {
  const requestedDay = date ? new Date(date) : new Date();
  const year = requestedDay.getFullYear();
  const month = (requestedDay.getMonth() + 1).toString().padStart(2, "0");
  const day = requestedDay.getDate().toString().padStart(2, "0");
  const formatted = `${day}-${month}-${year}`;
  console.log(formatted);
  return formatted;
};

// 🕍 קבלת פרשת השבוע הקרובה מה־API (לא בשימוש כרגע)
export const getCurrentParashaFromAPI = async (): Promise<string | null> => {
  const getCurrentDate = () => formatDateForAPI(new Date());
  const getNextWeekDate = () => formatDateForAPI(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

  const parshiot: Record<string, string> = {
    "בראשית": "בראשית",
    "נח": "נח",
    "לך לך": "לך לך",
    "וירא": "וירא",
    "חיי שרה": "חיי שרה",
    "תולדות": "תולדות",
    "ויצא": "ויצא",
    "וישלח": "וישלח",
    "וישב": "וישב",
    "מקץ": "מקץ",
    "ויגש": "ויגש",
    "ויחי": "ויחי",
    "שמות": "שמות",
    "וארא": "וארא",
    "בא": "בא",
    "בשלח": "בשלח",
    "יתרו": "יתרו",
    "משפטים": "משפטים",
    "תרומה": "תרומה",
    "תצווה": "תצווה",
    "כי תשא": "כי תשא",
    "ויקהל": "ויקהל",
    "פקודי": "פקודי",
    "ויקרא": "ויקרא",
    "צו": "צו",
    "שמיני": "שמיני",
    "תזריע": "תזריע",
    "מצורע": "מצורע",
    "אחרי מות": "אחרי מות",
    "קדושים": "קדושים",
    "אמור": "אמור",
    "בהר": "בהר",
    "בחקותי": "בחקותי",
    "במדבר": "במדבר",
    "נשא": "נשא",
    "בהעלותך": "בהעלותך",
    "שלח": "שלח",
    "קרח": "קרח",
    "חוקת": "חוקת",
    "בלק": "בלק",
    "פנחס": "פנחס",
    "מטות": "מטות",
    "מסעי": "מסעי",
    "דברים": "דברים",
    "ואתחנן": "ואתחנן",
    "עקב": "עקב",
    "ראה": "ראה",
    "שופטים": "שופטים",
    "כי תצא": "כי תצא",
    "כי תבא": "כי תבא",
    "נצבים": "נצבים",
    "וילך": "וילך",
    "האזינו": "האזינו",
    "וזאת הברכה": "וזאת הברכה",
  };

  const getParasha = (apiResponse: HebcalResponse): string | null => {
    if (apiResponse.items && apiResponse.items.length > 0) {
      for (const item of apiResponse.items) {
        if (item.category === "parashat") {
          const parts = item.hebrew.split(" ");
          const parasha = `${parts[0]} ${parshiot[parts[1]] || parts[1]}`;
          return parasha;
        }
      }
    }
    return null;
  };

  try {
    const range = `https://www.hebcal.com/hebcal?cfg=json&s=on&start=${getCurrentDate()}&end=${getNextWeekDate()}`;
    const response = await axios.get<HebcalResponse>(range);
    const parasha = getParasha(response.data);
    return parasha?.split(" ")[1] ?? null;
  } catch (error: any) {
    console.error("Error fetching data:", error.message);
    throw error;
  }
};
