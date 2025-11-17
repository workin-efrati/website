'use client';

import { cn } from '@/lib/utils'; // Assuming this is your Shadcn/Tailwind utility
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

interface CarouselNavItem {
    label: string;
    href: string;
}

interface CarouselNavProps {
    items: CarouselNavItem[];
    className?: string;
}

export function CarouselNav({ items, className }: CarouselNavProps) {
    const pathname = usePathname();
    const router = useRouter();
    const scrollRef = useRef<HTMLDivElement>(null);
    const isRTL = true    

    const activeIndex = items.findIndex((item) => {
        return decodeURIComponent(item.href) === decodeURIComponent(pathname)
    });

    // 3. Smoothly scroll the active item into the center
    useEffect(() => {
        if (scrollRef.current && activeIndex !== -1) {
            const container = scrollRef.current;
            const activeElement = container.children[activeIndex] as HTMLElement;
            if (activeElement) {
                // This is the magic: scrollIntoView with 'center' handles
                // all the calculations for LTR and RTL automatically.
                activeElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center',
                });
            }
        }
        // Run this effect only when the active page (pathname) changes
    }, [activeIndex, pathname]);

    
    // 4. Navigation handlers
    const handlePrevious = () => {
        const newIndex = activeIndex > 0 ? activeIndex - 1 : items.length - 1;
        router.push(items[newIndex].href);
    };

    const handleNext = () => {
        const newIndex = activeIndex < items.length - 1 ? activeIndex + 1 : 0;
        router.push(items[newIndex].href);
    };

    // 5. Dynamically set icons based on RTL
    const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
    const NextIcon = isRTL ? ChevronLeft : ChevronRight;

    return (
        <div className={cn('relative w-full mx-auto max-w-xl', className)}>
            {/* Main Carousel Viewport
        - `overflow-hidden`: Hides the parts of the scroll container that overflow
        - `relative`: Positions the nav buttons
      */}
            <div className="relative overflow-hidden rounded-lg border border-border bg-background">
                {/* Scrollable Container
          - `overflow-x-auto`: Allows horizontal scrolling
          - `snap-x snap-mandatory`: Enables CSS scroll-snapping
          - `px-16` or similar: This padding is CRUCIAL. It provides
            the "empty" space for the first and last items to be 
            centered, and creates the peeking effect.
          - `scrollbar-hide`: A common utility to hide the scrollbar
        */}
                <div
                    ref={scrollRef}
                    className={cn(
                        'flex flex-row  items-center gap-4 overflow-x-auto scroll-smooth',
                        'snap-x snap-mandatory',
                        'px-[10%]',
                        // Scrollbar hiding utilities
                        '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
                    )}
                >
                    {items.map((item, index) => {
                        const isActive = index === activeIndex;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'shrink-0 snap-center', // ESSENTIAL for scroll snap
                                    'relative flex h-24 w-4/5 flex-col items-center justify-center',
                                    'sm:w-3/5 md:w-1/2', // Responsive widths
                                    'rounded-lg p-4 transition-all duration-300 ease-out'
                                )}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                <span
                                    className={cn(
                                        'text-center font-medium transition-all duration-300',
                                        isActive
                                            ? 'scale-100 text-2xl text-foreground'
                                            : 'scale-90 text-lg text-muted-foreground opacity-60'
                                    )}
                                >
                                    {item.label}
                                </span>

                                {/* Active Indicator */}
                                <div
                                    className={cn(
                                        'absolute bottom-4 mt-2 h-1 rounded-full bg-primary transition-all duration-300',
                                        isActive ? 'w-10' : 'w-0'
                                    )}
                                />
                            </Link>
                        );
                    })}
                </div>

                {/* Navigation Buttons (Overlayed) */}
                {/* Use `start-` and `end-` for perfect RTL/LTR positioning */}
                <button
                    type="button"
                    onClick={handlePrevious}
                    className="absolute start-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/50 shadow-sm backdrop-blur-sm transition-all hover:bg-accent hover:shadow-md"
                    aria-label={isRTL ? 'הפריט הבא' : 'Previous item'}
                >
                    <PrevIcon className="h-5 w-5" />
                </button>

                <button
                    type="button"
                    onClick={handleNext}
                    className="absolute end-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/50 shadow-sm backdrop-blur-sm transition-all hover:bg-accent hover:shadow-md"
                    aria-label={isRTL ? 'הפריט הקודם' : 'Next item'}
                >
                    <NextIcon className="h-5 w-5" />
                </button>
            </div>

            {/* Dots Indicator (Unchanged, it's good) */}
            <div className="mt-4 flex items-center justify-center gap-2">
                {items.map((item, index) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'h-2 rounded-full transition-all duration-300',
                            index === activeIndex
                                ? 'w-6 bg-primary'
                                : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                        )}
                        aria-label={`Go to ${item.label}`}
                    />
                ))}
            </div>
        </div>
    );
}