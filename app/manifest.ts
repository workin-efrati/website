import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'למדני חוקיך',
        short_name: 'למדני חוקיך',
        description: "מאגר ענק של שאלות ותשובות בהלכה, אמונה ומחשבה. אתר 'למדני חוקך' בניהול הרב ברוך אפרתי.",
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
            {
                src: '/mani_192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/mani_512.png',
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: '/mani_192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/mani_512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
        screenshots: [
            {
                src: '/screenshot-mobile.png',
                sizes: '390x844',
                type: 'image/png',
                form_factor: 'narrow', // לנייד
            },
            {
                src: '/screenshot-desktop.png',
                sizes: '1920x1080',
                type: 'image/png',
                form_factor: 'wide', // למחשב
            }],
    }
}