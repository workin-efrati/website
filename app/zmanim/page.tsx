import HeaderPlaceholder from "@/components/header-placeholder";
import ZmanimDisplayWithLocation from "@/components/zmanim-with-geo";
import { Metadata } from "next";

export const metadata: Metadata = {
   title: "זמני היום",
   description: "זמני היום",
}

export default function Zmanim() {
   return <div>
      <HeaderPlaceholder />
      <div className="py-4">
         <ZmanimDisplayWithLocation />
      </div>
   </div>
}