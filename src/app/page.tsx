'use client';

import Link from "next/link";
import { CldImage } from 'next-cloudinary';

export default function Home() {
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
          <div className="mb-4 text-xs uppercase tracking-widest">Coming Soon</div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 uppercase tracking-wide">UNDER HIS SHELTER</h1>
          <div className="text-xl mb-8">
            <span>02</span> / <span>06</span> / <span>2025</span> #<span> ANTICIPATE</span>
          </div>
          <Link
            href="/story"
            className="btn-underline"
          >
            <span className="mr-2">→</span> New Arrivals
          </Link>
        </div>
      </section>

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
          <div className="mb-2 text-xs uppercase tracking-widest letter-spacing-wider">Discover</div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 uppercase tracking-wide">NEW ARRIVALS</h2>
          <Link
            href="/collections/all"
            className="btn-underline mb-16 md:mb-0"
          >
            SHOP NOW
          </Link>
        </div>
      </section>

      {/* Under His Shelter Collection - Video Section */}
      <section className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="https://res.cloudinary.com/duhfv8nqy/video/upload/v1/mymessage/videos/2025_05_08_13_07_IMG_6845" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Subtle gradient overlay for text readability */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <div className="mb-3 text-xs uppercase tracking-widest">EXPLORE COLLECTIONS</div>
          <div className="space-y-3 md:space-y-4 mb-6">
            <Link
              href="/collections/all"
              className="block text-xl md:text-3xl font-medium uppercase opacity-100"
            >
              Under His Shelter
            </Link>
            <Link
              href="/products/black-rhinestones-distressed-sweatshirt"
              className="block text-lg md:text-2xl font-medium uppercase opacity-60 hover:opacity-100 transition-opacity"
            >
              Rhinestone
            </Link>
            <Link
              href="/products/dark-grey-washed-t-shirt"
              className="block text-lg md:text-2xl font-medium uppercase opacity-60 hover:opacity-100 transition-opacity"
            >
              Grey Washed
            </Link>
          </div>
          <Link
            href="/collections/all"
            className="btn-underline"
          >
            <span className="mr-2">→</span> DISCOVER
          </Link>
        </div>
      </section>

      {/* 247 Collection - Video Section */}
      <section className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="https://res.cloudinary.com/duhfv8nqy/video/upload/v1/mymessage/videos/2025_05_08_13_07_IMG_6846" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Subtle gradient overlay for text readability */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <div className="mb-3 text-xs uppercase tracking-widest">EXPLORE COLLECTIONS</div>
          <div className="space-y-3 md:space-y-4 mb-6">
            <Link
              href="/collections/all"
              className="block text-lg md:text-2xl font-medium uppercase opacity-60 hover:opacity-100 transition-opacity"
            >
              Under His Shelter
            </Link>
            <Link
              href="/products/black-rhinestones-distressed-sweatshirt"
              className="block text-xl md:text-3xl font-medium uppercase opacity-100"
            >
              Rhinestone
            </Link>
            <Link
              href="/products/dark-grey-washed-t-shirt"
              className="block text-lg md:text-2xl font-medium uppercase opacity-60 hover:opacity-100 transition-opacity"
            >
              Grey washed
            </Link>
          </div>
          <Link
            href="/products/black-rhinestones-distressed-sweatshirt"
            className="btn-underline"
          >
            <span className="mr-2">→</span> DISCOVER
          </Link>
        </div>
      </section>

      {/* Woman Collection - Video Section */}
      <section className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="https://res.cloudinary.com/duhfv8nqy/video/upload/v1/mymessage/videos/2025_05_08_13_07_IMG_6847" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Subtle gradient overlay for text readability */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <div className="mb-3 text-xs uppercase tracking-widest">EXPLORE COLLECTIONS</div>
          <div className="space-y-3 md:space-y-4 mb-6">
            <Link
              href="/collections/all"
              className="block text-lg md:text-2xl font-medium uppercase opacity-60 hover:opacity-100 transition-opacity"
            >
              Under His Shelter
            </Link>
            <Link
              href="/products/black-rhinestones-distressed-sweatshirt"
              className="block text-lg md:text-2xl font-medium uppercase opacity-60 hover:opacity-100 transition-opacity"
            >
              Rhinestone
            </Link>
            <Link
              href="/products/dark-grey-washed-t-shirt"
              className="block text-xl md:text-3xl font-medium uppercase opacity-100"
            >
              Grey Washed
            </Link>
          </div>
          <Link
            href="/products/dark-grey-washed-t-shirt"
            className="btn-underline"
          >
            <span className="mr-2">→</span> DISCOVER
          </Link>
        </div>
      </section>

      {/* Initial Collection - Video Section */}
      <section className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="https://res.cloudinary.com/duhfv8nqy/video/upload/v1/mymessage/videos/2025_05_08_13_07_IMG_6846" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Subtle gradient overlay for text readability */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <div className="mb-3 text-xs uppercase tracking-widest">EXPLORE COLLECTIONS</div>
          <div className="space-y-3 md:space-y-4 mb-6">
            <Link
              href="/collections/all"
              className="block text-lg md:text-2xl font-medium uppercase opacity-60 hover:opacity-100 transition-opacity"
            >
              Under His Shelter
            </Link>
            <Link
              href="/products/black-rhinestones-distressed-sweatshirt"
              className="block text-lg md:text-2xl font-medium uppercase opacity-60 hover:opacity-100 transition-opacity"
            >
              Rhinestone
            </Link>
            <Link
              href="/products/dark-grey-washed-t-shirt"
              className="block text-xl md:text-3xl font-medium uppercase opacity-100"
            >
              Grey washed
            </Link>
          </div>
          <Link
            href="/products/dark-grey-washed-t-shirt"
            className="btn-underline"
          >
            <span className="mr-2">→</span> DISCOVER
          </Link>
        </div>
      </section>
    </div>
  );
}
