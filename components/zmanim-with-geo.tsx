"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Calendar, Sunrise, Sunset, Sun, Moon, Navigation, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

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
      { id: "haifa", name: "חיפה", nameEn: "Haifa", latitude: 32.7940, longitude: 34.9896, country: "israel" },
      { id: "beersheva", name: "באר שבע", nameEn: "Be'er Sheva", latitude: 31.2518, longitude: 34.7913, country: "israel" },
      { id: "netanya", name: "נתניה", nameEn: "Netanya", latitude: 32.3215, longitude: 34.8532, country: "israel" },
      { id: "bneibraq", name: "בני ברק", nameEn: "Bnei Brak", latitude: 32.0809, longitude: 34.8338, country: "israel" },
      { id: "ramatgan", name: "רמת גן", nameEn: "Ramat Gan", latitude: 32.0719, longitude: 34.8237, country: "israel" },
      { id: "petahtikva", name: "פתח תקווה", nameEn: "Petah Tikva", latitude: 32.0871, longitude: 34.8880, country: "israel" },
      { id: "ashdod", name: "אשדוד", nameEn: "Ashdod", latitude: 31.8044, longitude: 34.6553, country: "israel" },
      { id: "ashkelon", name: "אשקלון", nameEn: "Ashkelon", latitude: 31.6688, longitude: 34.5742, country: "israel" },
      { id: "rehovot", name: "רחובות", nameEn: "Rehovot", latitude: 31.8914, longitude: 34.8095, country: "israel" },
      { id: "modiin", name: "מודיעין", nameEn: "Modi'in", latitude: 31.8969, longitude: 35.0098, country: "israel" },
      { id: "eilat", name: "אילת", nameEn: "Eilat", latitude: 29.5577, longitude: 34.9519, country: "israel" },
      { id: "tiberias", name: "טבריה", nameEn: "Tiberias", latitude: 32.7940, longitude: 35.5308, country: "israel" },
      { id: "safed", name: "צפת", nameEn: "Safed", latitude: 32.9658, longitude: 35.4983, country: "israel" },
   ],
   usa: [
      { id: "newyork", name: "ניו יורק", nameEn: "New York", latitude: 40.7128, longitude: -74.0060, country: "usa" },
      { id: "losangeles", name: "לוס אנג'לס", nameEn: "Los Angeles", latitude: 34.0522, longitude: -118.2437, country: "usa" },
      { id: "miami", name: "מיאמי", nameEn: "Miami", latitude: 25.7617, longitude: -80.1918, country: "usa" },
      { id: "chicago", name: "שיקגו", nameEn: "Chicago", latitude: 41.8781, longitude: -87.6298, country: "usa" },
      { id: "philadelphia", name: "פילדלפיה", nameEn: "Philadelphia", latitude: 39.9526, longitude: -75.1652, country: "usa" },
      { id: "baltimore", name: "בולטימור", nameEn: "Baltimore", latitude: 39.2904, longitude: -76.6122, country: "usa" },
      { id: "boston", name: "בוסטון", nameEn: "Boston", latitude: 42.3601, longitude: -71.0589, country: "usa" },
      { id: "detroit", name: "דטרויט", nameEn: "Detroit", latitude: 42.3314, longitude: -83.0458, country: "usa" },
      { id: "cleveland", name: "קליבלנד", nameEn: "Cleveland", latitude: 41.4993, longitude: -81.6944, country: "usa" },
      { id: "lasvegas", name: "לאס וגאס", nameEn: "Las Vegas", latitude: 36.1699, longitude: -115.1398, country: "usa" },
   ],
   uk: [
      { id: "london", name: "לונדון", nameEn: "London", latitude: 51.5074, longitude: -0.1278, country: "uk" },
      { id: "manchester", name: "מנצ'סטר", nameEn: "Manchester", latitude: 53.4808, longitude: -2.2426, country: "uk" },
      { id: "gateshead", name: "גייטסהד", nameEn: "Gateshead", latitude: 54.9526, longitude: -1.6033, country: "uk" },
   ],
   france: [
      { id: "paris", name: "פריז", nameEn: "Paris", latitude: 48.8566, longitude: 2.3522, country: "france" },
      { id: "marseille", name: "מרסיי", nameEn: "Marseille", latitude: 43.2965, longitude: 5.3698, country: "france" },
      { id: "lyon", name: "ליון", nameEn: "Lyon", latitude: 45.7640, longitude: 4.8357, country: "france" },
      { id: "strasbourg", name: "שטרסבורג", nameEn: "Strasbourg", latitude: 48.5734, longitude: 7.7521, country: "france" },
   ],
   belgium: [
      { id: "antwerp", name: "אנטוורפן", nameEn: "Antwerp", latitude: 51.2194, longitude: 4.4025, country: "belgium" },
      { id: "brussels", name: "בריסל", nameEn: "Brussels", latitude: 50.8503, longitude: 4.3517, country: "belgium" },
   ],
   canada: [
      { id: "toronto", name: "טורונטו", nameEn: "Toronto", latitude: 43.6532, longitude: -79.3832, country: "canada" },
      { id: "montreal", name: "מונטריאול", nameEn: "Montreal", latitude: 45.5017, longitude: -73.5673, country: "canada" },
      { id: "vancouver", name: "ונקובר", nameEn: "Vancouver", latitude: 49.2827, longitude: -123.1207, country: "canada" },
   ],
   australia: [
      { id: "sydney", name: "סידני", nameEn: "Sydney", latitude: -33.8688, longitude: 151.2093, country: "australia" },
      { id: "melbourne", name: "מלבורן", nameEn: "Melbourne", latitude: -37.8136, longitude: 144.9631, country: "australia" },
   ],
   argentina: [
      { id: "buenosaires", name: "בואנוס איירס", nameEn: "Buenos Aires", latitude: -34.6037, longitude: -58.3816, country: "argentina" },
   ],
   brazil: [
      { id: "saopaulo", name: "סאו פאולו", nameEn: "São Paulo", latitude: -23.5505, longitude: -46.6333, country: "brazil" },
   ],
   southafrica: [
      { id: "johannesburg", name: "יוהנסבורג", nameEn: "Johannesburg", latitude: -26.2041, longitude: 28.0473, country: "southafrica" },
      { id: "capetown", name: "קייפטאון", nameEn: "Cape Town", latitude: -33.9249, longitude: 18.4241, country: "southafrica" },
   ],
   switzerland: [
      { id: "zurich", name: "ציריך", nameEn: "Zurich", latitude: 47.3769, longitude: 8.5417, country: "switzerland" },
      { id: "geneva", name: "ז'נבה", nameEn: "Geneva", latitude: 46.2044, longitude: 6.1432, country: "switzerland" },
   ],
};

