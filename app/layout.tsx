import Footer from "@/components/footer";
import Header from "@/components/header";
import { JsonLd, createOrganizationSchema, createWebSiteSchema } from "@/components/json-ld";
import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from "next";
import { Bona_Nova, Heebo } from "next/font/google";
import { baseUrl } from "@/lib/utils";
import "./globals.css";

const heebo = Heebo(
  {
    subsets: ["hebrew", "latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: '--font-heebo',
    display: 'swap',

  }
);
const bonaNova = Bona_Nova(
  {
    subsets: ["hebrew", "latin"],
    weight: ["400", "700"],
    variable: '--font-bona',
    display: 'swap',
  }
);

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl as string), // שנה לכתובת האמיתית שלך
  title: {
    default: "למדני חוקך - שאלות ותשובות יהדות | הרב אפרתי",
    template: "%s | למדני חוקך",
  },
  description: `למדני חוקך הוא אתר שאלות ותשובות מקוון בהלכה, אמונה ומחשבה, בניהולו של הרב אפרתי. באתר אלפי תשובות מסודרות לפי נושאים ותוויות — כשרות, שבת, טהרה, תפילה, זוגיות, חינוך ועוד.`,
  keywords: [
    "שו\"ת",
    "הלכה",
    "רב אפרתי",
    "אמונה",
    "מחשבה",
    "דת",
    "שאלות ותשובות",
    "תורה",
    "שבת",
    "כשרות",
    "טהרה",
    "פסיקה הלכתית",
    "דתיים",
    "יהדות",
    "תשובות בהלכה",
  ],
  authors: [{ name: "הרב ברוך אפרתי" }],
  creator: "הרב ברוך אפרתי",
  publisher: "למדני חוקך",
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: baseUrl,
    title: "למדני חוקך - אתר שאלות ותשובות בהלכה | הרב אפרתי",
    description:
      "אתר שאלות ותשובות בהלכה, אמונה ומחשבה מאת הרב אפרתי. חיפוש לפי נושאים, תגים ושאלות עדכניות מהציבור הרחב.",
    siteName: "למדני חוקך",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "למדני חוקך - הרב ברוך אפרתי",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "למדני חוקך - שאלות ותשובות בהלכה | הרב ברוך אפרתי",
    description:
      "מאגר ענק של שאלות ותשובות בהלכה, אמונה ומחשבה. אתר 'למדני חוקך' בניהול הרב ברוך אפרתי.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: baseUrl,
  },
  category: "Religion & Spirituality",
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  other: {
    "theme-color": "#0f172a",
    "revisit-after": "7 days",
    "og:locale:alternate": "en_US",
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body
        className={`${heebo.variable} ${bonaNova.variable} font-(--font-heebo) antialiased`}
      >
        {/* Structured Data for Google Search */}
        <JsonLd
          id="website-schema"
          data={createWebSiteSchema(baseUrl, 'למדני חוקך - הרב אפרתי')}
        />
        <JsonLd
          id="organization-schema"
          data={createOrganizationSchema(baseUrl)}
        />

        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''} />
      </body>
    </html>
  );
}
