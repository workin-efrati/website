import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface BreadcrumbItem {
   name: string;
   url: string;
}

interface BreadcrumbsProps {
   items: BreadcrumbItem[];
   className?: string;
}

/**
 * Visual breadcrumb navigation component
 * Displays navigable breadcrumb trail for users
 */
export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
   return (
      <nav aria-label="breadcrumb" className={`text-sm ${className}`}>
         <ol className="inline-flex items-center gap-2 flex-wrap">
            {items.map((item, idx) => (
               <li key={item.url} className="flex items-center">
                  {idx < items.length - 1 ? (
                     <>
                        <Link
                           href={item.url}
                           className="hover:text-blue-600 transition-colors"
                        >
                           {item.name}
                        </Link>
                        <ChevronLeft className="mx-1 h-4 w-4 text-gray-400" aria-hidden="true" />
                     </>
                  ) : (
                     <span className="font-medium text-gray-900" aria-current="page">
                        {item.name}
                     </span>
                  )}
               </li>
            ))}
         </ol>
      </nav>
   );
}
