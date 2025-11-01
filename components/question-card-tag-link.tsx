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
        <button className=" flex items-center gap-2 justify-end cursor-pointer mr-auto " onClick={onClick}>
            <Badge className="hover:bg-blue-600 hover:text-white  transition-colors duration-200">
                <Tags size={24} strokeWidth={1.8} className=" text-(--primary-blue)" />
                {tag}
            </Badge>
        </button>
    )
}
