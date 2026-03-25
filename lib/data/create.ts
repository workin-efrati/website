import * as fs from 'fs';
import * as path from 'path';

// ─── Types ──────────────────────────────────────────────────────────────────

export type Block =
   | { id: string; type: "paragraph"; text: string }
   | { id: string; type: "list"; ordered: boolean; items: string[] }
   | { id: string; type: "heading"; level: 3; text: string };

export type Section = {
   id: string;
   title: string;
   blocks: Block[];
};

export type Article = {
   id: string;
   slug: string;
   title: string;
   author: string;
   publishedAt: string;
   sections: Section[];
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function slugify(text: string): string {
   return text
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\u0590-\u05FFa-z0-9-]/g, '') // שומר עברית ואנגלית
      .toLowerCase();
}

function generateId(): string {
   return Math.random().toString(36).substring(2, 11);
}

// ─── Parser Logic ───────────────────────────────────────────────────────────

function parseWhatsAppToJSON(rawText: string): Article {
   const lines = rawText.split('\n').map(l => l.trim());

   // זיהוי מטא-דאטה ראשוני (כאן נשאיר את הניקוי כי זה ה-Title של האובייקט)
   const title = lines.find(l => l.startsWith('*'))?.replace(/\*/g, '') || "מאמר ללא כותרת";
   const author = lines.find(l => l.includes("הרב"))?.replace(/\*/g, '') || "לא ידוע";

   const article: Article = {
      id: generateId(),
      slug: slugify(title),
      title,
      author,
      publishedAt: new Date().toISOString(),
      sections: []
   };

   let currentSection: Section | null = null;

   lines.forEach((line) => {
      if (!line) return;

      // 1. זיהוי כותרת סעיף
      const isSectionHeader = line.startsWith('*') && line.endsWith('*') && line.length < 50 && line.split('*').length === 3;

      if (isSectionHeader) {
         const sectionTitle = line.replace(/\*/g, '');
         currentSection = {
            id: slugify(sectionTitle),
            title: sectionTitle, // הכותרת עצמה תהיה נקייה, אבל התוכן בפנים ישמור על כוכביות
            blocks: []
         };
         article.sections.push(currentSection);
         return;
      }

      if (!currentSection) return;

      // 2. זיהוי רשימה
      const listRegex = /^([-•*]|\d+\.)\s+(.*)/;
      const listMatch = line.match(listRegex);

      if (listMatch) {
         const isOrdered = /\d+\./.test(listMatch[1]);
         // שינוי כאן: הורדנו את ה-replace, הכוכביות נשארות בתוך פריטי הרשימה
         const itemText = listMatch[2];

         const lastBlock = currentSection.blocks[currentSection.blocks.length - 1];

         if (lastBlock?.type === "list" && lastBlock.ordered === isOrdered) {
            lastBlock.items.push(itemText);
         } else {
            currentSection.blocks.push({
               id: generateId(),
               type: "list",
               ordered: isOrdered,
               items: [itemText]
            });
         }
      }
      // 3. פסקה רגילה
      else {
         currentSection.blocks.push({
            id: generateId(),
            type: "paragraph",
            // שינוי כאן: הפסקה נשמרת בדיוק כמו שהיא, כולל כוכביות
            text: line
         });
      }
   });

   return article;
}
// ─── Main Execution ─────────────────────────────────────────────────────────