const COUNTRY_NAMES: Record<string, string> = {
   israel: "ישראל",
   usa: "ארצות הברית",
   uk: "בריטניה",
   france: "צרפת",
   belgium: "בלגיה",
   canada: "קנדה",
   australia: "אוסטרליה",
   argentina: "ארגנטינה",
   brazil: "ברזיל",
   southafrica: "דרום אפריקה",
   switzerland: "שוויץ",
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
      <Card className="w-full pt-0 max-w-2xl mx-auto shadow-lg" dir="rtl">
         <CardHeader className="bg-gradient-to-r py-6 from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
            <div className="flex items-center justify-between">
               <div className="flex-1">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                     <Clock className="h-6 w-6" />
                     זמני היום
                  </CardTitle>
                  <CardDescription className="mt-2 text-base flex items-center gap-4 flex-wrap">
                     <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {location.name}
                     </span>
                     <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {hebrewDate}
                     </span>
                  </CardDescription>
               </div>
               <div className="text-left">
                  <div className="text-3xl font-bold tabular-nums">
                     {currentTime.toLocaleTimeString("he-IL", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                     })}
                  </div>
                  <div className="text-sm text-muted-foreground">
                     {currentTime.toLocaleDateString("he-IL", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                     })}
                  </div>
               </div>
            </div>

            {/* City Selector */}
            <div className="mt-4 space-y-2">
               <Select value={selectedCity} onValueChange={handleCityChange}>
                  <SelectTrigger className="w-full">
                     <SelectValue placeholder="בחר עיר מהרשימה" />
                  </SelectTrigger>
                  <SelectContent>
                     {Object.entries(CITIES).map(([countryCode, cities]) => (
                        <SelectGroup key={countryCode}>
                           <SelectLabel className="font-bold text-primary">
                              {COUNTRY_NAMES[countryCode]}
                           </SelectLabel>
                           {cities.map((city) => (
                              <SelectItem key={city.id} value={city.id}>
                                 {city.name} ({city.nameEn})
                              </SelectItem>
                           ))}
                        </SelectGroup>
                     ))}
                  </SelectContent>
               </Select>

               <div className="flex gap-2">
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={getUserLocation}
                     disabled={gettingLocation}
                     className="gap-2 flex-1"
                  >
                     {gettingLocation ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                     ) : (
                        <Navigation className="h-4 w-4" />
                     )}
                     זהה מיקום אוטומטי
                  </Button>
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={fetchZmanim}
                     className="gap-2"
                  >
                     <RefreshCw className="h-4 w-4" />
                     רענן
                  </Button>
               </div>
            </div>
         </CardHeader>

         <CardContent className="pt-6">
            {error && (
               <Alert className="mb-4 border-red-200 bg-red-50 dark:bg-red-950">
                  <AlertDescription className="text-red-800 dark:text-red-200">
                     {error}
                  </AlertDescription>
               </Alert>
            )}

            <div className="grid gap-3">
               {zmanimItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                     <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg transition-all hover:scale-[1.02] ${item.highlight
                           ? "bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 shadow-sm"
                           : "bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
                           }`}
                     >
                        <div className="flex items-center gap-3 flex-1">
                           <Icon className={`h-5 w-5 flex-shrink-0 ${item.highlight ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`} />
                           <div>
                              <div className={`font-medium ${item.highlight ? "text-blue-900 dark:text-blue-100" : ""}`}>
                                 {item.label}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                 {item.desc}
                              </div>
                           </div>
                        </div>
                        <span className={`text-lg font-bold tabular-nums ${item.highlight ? "text-blue-700 dark:text-blue-300" : ""}`}>
                           {item.value}
                        </span>
                     </div>
                  );
               })}
            </div>

            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
               <p className="text-sm text-amber-900 dark:text-amber-100 text-center">
                  ⚠️ הזמנים מחושבים לפי {location.name}. לדיוק מקסימלי, בחר את העיר המדויקת או השתמש בזיהוי מיקום אוטומטי.
               </p>
            </div>
         </CardContent>
      </Card>
   );
}