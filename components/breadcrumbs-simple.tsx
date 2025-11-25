import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb";

type LinkItem = {
    href: string;
    label: string;
}

export default function BreadcrumbsSimple({ links, current }: { links: LinkItem[], current?: string }) {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {links.map((link, index) => (
                    <BreadcrumbItem key={index}>
                        <BreadcrumbLink href={link.href}>{link.label}</BreadcrumbLink>
                        <BreadcrumbSeparator />
                    </BreadcrumbItem>
                ))}
                {current && <BreadcrumbItem>
                    <BreadcrumbPage>{current}</BreadcrumbPage>
                </BreadcrumbItem>}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
