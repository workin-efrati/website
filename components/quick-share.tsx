
"use client"
import { Check, Link2 } from 'lucide-react';
import { useState } from 'react';

interface ShareComponentProps {
    url?: string;
    title?: string;
    text?: string;
    iconOnly?: boolean;
}

export default function QuickShare({
    url = typeof window !== 'undefined' ? window.location.href : '',
    title = '',
    text = '',
    iconOnly = false
}: ShareComponentProps) {
    const [copied, setCopied] = useState(false);
    const [isHovering, setIsHovering] = useState<'whatsapp' | 'copy' | null>(null);

    const handleWhatsAppShare = () => {
        const message = `${title}${text ? ` - ${text}` : ''}\n${url}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="flex items-center gap-2 flex-wrap" dir="rtl">
            {/* WhatsApp Share Button */}
            <button
                onClick={handleWhatsAppShare}
                onMouseEnter={() => setIsHovering('whatsapp')}
                onMouseLeave={() => setIsHovering(null)}
                className={`group cursor-pointer relative inline-flex items-center justify-center ${
                    iconOnly ? 'p-2.5 rounded-xl' : 'gap-2.5 px-6 py-3 rounded-xl'
                } bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold transition-all duration-300 shadow-md shadow-green-500/20 hover:shadow-lg hover:scale-105 active:scale-95`}
                aria-label="שתף בוואטסאפ"
                title="שתף בוואטסאפ"
            >
                {/* Shine effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        backgroundSize: '200% 100%',
                        animation: isHovering === 'whatsapp' ? 'shine 1.5s ease-in-out infinite' : 'none'
                    }}
                />

                <svg
                    className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:rotate-12"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                {!iconOnly && <span className="hidden md:block z-10 text-sm md:text-base">שתף בוואטסאפ</span>}

                {/* Ripple effect on click */}
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 bg-white/30 scale-0 group-active:scale-100 transition-transform duration-300 rounded-full" />
                </div>
            </button>

            {/* Copy Link Button */}
            <button
                onClick={handleCopyLink}
                onMouseEnter={() => setIsHovering('copy')}
                onMouseLeave={() => setIsHovering(null)}
                className={`group cursor-pointer relative inline-flex items-center justify-center ${
                    iconOnly ? 'p-2.5 rounded-xl' : 'gap-2.5 px-6 py-3 rounded-xl'
                } font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 ${copied
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/30'
                    : 'bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 border border-gray-200 hover:border-gray-300'
                    }`}
                aria-label="העתק קישור"
                title={copied ? "הועתק בהצלחה!" : "העתק קישור"}
            >
                {/* Background glow effect */}
                {copied && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 blur-md opacity-50 -z-10 animate-pulse" />
                )}

                <div className="relative z-10 flex items-center justify-center gap-2">
                    {copied ? (
                        <>
                            <div className="relative">
                                <Check className="w-5 h-5 animate-bounce" />
                                {/* Success ring */}
                                <div className="absolute inset-0 rounded-full border-2 border-white/50 scale-150 animate-ping" />
                            </div>
                            {!iconOnly && <span className="text-sm md:text-base font-semibold">הועתק בהצלחה!</span>}
                        </>
                    ) : (
                        <>
                            <Link2 className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
                            {!iconOnly && <span className="text-sm md:text-base">העתק קישור</span>}
                        </>
                    )}
                </div>

                {/* Shine effect */}
                {!copied && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                            backgroundSize: '200% 100%',
                            animation: isHovering === 'copy' ? 'shine 1.5s ease-in-out infinite' : 'none'
                        }}
                    />
                )}
            </button>

            <style jsx>{`
                @keyframes shine {
                    0% {
                        background-position: -200% 0;
                    }
                    100% {
                        background-position: 200% 0;
                    }
                }
            `}</style>
        </div>
    );
}