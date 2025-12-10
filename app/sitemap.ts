import { favoriteTags } from '@/lib/favorite-tags-list';
import torahBooks from '@/lib/torah_toc.json';
import { baseUrl, cleanSlug } from '@/lib/utils';
import { TorahBook } from '@/lib/vorts-types';
import { connectToMongodb } from '@/server/connect';
import { IShut } from '@/server/models/shut.model';
import { readAllShutServiceWithSelect } from '@/server/services/shut.service';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

    // Base URLs
    const baseRoutes = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/qa`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/videos`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/vort`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        }
    ]

    await connectToMongodb()

    // Dynamic routes for categories
    const categories = getCategories()
    const categoryRoutes = categories.map((category: string) => ({
        url: `${baseUrl}/category/${category}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
    }))

    // Dynamic routes for individual Q&A pages
    const qaRoutes = (await readAllShutServiceWithSelect({ _id: 1, createdAt: 1, updatedAt: 1, tag: 1, titleQuestion: 1 }))
        .map((question: IShut) => ({
            url: `${baseUrl}/qa/${question._id}/${encodeURIComponent(cleanSlug(question.titleQuestion || 'שאלה'))}`,
            lastModified: new Date(question.updatedAt || question.createdAt || Date.now()),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
            tags: question.tag
        }))

    // Dynamic routes for individual vort pages
    const books = getBooks()
    const bookRoutes = books.map((book: string) => ({
        url: `${baseUrl}/vort/${book}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }))

    return [...baseRoutes, ...categoryRoutes, ...qaRoutes, ...bookRoutes]
}

function getCategories() {
    return favoriteTags.map(t => encodeURIComponent(t.name))
}

function getBooks() {
    const books = torahBooks as unknown as TorahBook[];
    return books.flatMap((b) => b.parashot.map((p) => encodeURIComponent(p.name)));
};