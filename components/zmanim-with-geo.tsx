"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Clock, Info, Moon, Navigation, RefreshCw, Sun, Sunrise, Sunset } from "lucide-react";
import { useEffect, useState } from "react";

interface Zmanim {
   alotHaShachar: string;
   misheyakir: string;
   sunrise: string;
   sofZmanShma: string;
   sofZmanTfilla: string;
   chatzot: string;
   minchaGedola: string;
   minchaKetana: string;
   plagHaMincha: string;
   sunset: string;
   tzeitHaKochavim: string;
   tzeitHaKochavim72: string;
}

interface Location {
   name: string;
   latitude: number;
   longitude: number;
}

interface City {
   id: string;
   name: string;
   nameEn: string;
   latitude: number;
   longitude: number;
   country: string;
}

// Comprehensive list of cities
const CITIES: Record<string, City[]> = {
   israel: [
      { id: "jerusalem", name: "ירושלים", nameEn: "Jerusalem", latitude: 31.7683, longitude: 35.2137, country: "israel" },
      { id: "telaviv", name: "תל אביב", nameEn: "Tel Aviv", latitude: 32.0853, longitude: 34.7818, country: "israel" },
      { id: "bneibraq", name: "בני ברק", nameEn: "Bnei Brak", latitude: 32.0809, longitude: 34.8338, country: "israel" },
      { id: "haifa", name: "חיפה", nameEn: "Haifa", latitude: 32.7940, longitude: 34.9896, country: "israel" },
      { id: "beersheva", name: "באר שבע", nameEn: "Be'er Sheva", latitude: 31.2518, longitude: 34.7913, country: "israel" },
   ],
   usa: [
      { id: "newyork", name: "ניו יורק", nameEn: "New York", latitude: 40.7128, longitude: -74.0060, country: "usa" },
      { id: "miami", name: "מיאמי", nameEn: "Miami", latitude: 25.7617, longitude: -80.1918, country: "usa" },
      { id: "losangeles", name: "לוס אנג'לס", nameEn: "Los Angeles", latitude: 34.0522, longitude: -118.2437, country: "usa" },
   ],
   uk: [
      { id: "london", name: "לונדון", nameEn: "London", latitude: 51.5074, longitude: -0.1278, country: "uk" },
      { id: "manchester", name: "מנצ'סטר", nameEn: "Manchester", latitude: 53.4808, longitude: -2.2426, country: "uk" },
   ],
   france: [
      { id: "paris", name: "פריז", nameEn: "Paris", latitude: 48.8566, longitude: 2.3522, country: "france" },
      { id: "marseille", name: "מרסיי", nameEn: "Marseille", latitude: 43.2965, longitude: 5.3698, country: "france" },
   ],
   belgium: [
      { id: "antwerp", name: "אנטוורפן", nameEn: "Antwerp", latitude: 51.2194, longitude: 4.4025, country: "belgium" },
   ],
   canada: [
      { id: "toronto", name: "טורונטו", nameEn: "Toronto", latitude: 43.6532, longitude: -79.3832, country: "canada" },
      { id: "montreal", name: "מונטריאול", nameEn: "Montreal", latitude: 45.5017, longitude: -73.5673, country: "canada" },
   ],
   others: [
      { id: "melbourne", name: "מלבורן", nameEn: "Melbourne", latitude: -37.8136, longitude: 144.9631, country: "others" },
      { id: "buenosaires", name: "בואנוס איירס", nameEn: "Buenos Aires", latitude: -34.6037, longitude: -58.3816, country: "others" },
      { id: "johannesburg", name: "יוהנסבורג", nameEn: "Johannesburg", latitude: -26.2041, longitude: 28.0473, country: "others" },
      { id: "zurich", name: "ציריך", nameEn: "Zurich", latitude: 47.3769, longitude: 8.5417, country: "others" },
   ],
};

