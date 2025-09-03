'use client';

import Link from "next/link";
import { CldImage } from 'next-cloudinary';
import { useState, useEffect } from 'react';
import CountdownDisplay from '@/components/CountdownDisplay';
import DropShowcase from '@/components/DropShowcase';
import FashionCountdown from '@/components/FashionCountdown';
import { useDropCountdown } from '@/hooks/useCountdown';

interface CollectionWithVideo {
  id: string;
  handle: string;
  title: string;
  description: string;
  firstProductVideo: {
    sources: Array<{
      url: string;
      mimeType: string;
      format: string;
      height: number;
      width: number;
    }>;
    preview?: {
      image?: {
        url: string;
      };
    };
  } | null;
}

interface CollectionsWithVideosResponse {
  collections: CollectionWithVideo[];
}

export default function Home() {
  const [collections, setCollections] = useState<CollectionWithVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isExpired } = useDropCountdown();

  useEffect(() => {
    async function fetchCollectionsWithMedia() {
      try {
        // Add cache-busting parameter and headers for fresh data
        const cacheBuster = Date.now();
        const response = await fetch(`/api/collections-with-videos?t=${cacheBuster}`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
          cache: 'no-store'
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: CollectionsWithVideosResponse = await response.json();

        console.log(`✅ Loaded ${data.collections.length} collections for home page`);

        setCollections(data.collections);
      } catch (error) {
        console.error('Error fetching collections with media:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCollectionsWithMedia();
  }, []);

  // Get first video from a collection using admin API data
  const getFirstVideoUrl = (collection: CollectionWithVideo): string | null => {
    if (!collection.firstProductVideo || !collection.firstProductVideo.sources.length) {
      return null;
    }

    const video = collection.firstProductVideo;
    console.log(`\n🔍 ADMIN API VIDEO for ${collection.title}:`);
    console.log('Available sources:', video.sources.length);

    video.sources.forEach((source: any, index: number) => {
      console.log(`  Source ${index + 1}:`);
      console.log(`    URL: ${source.url}`);
      console.log(`    Format: ${source.format}`);
      console.log(`    MIME: ${source.mimeType}`);
      console.log(`    Size: ${source.width}x${source.height}`);
    });

    // Check if there's a preview image
    if (video.preview?.image?.url) {
      console.log(`Preview image: ${video.preview.image.url}`);
    }

    // Use proxy for the video to handle CORS
    const firstSourceUrl = video.sources[0].url;
    const proxyUrl = `/api/video/proxy?url=${encodeURIComponent(firstSourceUrl)}`;
    console.log(`Using proxy URL: ${proxyUrl}`);

    return proxyUrl;
  };

  // Fallback videos for collections without videos
  const fallbackVideos = [
    "https://res.cloudinary.com/duhfv8nqy/video/upload/v1748345551/WhatsApp_Video_2025-05-15_at_10.52.41_AM_gzpmqj.mp4",
    "https://res.cloudinary.com/duhfv8nqy/video/upload/v1748345542/WhatsApp_Video_2025-05-15_at_10.52.41_AM_1_kz90gp.mp4",
    "https://res.cloudinary.com/duhfv8nqy/video/upload/v1748345540/WhatsApp_Video_2025-05-15_at_10.52.42_AM_rca8pk.mp4"
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <section className="relative w-full h-screen">
        {/* Hero image */}
        <div className="absolute inset-0">
          <CldImage
            src="mymessage/images/WhatsApp Image 2025-05-14 at 12.29.28 PM (2)"
            alt="Giant sneaker in cityscape"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>

        {/* Hero content overlay */}
        <div className="relative flex flex-col items-center justify-center h-full text-center text-white px-4">
          <div className="mb-4 text-xs uppercase tracking-widest"></div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 uppercase tracking-wide"></h1>
          <div className="text-xl mb-8">
            <span> </span>
          </div>
          <Link
            href="/new-arrivals"
            className="btn-underline"
          >
            <span className="mr-2">→</span> New Arrivals
          </Link>
        </div>
      </section>

      {/* SOPHISTICATED FASHION COUNTDOWN - Moved up after hero section */}
      {!isExpired && <FashionCountdown />}

      {/* Full-height fashion image section */}
      <section className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0">
          <CldImage
            src="mymessage/images/WhatsApp Image 2025-05-14 at 12.29.26 PM (1)"
            alt="Fashion model with blinds"
            fill
            className="object-cover object-center"
            sizes="100vw"
            quality={100}
          />
          {/* Subtle gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center md:justify-end text-center text-white px-4 pb-0 md:pb-32">
          <Link
            href="/collections/all"
            className="btn-underline"
          >
            <span className="mr-2">→</span> DISCOVER
          </Link>          <h2 className="text-3xl md:text-5xl font-bold mb-6 uppercase tracking-wide"></h2>
          <Link
            href="/collections/all"
            className="btn-underline mb-16 md:mb-0"
          >
            SHOP NOW
          </Link>
        </div>
      </section>

      {/* Dynamic Collection Video Sections */}
      {!isLoading && collections.map((collection, index) => {
        const shopifyVideoUrl = getFirstVideoUrl(collection);
        // Use fallback video if Shopify video doesn't exist or fails
        const videoUrl = shopifyVideoUrl || fallbackVideos[index % fallbackVideos.length];

        // Use the actual collections in the order they were fetched
        const allCollections = collections.map(col => ({
          title: col.title,
          href: `/collections/${col.handle}`,
          handle: col.handle
        }));

        // Determine which collection should be highlighted (current one)
        const currentCollectionHandle = collection.handle;

        return (
          <section key={collection.id} className="relative w-full h-screen overflow-hidden">
            <div className="absolute inset-0">
              <video
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                onError={() => {
                  // Fallback is already handled above, no need to log
                }}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {/* Subtle gradient overlay for text readability */}
              <div className="absolute inset-0 bg-black/30"></div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
              <div className="space-y-3 md:space-y-4 mb-6">
                {allCollections.map((col) => (
                  <Link
                    key={col.handle}
                    href={col.href}
                    className={`block font-medium uppercase transition-opacity ${col.handle === currentCollectionHandle
                      ? 'text-xl md:text-3xl opacity-100'
                      : 'text-lg md:text-2xl opacity-60 hover:opacity-100'
                      }`}
                  >
                    {col.title}
                  </Link>
                ))}
              </div>
              <Link
                href={`/collections/${collection.handle}`}
                className="btn-underline"
              >
                <span className="mr-2">→</span> DISCOVER
              </Link>
            </div>
          </section>
        );
      })}

      {/* Loading state for video sections */}
      {isLoading && (
        <section className="relative w-full h-screen overflow-hidden">
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-500">Loading collections...</div>
          </div>
        </section>
      )}
    </div>
  );
}
