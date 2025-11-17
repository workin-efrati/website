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
            variant="outline"
            className="hover:bg-primary text-primary hover:text-white w-[145px] transition-colors duration-200 px-3 py-1 text-md flex items-center gap-2 justify-start cursor-pointer mr-auto group/badge text-ellipsis "
        >
            <button onClick={onClick}>
                <Tags size={24} strokeWidth={1.8} className="text-primary shrink-0 transition-colors duration-200 group-hover/badge:text-white" />
                <span className="text-ellipsis overflow-hidden">
                    {tag}
                </span>
            </button>
        </Badge>
    )
}
