import HeaderPlaceholder from '@/components/header-placeholder'
import Image from 'next/image'
import Videos from './videos'

export const generateMetadata = async () => ({
  title: "סרטונים",
  description: "צפו בסרטונים חינוכיים ומרתקים בנושא אקטואליה, מועדים וחגים.",
});


export default function VideosPage() {
  return (
    <>
      <div className="relative flex flex-col h-[40vh]">
        <Image
          src={'/hero.webp'}
          alt={'people learning'}
          fill
          fetchPriority="high"
          sizes="(min-width:1024px) 1200px, (min-width:640px) 800px, 600px"
          className="object-cover object-center opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-blue-900/80 via-blue-800/60 to-transparent" />
        <HeaderPlaceholder />
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
