"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, BookOpen, Clock, MapPin, Moon, Navigation, Star, Sunrise, Sunset } from "lucide-react";
import Link from "next/link";

interface CompactZmanim {
   sunrise: string;
   sofZmanShma: string;
   sunset: string;
   tzeitHaKochavim: string;
}

interface ZmanimWidgetProps {
   className?: string;
}

export default function ZmanimWidget({ className = "" }: ZmanimWidgetProps) {
   const [zmanim, setZmanim] = useState<CompactZmanim | null>(null);
   const [loading, setLoading] = useState(true);
   const [locationName, setLocationName] = useState("ירושלים");
   const [coordinates, setCoordinates] = useState({
      latitude: 31.7683,
      longitude: 35.2137,
   });
   const [isDetectingLocation, setIsDetectingLocation] = useState(false);

   useEffect(() => {
      fetchZmanim();
   }, [coordinates]);

   async function fetchZmanim() {
      try {
         setLoading(true);
         const today = new Date();
         const year = today.getFullYear();
         const month = String(today.getMonth() + 1).padStart(2, "0");
         const day = String(today.getDate()).padStart(2, "0");

         const tzid = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Jerusalem";
         const response = await fetch(
            `https://www.hebcal.com/zmanim?cfg=json&latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&date=${year}-${month}-${day}&tzid=${tzid}`
         );

         if (!response.ok) throw new Error("Failed to fetch zmanim");
         const data = await response.json();

         setZmanim({
            sunrise: formatTime(data.times.sunrise),
            sofZmanShma: formatTime(data.times.sofZmanShma),
            sunset: formatTime(data.times.sunset),
            tzeitHaKochavim: formatTime(data.times.tzeit7083deg),
         });
      } catch (err) {
         console.error("Error fetching zmanim:", err);
      } finally {
         setLoading(false);
      }
   }

   async function detectLocation() {
      if (!navigator.geolocation) {
         alert("הדפדפן שלך לא תומך בזיהוי מיקום");
         return;
      }

      setIsDetectingLocation(true);

      navigator.geolocation.getCurrentPosition(
         async (position) => {
            const { latitude, longitude } = position.coords;

            // Get location name
            try {
               const response = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=he`
               );
               const data = await response.json();
               const name = data.address?.city || data.address?.town || data.address?.village || "המיקום שלי";
               setLocationName(name);
            } catch {
               setLocationName("המיקום שלי");
            }

            setCoordinates({ latitude, longitude });
            setIsDetectingLocation(false);
         },
         (error) => {
            alert("לא הצלחנו לזהות את המיקום שלך");
            setIsDetectingLocation(false);
         }
      );
   }

   function formatTime(isoString: string): string {
      if (!isoString) return "--:--";
      // Extract time portion from ISO string (HH:MM)
      // ISO format: "2024-01-30T05:46:00+05:30"
      const timePart = isoString.match(/T(\d{2}:\d{2})/);
      if (timePart && timePart[1]) {
         return timePart[1];
      }
      // Fallback to parsing
      const date = new Date(isoString);
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
   }

   if (loading) {
      return (
         <div className={`w-full ${className} max-w-xl`} dir="rtl">
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-white/80" aria-hidden="true" />
                  <Skeleton className="h-4 w-24 bg-white/15" />
               </div>
               <Skeleton className="h-7 w-28 rounded-full bg-white/15" />
            </div>

            <div className="grid grid-cols-2 gap-3">
               {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-lg bg-white/10" />
               ))}
            </div>

            <div className="mt-4 flex gap-2">
               <Skeleton className="h-9 flex-1 rounded-md bg-white/10" />
               <Skeleton className="h-9 flex-1 rounded-md bg-white/10" />
            </div>
         </div>
      );
   }

   return (
      <div className={`w-full max-w-xl ${className}`} dir="rtl">
         <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
               <Clock className="h-4 w-4 text-white/80" aria-hidden="true" />
               <div className="font-(--font-bona) text-white/95">זמני היום</div>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90">
               <MapPin className="h-3.5 w-3.5 text-white/80" aria-hidden="true" />
               <span className="max-w-48 truncate">{locationName}</span>
            </div>
         </div>

         <div className="grid grid-cols-2 gap-3">
            <ZmanItem label="הנץ החמה" time={zmanim?.sunrise} icon={Sunrise} highlight />
            <ZmanItem label="סוף זמן ק''ש" time={zmanim?.sofZmanShma} icon={BookOpen} />
            <ZmanItem label="שקיעת החמה" time={zmanim?.sunset} icon={Sunset} highlight />
            <ZmanItem label="צאת הכוכבים" time={zmanim?.tzeitHaKochavim} icon={Star} />
         </div>

         <div className="mt-4 flex gap-2">
            <Button
               onClick={detectLocation}
               disabled={isDetectingLocation}
               variant="outline"
               className="flex-1 border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
               <Navigation
                  className={`h-4 w-4 ${isDetectingLocation ? "animate-spin" : ""}`}
                  aria-hidden="true"
               />
               {isDetectingLocation ? "מזהה..." : "מיקום שלי"}
            </Button>

            <Button asChild className="flex-1 bg-white text-primary hover:bg-white/90">
               <Link href="/zmanim">
                  כל הזמנים
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
               </Link>
            </Button>
         </div>
      </div>
   );
}

function ZmanItem({
   label,
   time,
   icon,
   highlight = false,
}: {
   label: string;
   time?: string;
   icon: LucideIcon;
   highlight?: boolean;
}) {
   const Icon = icon;

   return (
      <div
         className={`rounded-lg border px-3 py-2 ${highlight ? "border-white/20 bg-white/10" : "border-white/10 bg-white/5"}`}
      >
         <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-white/80" aria-hidden="true" />
            <span className="text-xs font-semibold text-white/80">{label}</span>
         </div>
         <span className="mt-1 text-xl font-bold tabular-nums text-white/95">
            {time || "--:--"}
         </span>
      </div>
   );
}
