"use client"
import { Tags } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Badge } from './ui/badge'

export default function QuestionCardTagLink({ tag }: { tag: string }) {
    const router = useRouter()
    const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        router.push(`/category/${tag}`)
    }

    return (
        <Badge
            asChild
            className="hover:bg-blue-600 hover:text-white w-[145px] transition-colors duration-200 px-3 py-1 text-md flex items-center gap-2 justify-start cursor-pointer mr-auto text-ellipsis "
        >
            <button onClick={onClick}>
                <Tags size={24} strokeWidth={1.8} className=" text-(--primary-blue) shrink-0" />
                <span className="text-ellipsis overflow-hidden">
                    {tag}
                </span>
            </button>
        </Badge>
    )
}
