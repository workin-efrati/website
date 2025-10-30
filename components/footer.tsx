"use client";
import Image from "next/image";
import Link from "next/link";

interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}



const footerLinks: FooterLinkGroup[] = [
  {
    title: "אודות",
    links: [
      { label: "צור קשר", href: "/contact" },
      { label: "בית המדרש", href: "/beit-midrash" },
      { label: "הצטרף לקהילה", href: "/join" },
    ],
  },
  {
    title: "שאלות",
    links: [
      { label: "הלכה", href: "/category/halacha" },
      { label: "אמונה", href: "/category/emuna" },
      { label: "טהרה", href: "/category/tahara" },
    ],
  },
  {
    title: "פרשות שבוע",
    links: [
      { label: "בראשית", href: "/parasha/bereshit" },
      { label: "שמות", href: "/parasha/shemot" },
      { label: "ויקרא", href: "/parasha/vayikra" },
      { label: "במדבר", href: "/parasha/bamidbar" },
      { label: "דברים", href: "/parasha/devarim" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full border-t bg-linear-to-b from-white to-sky-50 text-right">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-start gap-10">

        {/* Logo & Button */}
        <div className="flex flex-col items-center md:items-start text-center md:text-right gap-3">
          <div>
            <h2 className="text-3xl font-bold text-sky-900">שׁו"ת הרב אפרתי</h2>
            <p className="text-sky-800 text-sm">הלכה . אמונה . טהרה</p>
          </div>
          <Link
            href="https://wa.me/972504723445"
            target="_blank"
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/50 text-white rounded-lg px-4 py-2 text-sm shadow-md transition"
          >
            <Image alt="whatsapp icon" src='/images/icons/whats.svg' width={32} height={32} />
            הצטרף אלינו לקבוצות הוואטסאפ
          </Link>
        </div>

        {/* Link Columns */}
        {/* <div className="flex flex-wrap justify-center md:justify-end gap-10">
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sky-900 text-lg font-semibold mb-2">{group.title}</h3>
              <ul className="space-y-1">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-700 hover:text-sky-700 transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div> */}
      </div>

      {/* Bottom Bar */}
      <div className="bg-sky-700 text-center text-white text-sm py-3">
        <p>© תשפ״ד 2024 כל הזכויות שמורות לSKIP - בית תוכנה חכם</p>
        <p className="text-xs mt-1">עיצוב ופיתוח: Skip ltd</p>
      </div>
    </footer>
  );
}
