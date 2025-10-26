import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronLeftIcon, HelpCircle } from 'lucide-react';

interface QuestionProps {
  id: string;
  question: string;
  title?: string;
  answer?: string;
  className?: string;
}

export default function QuestionCard({ 
  id, 
  question, 
  title = 'שאלה', 
  className 
}: QuestionProps) {
  return (
    <Link 
    href={`/qa/${id}`}
    className={cn(
      "group relative block p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 bg-white overflow-hidden",
      "hover:border-blue-200 hover:-translate-y-1",
      className
    )}
  >
    {/* Decorative gradient on hover */}
    {/* <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right" /> */}
    
    {/* Content wrapper */}
    <div className="relative">
      {/* Title with icon */}
      <div className="flex items-center gap-3 mb-3">
        <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-200">
          <HelpCircle className="w-4 h-4 text-blue-600" />
        </div>
        <h3 className="flex-1 text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
          {title}
        </h3>
      </div>
      
      {/* Question text */}
      <p className="text-gray-600 leading-relaxed line-clamp-3 text-sm">
        {question}
      </p>
      
      {/* Read more indicator */}
      <div className="mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
        <span className="ml-1">קרא עוד</span>
        <ChevronLeftIcon 
          className="w-4 h-4 mr-1 transform group-hover:-translate-x-1 transition-transform duration-200"
        />
      </div>
    </div>
  </Link>
  );
}
