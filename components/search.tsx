'use client';

// import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Search as SearchIcon } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

type Variant = 'blue' | 'black' | 'white';

interface SearchProps {
  placeholder?: string;
  variant?: Variant;
  addPathName?: string;
  autoFocus?: boolean;
}

const variants = {
  blue: {
    border: 'border-white',
    text: 'text-white',
    placeholder: 'placeholder:text-white',
    icon: 'text-white'
  },
  black: {
    border: 'border-white',
    text: 'text-white',
    placeholder: 'placeholder:text-white',
    icon: 'text-white'
  },
  white: {
    border: 'border-gray-500',
    text: 'text-gray-500',
    placeholder: 'placeholder:text-gray-500',
    icon: 'text-gray-500'
  }
};

export default function Search({ placeholder, variant = 'white', addPathName = '', autoFocus }: SearchProps) {
  const searchParams = useSearchParams();
  const searchValue = new URLSearchParams(searchParams).get('query') || ''
  const { replace } = useRouter();
  const pathname = usePathname();

  const currentVariant = variants[variant];


  const handleSearch = useDebouncedCallback((term: string) => {
    console.log(`Searching... ${term}`);
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) params.set('query', term);
    else params.delete('query');
    replace(`${pathname}${addPathName}?${params.toString()}`);
  }, 300);

  return (
    <div className="w-full max-w-2xl">
      <div className="relative">
        <label htmlFor="search" className="sr-only">
          חיפוש
        </label>
        <SearchIcon
          className={`absolute left-5 top-4 h-6 w-6 md:w-8 ${currentVariant.icon} pointer-events-none`}
          strokeWidth={2.5}
        />
        <input
          id="search"
          type="text"
          autoFocus={autoFocus}
          defaultValue={searchValue}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          placeholder={placeholder}
          dir="rtl"
          className={`block w-full rounded-full border-4 ${currentVariant.border} bg-transparent py-3 pl-14 pr-6 text-lg md:text-xl ${currentVariant.text} ${currentVariant.placeholder} outline-none focus:ring-0 transition-colors`}
        />
      </div>
    </div>
  );
}