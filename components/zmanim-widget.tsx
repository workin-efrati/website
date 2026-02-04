"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, MapPin, ArrowLeft, Navigation } from "lucide-react";
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

         const response = await fetch(
            `https://www.hebcal.com/zmanim?cfg=json&latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&date=${year}-${month}-${day}`
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
         <Card className={`w-full ${className}`} dir="rtl">
            <CardHeader className="pb-3">
               <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-2">
               {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
               ))}
            </CardContent>
         </Card>
      );
   }

   return (
      <Card
         className={`w-full pt-0 max-w-xl  overflow-hidden border-none shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_20px_40px_rgb(0,0,0,0.16)] dark:hover:shadow-[0_20px_40px_rgb(0,0,0,0.4)] ${className}`}
         dir="rtl"
      >
         {/* Premium Header with Gradient */}
         <div className="relative h-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400" />
         <CardHeader className="pb-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                     <Clock className="h-6 w-6" />
                  </div>
                  <div>
                     <CardTitle className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                        זמני היום
                     </CardTitle>
                     <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                        Daily Zmanim
                     </p>
                  </div>
               </div>
               <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                     <MapPin className="h-3.5 w-3.5 text-blue-500" />
                     <span>{locationName}</span>
                  </div>
               </div>
            </div>
         </CardHeader>

         <CardContent className="pt-6 pb-6 bg-white dark:bg-slate-950">
            {/* Zmanim Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
               <ZmanItem
                  label="הנץ החמה"
                  englishLabel="Sunrise"
                  time={zmanim?.sunrise}
                  icon="🌅"
                  colorClass="bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-100 border-amber-100 dark:border-amber-900/50"
                  iconBg="bg-amber-100 dark:bg-amber-900/40"
               />
               <ZmanItem
                  label="סוף זמן ק''ש"
                  englishLabel="Latest Shema"
                  time={zmanim?.sofZmanShma}
                  icon="📖"
                  colorClass="bg-blue-50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-100 border-blue-100 dark:border-blue-900/50"
                  iconBg="bg-blue-100 dark:bg-blue-900/40"
               />
               <ZmanItem
                  label="שקיעה"
                  englishLabel="Sunset"
                  time={zmanim?.sunset}
                  icon="🌇"
                  colorClass="bg-orange-50 dark:bg-orange-950/20 text-orange-900 dark:text-orange-100 border-orange-100 dark:border-orange-900/50"
                  iconBg="bg-orange-100 dark:bg-orange-900/40"
               />
               <ZmanItem
                  label="צאת הכוכבים"
                  englishLabel="Nightfall"
                  time={zmanim?.tzeitHaKochavim}
                  icon="⭐"
                  colorClass="bg-indigo-50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-100 border-indigo-100 dark:border-indigo-900/50"
                  iconBg="bg-indigo-100 dark:bg-indigo-900/40"
               />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
               <Button
                  onClick={detectLocation}
                  disabled={isDetectingLocation}
                  className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 active:scale-[0.98] disabled:opacity-50"
               >
                  <Navigation className={`h-4 w-4 ${isDetectingLocation ? "animate-pulse" : ""}`} />
                  {isDetectingLocation ? "מזהה..." : "מיקום שלי"}
               </Button>

               <Link href="/zmanim" className="flex-1">
                  <Button className="w-full cursor-pointer flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-extrabold transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg active:scale-[0.98] group">
                     כל הזמנים
                     <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  </Button>
               </Link>
            </div>

            {/* Premium Footer */}
            {/* <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between">
               <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                  Halachic Times (GR''A)
               </span>
               <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600">
                  {new Date().toLocaleDateString("he-IL")}
               </span>
            </div> */}
         </CardContent>
      </Card>
   );
}

function ZmanItem({
   label,
   englishLabel,
   time,
   icon,
   colorClass,
   iconBg,
}: {
   label: string;
   englishLabel: string;
   time?: string;
   icon: string;
   colorClass: string;
   iconBg: string;
}) {
   return (
      <div
         className={`group flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 hover:translate-x-1 ${colorClass}`}
      >
         <div className="flex items-center gap-3">
            <div
               className={`w-10 h-10 flex items-center justify-center rounded-xl text-xl shadow-sm transition-transform duration-300 group-hover:scale-110 ${iconBg}`}
            >
               {icon}
            </div>
            <div className="flex flex-col">
               <span className="text-sm font-extrabold leading-tight">{label}</span>
               <span className="text-[10px] opacity-60 font-bold uppercase tracking-tight">
                  {englishLabel}
               </span>
            </div>
         </div>
         <span className="text-xl font-black tabular-nums tracking-tight">{time || "--:--"}</span>
      </div>
   );
}
