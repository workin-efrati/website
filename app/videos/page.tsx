import HeaderPlaceholder from '@/components/header-placeholder'
import Image from 'next/image'
import Videos from './videos'

export const metadata = {
  title: 'סרטונים מעניינים – אקטואליה, חגים וחברה',
  description: 'צפו בסרטונים חינוכיים ומרתקים בנושא אקטואליה, מועדים וחגים, ותיהנו מתכנים איכותיים בעברית.',
}

export default function VideosPage() {
  return (
    <>
      <HeaderPlaceholder className="bg-primary" />
      <div className="relative flex flex-col h-[40vh]">
        <Image
          src={'/cover3.webp'}
          alt={'harav Efrati'}
          fill
          fetchPriority="high"
          sizes="(min-width:1024px) 1200px, (min-width:640px) 800px, 600px"
          className="object-cover object-top-left opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-primary/90 via-primary/70 to-primary/60" />
        <div className="flex justify-center items-center flex-1 px-4 text-center">
          <h1 className="text-3xl relative z-10 md:text-7xl font-extrabold leading-tight text-white" >
            סרטונים
          </h1>
        </div>
      </div>
      <Videos />
    </>
  )
}
