import Image from 'next/image';
import Link from 'next/link';

const categories = [
  { name: "הבית היהודי", image: "/images/tags/house.webp" },
  { name: "ארץ ישראל ומצוותיה", image: "/images/tags/israel.webp" },
  { name: "צבא ומלחמה", image: "/images/tags/tzava.webp" },
  { name: "פרנסה ועבודה", image: "/images/tags/work.webp" },
  { name: "ציבור וחברה", image: "/images/tags/public.webp" },
  { name: "פרשת השבוע", image: "/images/tags/elul.webp" },
  { name: "שבת", image: "/images/tags/shabbat.webp" },
  { name: "הלכה", image: "/images/tags/halacha.webp" },
  { name: "תורה, מחשבה ומוסר", image: "/images/tags/tora.webp" },
  { name: "חגים וזמנים", image: "/images/tags/holiday.webp" },
];

export default async function Tags() {


  return (
    <section className="flex px-4 pt-8 pb-0 gap-6 overflow-x-auto scroll-smooth w-fit max-w-full mx-auto scroll-snap-x-mandatory">
      {categories.map((t) => (
        <Link
          key={t.name }
          href={`/category/${t.name}`}
          className="group scroll-snap-start transition-all text-primary hover:text-primary/50 shrink-0 grow-0 block text-center"
        >
          <Image
            src={t.image}
            alt={`category of - ${t.name}`}
            width={100}
            height={100}
            className="rounded-full mx-auto transition duration-200 group-hover:grayscale"
          />
          <p className="text-center w-[100px] font-semibold pb-2">{t.name}</p>
        </Link>
      ))}
    </section>
  );
}
