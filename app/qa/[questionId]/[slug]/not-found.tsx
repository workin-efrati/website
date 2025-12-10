import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center gap-6 p-4 text-center">
      <div className="space-y-2">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold tracking-tight">הדף לא נמצא</h2>
        <p className="max-w-md text-muted-foreground">
          נראה שהשאלה שחיפשת לא קיימת או שהוסרה. ייתכן שהיא נמחקה או שהועברה למיקום אחר.
        </p>
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <Button asChild variant="default" size="lg">
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            חזרה לדף הבית
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/qa">
            צפה בשאלות אחרות
          </Link>
        </Button>
      </div>
    </div>
  );
}
