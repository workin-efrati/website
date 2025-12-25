import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

export const cleanSlug = (title: string) => {
  return (title || 'שאלה')
    .replace(/\?/g, '')  // מחק סימני שאלה
    .replace(/[<>:"|\\/*]/g, '-')  // החלף אחרים במקף
    .replace(/ /g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://efrati.co.il'

export const convertDateToHebrew = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    calendar: 'hebrew',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  const parts = new Intl.DateTimeFormat('he-IL', options).formatToParts(dateObj);

  const dayPart = parts.find(p => p.type === 'day')?.value;
  const monthPart = parts.find(p => p.type === 'month')?.value;
  const yearPart = parts.find(p => p.type === 'year')?.value;

  if (!dayPart || !monthPart || !yearPart) return '';

  const hebrewDay = toHebrew(parseInt(dayPart));
  const hebrewYear = toHebrew(parseInt(yearPart) % 5000); // Standard year format ignores thousands (5784 -> 784)
  const hebrewMonth = monthPart.replace(/^ב/, ''); // Remove 'Bet' prefix if present

  return `${hebrewDay} ${hebrewMonth} ${hebrewYear}`;
};

function toHebrew(num: number): string {
  if (num <= 0) return '';

  // Special pairs
  if (num === 15) return 'ט"ו';
  if (num === 16) return 'ט"ז';

  const letters = [
    { val: 400, char: 'ת' },
    { val: 300, char: 'ש' },
    { val: 200, char: 'ר' },
    { val: 100, char: 'ק' },
    { val: 90, char: 'צ' },
    { val: 80, char: 'פ' },
    { val: 70, char: 'ע' },
    { val: 60, char: 'ס' },
    { val: 50, char: 'נ' },
    { val: 40, char: 'מ' },
    { val: 30, char: 'ל' },
    { val: 20, char: 'כ' },
    { val: 10, char: 'י' },
    { val: 9, char: 'ט' },
    { val: 8, char: 'ח' },
    { val: 7, char: 'ז' },
    { val: 6, char: 'ו' },
    { val: 5, char: 'ה' },
    { val: 4, char: 'ד' },
    { val: 3, char: 'ג' },
    { val: 2, char: 'ב' },
    { val: 1, char: 'א' },
  ];

  let result = '';
  // Handle remainder logic for simple cases
  // For years like 784, the loop works fine as long as last 2 digits aren't 15/16.
  // 784 -> 400, 300, 80, 4. No 15/16.
  // 715 -> 400, 300, 15? My loop does 400, 300, 10, 5. -> "תשיה" (wrong).
  // Fix: Check last 2 digits before loop?
  // Actually, separating hundreds helps.

  let tempNum = num;

  // Hundreds
  while (tempNum >= 100) {
    for (const { val, char } of letters) {
      if (val >= 100 && tempNum >= val) {
        result += char;
        tempNum -= val;
        break; // Restart loop to find next largest
      }
    }
  }

  // Tens/Units
  if (tempNum === 15) {
    result += 'טו';
  } else if (tempNum === 16) {
    result += 'טז';
  } else {
    // Standard loop for remainder
    for (const { val, char } of letters) {
      if (val < 100) {
        while (tempNum >= val) {
          result += char;
          tempNum -= val;
        }
      }
    }
  }

  // Add gershayim
  if (result.length === 1) {
    return result + "'";
  }
  return result.slice(0, -1) + '"' + result.slice(-1);
}


