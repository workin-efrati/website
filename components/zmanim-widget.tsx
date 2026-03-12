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
         <Card className={`w-full ${className} max-w-xl`} dir="rtl">
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
         className={`w-full pt-0 max-w-xl gap-0 overflow-hidden border-none shadow-2xl transition-all duration-500 hover:shadow-primary/20 ${className}`}
         dir="rtl"
      >
         <CardHeader className="pb-6 pt-8 bg-linear-to-tr from-primary to-primary/80 text-white border-none relative overflow-hidden">
            {/* Decorative background circle */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />

            <div className="flex items-center justify-between relative z-10">
               <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg">
                     <Clock className="h-7 w-7" />
                  </div>
                  <div>
                     <CardTitle className="text-2xl font-bold tracking-tight font-(--font-bona)">
                        זמני היום
                     </CardTitle>
                     <p className="text-xs font-medium text-white/60 mt-0.5">
                        Zmanim for Today
                     </p>
                  </div>
               </div>
               <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-white border border-white/20 shadow-sm">
                     <MapPin className="h-3.5 w-3.5 text-white/90" />
                     <span>{locationName}</span>
                  </div>
               </div>
            </div>
         </CardHeader>

         <CardContent className="pt-6 pb-6 bg-white dark:bg-slate-950">
            {/* Zmanim Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
               <ZmanItem
                  label="הנץ החמה"
                  time={zmanim?.sunrise}
                  icon="🌅"
                  highlight={true}
               />
               <ZmanItem
                  label="סוף זמן ק''ש"
                  time={zmanim?.sofZmanShma}
                  icon="📖"
               />
               <ZmanItem
                  label="שקיעת החמה"
                  time={zmanim?.sunset}
                  icon="🌇"
                  highlight={true}
               />
               <ZmanItem
                  label="צאת הכוכבים"
                  time={zmanim?.tzeitHaKochavim}
                  icon="⭐"
               />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
               <Button
                  onClick={detectLocation}
                  disabled={isDetectingLocation}
                  variant="outline"
                  className="flex-1 cursor-pointer flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-bold border-primary/10 hover:bg-primary/5 hover:text-primary transition-all duration-300"
               >
                  <Navigation className={`h-4 w-4 ${isDetectingLocation ? "animate-spin" : ""}`} />
                  {isDetectingLocation ? "מזהה..." : "מיקום שלי"}
               </Button>

               <Link href="/zmanim" className="flex-1">
                  <Button className="w-full cursor-pointer flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-extrabold bg-primary hover:bg-primary/80 text-white shadow-md hover:shadow-xl transition-all duration-300 group">
                     כל הזמנים
                     <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  </Button>
               </Link>
            </div>
         </CardContent>
      </Card>
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
   icon: string;
   highlight?: boolean;
}) {
   return (
      <div
         className={`group flex flex-col p-4 rounded-2xl border transition-all duration-300 hover:shadow-md ${highlight
               ? "bg-primary/5 border-primary/10 hover:border-primary/30"
               : "bg-gray-50/50 border-gray-100 hover:border-gray-200"
            }`}
      >
         <div className="flex items-center gap-2 mb-2">
            <span className="text-xl group-hover:scale-110 transition-transform duration-300">{icon}</span>
            <span className="text-xs font-bold text-gray-500 mt-0.5">{label}</span>
         </div>
         <span className={`text-2xl font-black tabular-nums tracking-tighter ${highlight ? "text-primary" : "text-slate-900"}`}>
            {time || "--:--"}
         </span>
      </div>
   );
}