const rawWhatsAppMessage = `
*קריאות חדשות בתורה*

*פסח*

*וזכרת כי עבד היית*

בליל הסדר נשב כולנו מסובים לשולחן הערוך ונדון בניסי יציאת מצרים ובשעבוד הנורא ששעבדו אותנו המצרים.

חוויית הטרגדיה והישועה הבאה בעקבותיה, מוגדרת בהלכה כמצווה מן התורה.

דברים ברוח זו כותב הרמב"ם: "מצות עשה של תורה לספר בנסים ונפלאות שנעשו לאבותינו במצרים בליל חמשה עשר בניסן... בכל דור ודור חייב אדם להראות את עצמו כאילו הוא בעצמו יצא עתה משעבוד מצרים... ועל דבר זה צוה הקב"ה בתורה 'וזכרת כי עבד היית'...".

אכילת המרור מחדדת בנו את הרגשת הכאב של השעבוד, ואכילת המצה והפסח מחדדת את היציאה לחירות.

אלא שמעיון בפסוקי התורה ניכר שאם בתיאור דלעיל בלבד מסתכם ליל הסדר, הרי שהוא אינו נעשה באופן הראוי.

המעיין במצוות זכרון שעבוד מצרים יבחין במוטיב נוסף שעלינו להדגיש בליל הסדר ובחיינו החברתיים.

כך מתארת התורה את זכירת היציאה מן העבדות, בטעם לשמירת שבת (ספר דברים פרק ה):
"וזכרת כי עבד היית בארץ מצרים ויצאך ד' אלהיך משם ביד חזקה ובזרוע נטויה".

סיבה זו מופיעה גם בתיאור היחס הראוי לעבד, שם מורה לנו התורה להתייחס אליו בכבוד רב (שם פרק טו):
"והעניק תעניק לו מצאנך ומגרנך ומיקבך... וזכרת כי עבד היית בארץ מצרים ויפדך ד' אלהיך משם, על כן אנכי מצוך את הדבר הזה היום".

גם בטעם מצוות הסוכה, התורה שמה דגש על אותו עניין (שם פרק טז):
"וזכרת כי עבד היית בארץ מצרים... ושמחת בחגך אתה ובנך ובתך ועבדך ואמתך והלוי והגר והיתום והאלמנה".

וכן בתיאור האיסור להטות משפט כותבת התורה דברים ברוח זו:
"לא תטה משפט גר יתום ולא תחבל בגד אלמנה, וזכרת כי עבד היית במצרים ויפדך ד' אלהיך משם, על כן אנכי מצוך לעשות את הדבר הזה".

התורה קושרת קשר רציף ועקבי בין מצוות זכרון יציאת מצרים לבין תרגום מעשי עכשווי של לקיחת אחריות של החברה הישראלית על החלש שבקרבה.

התורה הדגישה שזיכרון טראומת השעבוד המצרי אמור לתת אותותיו בישראל בצורת דאגה לחיי הגר והעבד, אף הם אנשים שונים מישראל, ובחלק מן המקרים הכוונה לגר תושב.

נוח ליושב בליל הסדר לדבר על יציאת מצרים, ניסיה ואותותיה המפליאים. אך התורה מצווה אותנו שלא נחשוב שבזה תמה מצוות חוויית זיכרון השעבוד והגאולה.

התורה שמה דגש גם על ההשלכה להווה היום-יומי.

ואם כך התורה דורשת בגלל שעבוד בן פחות משלוש מאות שנים, ודאי שלאחר שואות וטרגדיות של אלפיים שנות גלות, בהן סבלנו בשל היותנו שונים, מאמינים באמונה אחרת מהגויים הסובבים אותנו, היותנו מגזע "שמי" השונה מהסובבים אותנו, עלינו ללמוד מן הניסיון החקוק בבשרנו מאלפי שנות הגלות שבה התנכרו אלינו הגויים.

בליל הסדר מצפה התורה מאיתנו לדון בניסי היציאה והשעבוד במצרים, אך באותה מידה לדון בשאלה הכואבת כיצד חש האדם האחר במדינת ישראל, דווקא האחר המוחלט, בדברי התורה: "גר ועבד", אדם בעל זהות שונה מאיתנו.

במובן זה, אין מדובר על "זהות" המאיימת עלינו, אך עלינו לזכור שהתורה קושרת את מצוות היחס לשונה לטראומת השעבוד. בשעבוד היינו שונים מסביבתנו, ועל כן גם על האחר והענווה עלינו לקחת אחריות בימינו.

הן על ידי חקיקה מתאימה, בעלת רגישות לכאב של הגר והעבד המודרניים, עובדי הקבלן וחלשי החברה, והן בחיינו היום-יומיים, במפגשים עם דמויות חלשות ופגיעות.

רק אם נטמיע בתוך זכירת השעבוד והגאולה את הגברת הדיון בתוכנו, לגבי היחס ל"שקופים" בישראל, נצא ידי חובת מצוות "ליל הסדר" בהלכתה.
`;

const result = parseWhatsAppToJSON(rawWhatsAppMessage);

// יצירת הנתיב ושמירת הקובץ
const fileName = `${result.slug}.json`;
const filePath = path.join(__dirname, fileName);

try {
   fs.writeFileSync(filePath, JSON.stringify(result, null, 2), 'utf-8');
   console.log(`✅ Success! File saved at: ${filePath}`);
} catch (err) {
   console.error("❌ Error writing file:", err);
}