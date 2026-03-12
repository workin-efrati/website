import { convertDateToHebrew } from '../lib/utils';

const dates = [
   new Date('2024-01-01'), // Should be ~20 Tevet 5784 -> "כ' טבת תשפ"ד"
   new Date('2023-09-16'), // Rosh Hashana -> 1 Tishrei
   new Date('2025-12-25'), // User's example date
];

dates.forEach(date => {
   console.log(`${date.toISOString().split('T')[0]} -> ${convertDateToHebrew(date)}`);
});
