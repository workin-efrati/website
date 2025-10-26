import Image from 'next/image';
import Link from 'next/link';
import { connectToMongodb } from '@/server/connect';
import { getTagsWithNoParent } from '@/server/services/tags.service';

export default async function Tags() {
   await connectToMongodb()
   const tags = (await getTagsWithNoParent() || [])

  return (
    <section className="flex px-4 pt-8 pb-0 gap-6 overflow-x-auto scroll-smooth w-fit max-w-full mx-auto scroll-snap-x-mandatory">
      {tags.map((t) => (
        <Link
          key={t._id}
          href={`/category/${t._id}`}
          className="group scroll-snap-start transition-all text-primary hover:text-primary/50 shrink-0 grow-0 block text-center"
        >
          <Image
            src={t.coverImage || t.topicImages?.[0] || '/images/boy.png'}
            alt={t.name}
            width={100}
            height={100}
            className="rounded-full mx-auto transition duration-200 group-hover:grayscale"
          />
          <p className="text-center w-[100px] font-semibold pb-2">{t.name}</p>
        </Link>
      ))}
    </section>
  );
}
