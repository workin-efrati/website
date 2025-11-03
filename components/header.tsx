"use client"
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const navItems = [
  // { label: "ילדים ונוער", href: "/kids" },
  { label: "שיעורי וידאו", href: "/videos" },
  // { label: "דרשות ומאמרים", href: "/articles" },
  { label: "שאלות ותשובות", href: "/qa" },
  // { label: "שאל את הרב", href: "/ask" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
    <header className="w-full fixed h-20  top-0 z-50 bg-primary/60 border-b border-primary/70 backdrop-blur-md text-white">
      <nav className="w-full h-full max-w-7xl mx-auto flex items-center justify-between px-4">
      <Link className="text-3xl font-bold" href={"/"}>לַמְּדֵנִי חֻקֶּיךָ</Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 font-semibold text-lg">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-blue-200 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-haspopup="dialog"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </nav>

      {/* Mobile Nav */}
      {open && (
        <div className="md:hidden flex flex-col items-center gap-4 py-4 text-lg font-semibold bg-blue-900/80 backdrop-blur-md">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-blue-200 transition-colors"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
      </header>
      {/* <div className='h-20'/> */}
    </>
  );
}