const COUNTRY_NAMES: Record<string, string> = {
   israel: "ישראל",
   usa: "ארה\"ב",
   uk: "בריטניה",
   france: "צרפת",
   belgium: "בלגיה",
   canada: "קנדה",
   others: "מקומות נוספים",
};

export default function ZmanimDisplayWithCitySelect() {
   const [zmanim, setZmanim] = useState<Zmanim | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [currentTime, setCurrentTime] = useState(new Date());
   const [hebrewDate, setHebrewDate] = useState<string>("");
   const [selectedCity, setSelectedCity] = useState<string>("jerusalem");
   const [location, setLocation] = useState<Location>({
      name: "ירושלים",
      latitude: 31.7683,
      longitude: 35.2137,
   });
   const [gettingLocation, setGettingLocation] = useState(false);

   useEffect(() => {
      const timer = setInterval(() => {
         setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(timer);
   }, []);

   useEffect(() => {
      fetchZmanim();
   }, [location.latitude, location.longitude]);

   // Handle city selection
   const handleCityChange = (cityId: string) => {
      setSelectedCity(cityId);

      // Find the city in all countries
      for (const cities of Object.values(CITIES)) {
         const city = cities.find(c => c.id === cityId);
         if (city) {
            setLocation({
               name: city.name,
               latitude: city.latitude,
               longitude: city.longitude,
            });
            break;
         }
      }
   };

   async function getLocationName(lat: number, lon: number): Promise<string> {
      try {
         const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=he`
         );
         const data = await response.json();
         return data.address?.city || data.address?.town || data.address?.village || "המיקום שלי";
      } catch {
         return "המיקום שלי";
      }
   }

   async function getUserLocation() {
      if (!navigator.geolocation) {
         setError("הדפדפן שלך לא תומך בזיהוי מיקום");
         return;
      }

      setGettingLocation(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
         async (position) => {
            const { latitude, longitude } = position.coords;
            const locationName = await getLocationName(latitude, longitude);

            setLocation({
               name: locationName,
               latitude,
               longitude,
            });
            setSelectedCity(""); // Clear city selection when using geolocation
            setGettingLocation(false);
         },
         (error) => {
            setError("לא הצלחנו לזהות את המיקום שלך. אנא אפשר גישה למיקום בדפדפן.");
            setGettingLocation(false);
         }
      );
   }

   async function fetchZmanim() {
      try {
         setLoading(true);
         setError(null);

         const today = new Date();
         const year = today.getFullYear();
         const month = String(today.getMonth() + 1).padStart(2, "0");
         const day = String(today.getDate()).padStart(2, "0");

         const response = await fetch(
            `https://www.hebcal.com/zmanim?cfg=json&latitude=${location.latitude}&longitude=${location.longitude}&date=${year}-${month}-${day}`
         );

         if (!response.ok) throw new Error("Failed to fetch zmanim");
         const data = await response.json();

         const hebrewDateResponse = await fetch(
            `https://www.hebcal.com/converter?cfg=json&gy=${year}&gm=${month}&gd=${day}&g2h=1`
         );
         const hebrewDateData = await hebrewDateResponse.json();
         setHebrewDate(`${hebrewDateData.hd} ${hebrewDateData.hm} ${hebrewDateData.hy}`);

         setZmanim({
            alotHaShachar: formatTime(data.times.alotHaShachar),
            misheyakir: formatTime(data.times.misheyakir),
            sunrise: formatTime(data.times.sunrise),
            sofZmanShma: formatTime(data.times.sofZmanShma),
            sofZmanTfilla: formatTime(data.times.sofZmanTfilla),
            chatzot: formatTime(data.times.chatzot),
            minchaGedola: formatTime(data.times.minchaGedola),
            minchaKetana: formatTime(data.times.minchaKetana),
            plagHaMincha: formatTime(data.times.plagHaMincha),
            sunset: formatTime(data.times.sunset),
            tzeitHaKochavim: formatTime(data.times.tzeit7083deg),
            tzeitHaKochavim72: formatTime(data.times.tzeit72min),
         });
      } catch (err) {
         setError(err instanceof Error ? err.message : "שגיאה בטעינת הזמנים");
      } finally {
         setLoading(false);
      }
   }

   function formatTime(isoString: string): string {
      if (!isoString) return "--:--";
      const date = new Date(isoString);
      return date.toLocaleTimeString("he-IL", {
         hour: "2-digit",
         minute: "2-digit",
      });
   }

   const zmanimItems = [
      { label: "עלות השחר", value: zmanim?.alotHaShachar, icon: Moon, desc: "תחילת היום ההלכתי" },
      { label: 'משיכיר (10.2°)', value: zmanim?.misheyakir, icon: Sun, desc: "זמן טלית ותפילין" },
      { label: "הנץ החמה", value: zmanim?.sunrise, icon: Sunrise, highlight: true, desc: "זמן תפילה למהדרין" },
      { label: 'סוף זמן ק"ש (גר"א)', value: zmanim?.sofZmanShma, icon: Clock, highlight: true, desc: "שליש היום" },
      { label: 'סוף זמן תפילה (גר"א)', value: zmanim?.sofZmanTfilla, icon: Clock, highlight: true, desc: "4 שעות זמניות" },
      { label: "חצות היום", value: zmanim?.chatzot, icon: Sun, desc: "אמצע היום" },
      { label: "מנחה גדולה", value: zmanim?.minchaGedola, icon: Sun, desc: "חצי שעה לאחר חצות" },
      { label: "מנחה קטנה", value: zmanim?.minchaKetana, icon: Sun, desc: "9.5 שעות זמניות" },
      { label: 'פלג המנחה (גר"א)', value: zmanim?.plagHaMincha, icon: Sun, desc: "זמן הדלקת נרות לחלק" },
      { label: "שקיעת החמה", value: zmanim?.sunset, icon: Sunset, highlight: true, desc: "סוף היום" },
      { label: "צאת הכוכבים (8.5°)", value: zmanim?.tzeitHaKochavim, icon: Moon, highlight: true, desc: "סוף שבת וחג" },
      { label: "צאת הכוכבים (72 דקות)", value: zmanim?.tzeitHaKochavim72, icon: Moon, desc: "לרבנו תם" },
   ];

   if (loading) {
      return (
         <Card className="w-full max-w-2xl mx-auto" dir="rtl">
            <CardHeader>
               <Skeleton className="h-8 w-48" />
               <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent className="space-y-2">
               {[...Array(12)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
               ))}
            </CardContent>
         </Card>
      );
   }

   return (
      <Card className="w-full max-w-2xl mx-auto border-none shadow-none" dir="rtl">
         <CardHeader className="space-y-3">
            {/* <div className="flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="flex-1 text-center md:text-right w-full">
                  <CardTitle className="text-3xl font-bold flex items-center justify-center md:justify-start gap-3 font-(--font-bona)">
                     <Clock className="h-8 w-8 text-white/90" aria-hidden="true" />
                     <h2>זמני היום</h2>
                  </CardTitle>
                  <CardDescription className="mt-3 text-white/80 text-lg flex items-center justify-center md:justify-start gap-4 flex-wrap">
                     <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                        <MapPin className="h-4 w-4" />
                        {location.name}
                     </span>
                  </CardDescription>
               </div>
               <div className="text-center md:text-left bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20 w-fit">
                  <div className="text-4xl font-bold tabular-nums tracking-tight">
                     {currentTime.toLocaleTimeString("he-IL", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                     })}
                  </div>
                  <div className="text-sm text-white/70 mt-1 font-medium">
                     {currentTime.toLocaleDateString("he-IL", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                     })}
                  </div>
               </div>
            </div> */}
            <div className="flex flex-col items-center text-center gap-1">
               <CardTitle className="text-2xl font-(--font-bona)">בחר מיקום</CardTitle>
               <CardDescription>הזמנים מחושבים לפי העיר שתבחרו או לפי מיקום המכשיר</CardDescription>
               <span className="font-bold underline decoration-amber-300">{location.name}</span>
            </div>

            {/* City Selector */}
            <div className="space-y-3">
               <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3">
                  <div className="flex-1">
                     <Select value={selectedCity} onValueChange={handleCityChange}>
                        <SelectTrigger className="w-full h-11 text-base font-medium" aria-label="בחר עיר להצגת זמנים">
                           <SelectValue placeholder="בחר עיר מהרשימה" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                           {Object.entries(CITIES).map(([countryCode, cities]) => (
                              <SelectGroup key={countryCode}>
                                 <SelectLabel className="font-bold border-b pb-1 mb-1">
                                    {COUNTRY_NAMES[countryCode]}
                                 </SelectLabel>
                                 {cities.map((city) => (
                                    <SelectItem key={city.id} value={city.id} className="cursor-pointer">
                                       {city.name} ({city.nameEn})
                                    </SelectItem>
                                 ))}
                              </SelectGroup>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
                  <div className="flex gap-2">
                     <Button
                        variant="outline"
                        onClick={getUserLocation}
                        disabled={gettingLocation}
                        className="gap-2 px-6"
                        aria-label="זהה מיקום באופן אוטומטי"
                     >
                        {gettingLocation ? (
                           <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
                        ) : (
                           <Navigation className="h-4 w-4" aria-hidden="true" />
                        )}
                        <span className="hiddeni sm:inline">מיקום שלי</span>
                     </Button>
                     <Button
                        variant="secondary"
                        onClick={fetchZmanim}
                        className="gap-2 px-6"
                        aria-label="רענן זמני היום"
                     >
                        <RefreshCw className="h-5 w-5" aria-hidden="true" />
                        <span className="hiddeni sm:inline">רענן </span>
                     </Button>
                  </div>
               </div>
            </div>
         </CardHeader>

         <CardContent className="pt-8 pb-8">
            {error && (
               <Alert className="mb-6 border-destructive/20 bg-destructive/10">
                  <AlertDescription className="text-destructive font-medium flex items-center gap-2">
                     <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                     <span>{error}</span>
                  </AlertDescription>
               </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {zmanimItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                     <div
                        key={index}
                        className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${item.highlight
                           ? "bg-primary/5 border-2 border-primary/10 shadow-sm"
                           : "bg-gray-50/50 border border-gray-100 hover:border-primary/20 hover:bg-white hover:shadow-md"
                           }`}
                     >
                        <div className="flex items-center gap-4 flex-1">
                           <div className={`p-2.5 rounded-xl ${item.highlight ? "bg-primary text-white" : "bg-white text-primary border border-primary/10 shadow-sm"}`}>
                              <Icon className="h-5 w-5 shrink-0" />
                           </div>
                           <div className="min-w-0">
                              <div className={`font-bold text-base truncate ${item.highlight ? "text-primary" : "text-gray-800"}`}>
                                 {item.label}
                              </div>
                              <div className="text-xs text-gray-500 font-medium">
                                 {item.desc}
                              </div>
                           </div>
                        </div>
                        <span className={`text-xl font-extrabold tabular-nums tracking-tight ${item.highlight ? "text-primary" : "text-gray-900"}`}>
                           {item.value}
                        </span>
                     </div>
                  );
               })}
            </div>

            <div className="mt-8 rounded-xl border bg-muted/30 p-4 flex items-start gap-3">
               <Info className="h-5 w-5 text-muted-foreground mt-0.5" aria-hidden="true" />
               <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  הזמנים מחושבים לפי <span className="font-bold underline decoration-amber-300">{location.name}</span>. לדיוק הלכתי מקסימלי, מומלץ לבחור את העיר המדויקת או להשתמש בלחצן זיהוי המיקום.
               </p>
            </div>
         </CardContent>
      </Card>
   );
}
