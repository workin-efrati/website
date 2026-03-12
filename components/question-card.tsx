import { cleanSlug, cn } from '@/lib/utils';
import { HelpCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import QuestionCardTagLink from './question-card-tag-link';

interface QuestionProps {
  id: string;
  question: string;
  title?: string;
  answer?: string;
  tag?: string;
  className?: string;
  rankTitle: 'h2' | 'h3' | 'h4',
  isAnswer?: boolean
}

export default function QuestionCard({
  id,
  question,
  rankTitle,
  answer,
  title = 'שאלה',
  tag,
  className,
  isAnswer
}: QuestionProps) {
  return (
    <Link
      href={`/qa/${id}/${encodeURIComponent(cleanSlug(title))}`}
      className={cn(
        "group relative border flex flex-col border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 bg-white overflow-hidden",
        "hover:border-blue-200 hover:-translate-y-1",
        className
      )}
    >
      {/* Decorative gradient on hover */}
      {/* <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right" /> */}

      {/* Content wrapper */}

      {/* Title with icon */}
      <div className="flex  items-center gap-3 p-4 mb-3 bg-linear-to-tr h-20 text-white group-hover:from-primary/20 from-primary group-hover:to-primary/10 to-primary/80 ">
        <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-primary transition-colors duration-200">
          <HelpCircle className="w-4 h-4 text-primary group-hover:text-white transition-colors duration-200" />
        </div>
        {React.createElement(rankTitle,
          { className: "flex-1 text-xl font-semibold group-hover:text-primary transition-colors duration-200 leading-tight" },
          title
        )}
      </div>

      <div className="px-4 pb-4">
        {/* Question text */}
        <p className="text-gray-600  leading-relaxed line-clamp-3 text-sm mb-2">
          {(isAnswer && answer) &&
            <span className="font-bold">שאלה: {" "} </span>
          }
          {question}
        </p>
        {(isAnswer && answer) && <p className="text-gray-600 leading-relaxed line-clamp-2 text-sm">
          <span className="font-bold">תשובה: {" "} </span>
          {answer}
        </p>}
      </div>
      <div className='flex-1' />

      {/* Read more indicator */}
      <div className=" flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700 pb-6 pl-6">
        {/* <span className="ml-1">קרא עוד</span>
          <ChevronLeftIcon
            className="w-4 h-4 mr-1 transform group-hover:-translate-x-1 transition-transform duration-200"
          /> */}
        {tag && <QuestionCardTagLink tag={tag} />}
      </div>
    </Link>
  );
}
