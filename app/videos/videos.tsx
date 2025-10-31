'use client';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import videosWithCategories from "@/lib/videos_with_categories.json";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Videos() {
    const [open, setOpen] = useState(false);
    const [currentVideo, setCurrentVideo] = useState<{ title: string; url: string } | null>(null);

    const playVideo = (video: { title: string; url: string }) => {
        setCurrentVideo(video);
        setOpen(true);
    };

    const getVideoId = (url: string) => url.split("v=")[1];

    return (
        <>
            <div className="container mx-auto py-6 px-4 space-y-12">
                {Object.entries(
                    videosWithCategories.reduce((acc, video) => {
                        if (!acc[video.category]) {
                            acc[video.category] = [];
                        }
                        acc[video.category].push(video);
                        return acc;
                    }, {} as Record<string, typeof videosWithCategories>)
                ).map(([category, videos]) => (
                    <section key={category} className="space-y-4">
                        <details>
                            <summary className="px-4 flex cursor-pointer items-center ">
                                <h2 className="text-2xl font-bold flex-1 text-gray-900 dark:text-white  ">
                                    {category}
                                </h2>
                                <ChevronDown className="w-6 h-6 ml-2" />
                            </summary>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                                {videos.map((video) => {
                                    const videoId = getVideoId(video.url);
                                    return (
                                        <VideoCard
                                            video={video}
                                            videoId={videoId}
                                            playVideo={playVideo}
                                            key={video.url}
                                        />
                                    );
                                })}
                            </div>
                        </details>
                    </section>
                ))}
            </div>

            {/* Single Dialog for all videos */}
            {currentVideo && (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="sm:max-w-3xl w-full p-0 rounded-lg overflow-hidden">
                        <DialogHeader className="text-center justify-center items-center pt-4">
                            <DialogTitle>{currentVideo.title}</DialogTitle>
                            <DialogDescription className="hidden">
                                Watch the video in full screen.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="relative">
                            <iframe
                                width="100%"
                                height="480"
                                src={`https://www.youtube.com/embed/${getVideoId(currentVideo.url)}`}
                                title={currentVideo.title}
                                allowFullScreen
                                className="rounded-md"
                            />
                            <DialogClose className="absolute top-2 right-2 p-2 text-xl hover:text-destructive transition">
                                ✕
                            </DialogClose>
                        </div>
                    </DialogContent>
                </Dialog>
            )
            }
        </>
    );
}

import { Clock, Play } from 'lucide-react';

const VideoCard = ({
    video,
    videoId,
    playVideo
}: {
    video: { title: string; url: string; category: string };
    videoId: string;
    playVideo: (video: { title: string; url: string }) => void;
}) => {
    const handleClick = () => {
        playVideo(video);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            playVideo(video);
        }
    };

    return (
        <button
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            aria-label={`Play video: ${video.title}`}
            className="relative aspect-video w-full rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
            {/* Thumbnail Image */}
            <Image
                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                alt={video.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col justify-end p-4">
                {/* Text Content */}
                <div className="relative z-10 transform transition-transform duration-300 group-hover:translate-y-0 translate-y-1">
                    <span className="inline-block px-2 py-1 mb-2 text-xs font-medium text-white bg-white/20 backdrop-blur-sm rounded">
                        {video.category}
                    </span>
                    <h3 className="text-lg font-bold text-white line-clamp-2 drop-shadow-lg">
                        {video.title}
                    </h3>
                </div>
            </div>

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                    <Play className="w-8 h-8 text-gray-900 ml-1 fill-current" />
                </div>
            </div>

            {/* Duration Badge */}
            <div className="absolute top-3 right-3 px-2 py-1 text-xs font-semibold text-white bg-black/70 backdrop-blur-sm rounded flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>HD</span>
            </div>
        </button>
    );
};