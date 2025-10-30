import { baseUrl } from '@/lib/utils'
import { connectToMongodb } from '@/server/connect'
import { IShut } from '@/server/models/shut.model'
import { readAllShutServiceWithSelect } from '@/server/services/shut.service'
import { MetadataRoute } from 'next'

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
    ]

    await connectToMongodb()

    // Dynamic routes for categories
    const categories = await getCategories()
    const categoryRoutes = categories.map((category: any) => ({
        url: `${baseUrl}/category/${category._id}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
    }))

    // Dynamic routes for individual Q&A pages
    const qaRoutes = (await readAllShutServiceWithSelect({ _id: 1, createdAt: 1, updatedAt: 1 }))
        .map((question: IShut) => ({
            url: `${baseUrl}/qa/${question._id}`,
            lastModified: new Date(question.updatedAt || question.createdAt || Date.now()),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }))

    return [...baseRoutes, ...categoryRoutes, ...qaRoutes]
}

// Helper function to get categories (you'll need to implement this based on your data source)
async function getCategories() {
    // Replace this with your actual category fetching logic
    // Example: return prisma.category.findMany({ select: { id: true } })
    return []
}