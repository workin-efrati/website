import { convertDateToHebrew } from '../lib/utils';

const date = new Date('2024-01-01'); // Should be roughly 20 Tevet 5784

console.log('Current impl:', convertDateToHebrew(date));

// Test variations
const variations = [
   { options: { calendar: 'hebrew', numberingSystem: 'hebrew', day: 'numeric', month: 'long', year: 'numeric' }, locale: 'he-IL' },
   { options: { calendar: 'hebrew', day: 'numeric', month: 'long', year: 'numeric' }, locale: 'he-IL-u-ca-hebrew-nu-hebrew' },
];

variations.forEach((v, i) => {
   try {
      const fmt = new Intl.DateTimeFormat(v.locale, v.options as any);
      console.log(`Var ${i}:`, fmt.format(date));
   } catch (e) {
      console.error(`Var ${i} failed:`, e);
   }
});
