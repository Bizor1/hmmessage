'use client';

import { useDropCountdown } from '@/hooks/useCountdown';
import { useCart } from '@/context/CartContext';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

interface SophisticatedCollectionOverlayProps {
    collectionHandle: string;
    onClose: () => void;
}

// Collections that should show countdown overlay
const RESTRICTED_COLLECTIONS = [
    'long-sleeve-tee',
    'long-sleeve-tees',
    'longsleeve',
    'longsleeve-tee',
    'shorts',
    'carpenter-shorts',
    'modular-message-shorts'
];

export default function SophisticatedCollectionOverlay({
    collectionHandle,
    onClose
}: SophisticatedCollectionOverlayProps) {
    const { days, hours, minutes, seconds, isExpired } = useDropCountdown();
    const { closeCart } = useCart();
    const [mounted, setMounted] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Determine collection type
    const isTeesCollection = collectionHandle.includes('long') || collectionHandle.includes('sleeve') || collectionHandle.includes('tee');
    const isShortsCollection = collectionHandle.includes('shorts') || collectionHandle.includes('carpenter');

    // Collection-specific imagery
    const getCollectionImages = useCallback(() => {
        if (isTeesCollection) {
            return [
                {
                    url: 'https://res.cloudinary.com/duhfv8nqy/image/upload/v1749621404/WhatsApp_Image_2025-06-09_at_9.18.52_AM_ps4u5f.jpg',
                    product: 'Under His Shelter',
                    type: 'Long Sleeve Tee'
                },
                {
                    url: 'https://res.cloudinary.com/duhfv8nqy/image/upload/v1749621403/WhatsApp_Image_2025-06-09_at_9.18.52_AM_1_jf1pzd.jpg',
                    product: 'Under His Shelter',
                    type: 'Model Shot'
                },
                {
                    url: 'https://res.cloudinary.com/duhfv8nqy/image/upload/v1749622132/DFE0B0E5-C406-4889-BFDF-460C915820D9_nrzl7s.png',
                    product: 'Under His Shelter',
                    type: 'Black Edition'
                }
            ];
        } else {
            return [
                {
                    url: 'https://res.cloudinary.com/duhfv8nqy/image/upload/v1749621658/CE172B24-BBD8-4CB2-B1D9-99598376708B_ke9ack.jpg',
                    product: 'Modular Message',
                    type: 'Carpenter Shorts'
                },
                {
                    url: 'https://res.cloudinary.com/duhfv8nqy/image/upload/v1749621654/F98AFA65-781D-4F09-8569-4F3A75E2F13D_ffmsme.jpg',
                    product: 'Modular Message',
                    type: 'Washed Blue'
                },
                {
                    url: 'https://res.cloudinary.com/duhfv8nqy/image/upload/v1747325445/mymessage/images/PHOTO-2025-04-29-10-42-32.jpg',
                    product: 'Modular Message',
                    type: 'Black Shorts'
                },
                {
                    url: 'https://res.cloudinary.com/duhfv8nqy/image/upload/v1747325443/mymessage/images/PHOTO-2025-04-29-10-42-32%20%282%29.jpg',
                    product: 'Modular Message',
                    type: 'Black Detail'
                }
            ];
        }
    }, [isTeesCollection]);

    // Move useEffect hooks outside conditional blocks to fix React hooks error
    useEffect(() => {
        setMounted(true);

        // Close cart when overlay opens to prevent conflicts
        closeCart();

        const images = getCollectionImages();
        // Cycle through images elegantly
        const imageInterval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, isTeesCollection ? 4000 : 3500);

        return () => clearInterval(imageInterval);
    }, [collectionHandle, isTeesCollection, closeCart, getCollectionImages]);

    // Don't show overlay if countdown is expired
    if (isExpired || !mounted) {
        return null;
    }

    // Check if current collection should be restricted
    const isRestrictedCollection = RESTRICTED_COLLECTIONS.some(restricted =>
        collectionHandle.toLowerCase().includes(restricted) ||
        restricted.includes(collectionHandle.toLowerCase())
    );

    if (!isRestrictedCollection) {
        return null;
    }

    const timeUnits = [
        { label: 'DAYS', value: days },
        { label: 'HOURS', value: hours },
        { label: 'MINUTES', value: minutes },
        { label: 'SECONDS', value: seconds },
    ];

    const collectionImages = getCollectionImages();
    const currentImage = collectionImages[currentImageIndex];

    // Render different designs based on collection type
    if (isTeesCollection) {
        // LONG SLEEVE TEES - Elegant, Minimal, Portrait-focused (Mobile Optimized)
        return (
            <div className="fixed inset-0 z-[200] bg-white overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    {collectionImages.map((image, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                                }`}
                        >
                            <Image
                                src={image.url}
                                alt={image.product}
                                fill
                                className="w-full h-full object-cover object-center"
                            />
                            {/* Mobile-optimized gradient overlay for better text readability */}
                            <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-white/90 via-white/70 to-white/40 sm:from-white/80 sm:via-white/60 sm:to-transparent"></div>
                        </div>
                    ))}
                </div>

                {/* Mobile-First Content Layout */}
                <div className="relative z-10 flex items-center min-h-screen text-black px-4 sm:px-8 md:px-16">
                    <div className="max-w-2xl mx-auto sm:mx-0 text-center sm:text-left">
                        {/* Access Denied Message - Mobile Optimized */}
                        <div className="mb-8 sm:mb-12">
                            <div className="inline-block bg-black text-white px-4 py-2 mb-4 sm:mb-6">
                                <span className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] font-light">
                                    Restricted Access
                                </span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-thin uppercase tracking-wide leading-none mb-4 sm:mb-6">
                                <span className="block">Under</span>
                                <span className="block">His</span>
                                <span className="block">Shelter</span>
                            </h1>

                            <div className="text-lg sm:text-xl md:text-2xl font-light tracking-wide mb-6 sm:mb-8 opacity-80">
                                {currentImage.type}
                            </div>

                            <div className="text-sm sm:text-base md:text-lg font-light tracking-wide opacity-70 max-w-lg mb-8 sm:mb-12">
                                This exclusive long sleeve collection drops on June 15, 2025 at 1:00 PM BST.
                                Premium cotton essentials designed for timeless style.
                            </div>
                        </div>

                        {/* Mobile-Optimized Countdown for Tees */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
                            {timeUnits.map((unit, index) => (
                                <div key={unit.label} className="text-center">
                                    <div className="relative">
                                        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-thin mb-1 sm:mb-2 text-black">
                                            {unit.value.toString().padStart(2, '0')}
                                        </div>
                                        <div className="text-[10px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.2em] opacity-60 font-light">
                                            {unit.label}
                                        </div>
                                        <div className="w-full h-px bg-black/20 mt-1 sm:mt-2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Date Info */}
                        <div className="text-center sm:text-left mb-8 sm:mb-12">
                            <div className="text-sm sm:text-base md:text-lg font-light tracking-wide opacity-80">
                                15 June 2025 • 1:00 PM BST
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile-Optimized Image Navigation */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 sm:bottom-8 sm:left-8 sm:transform-none z-30">
                    <div className="flex gap-2">
                        {collectionImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-2 h-2 sm:w-2 sm:h-2 rounded-full transition-all duration-300 touch-manipulation ${index === currentImageIndex ? 'bg-black scale-125' : 'bg-black/30 active:bg-black/60'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (isShortsCollection) {
        // CARPENTER SHORTS - Bold, Industrial, Product-focused (Mobile Optimized)
        return (
            <div className="fixed inset-0 z-[200] bg-black overflow-hidden">
                {/* Mobile-Optimized Background Layout */}
                <div className="absolute inset-0">
                    {/* Mobile: Absolute positioned cycling images, Desktop: Sophisticated grid */}
                    <div className="hidden sm:grid sm:grid-cols-2 h-full">
                        {collectionImages.map((image, index) => (
                            <div
                                key={`desktop-${index}`}
                                className="relative overflow-hidden transition-all duration-1000 sm:scale-100 sm:hover:scale-105"
                            >
                                <Image
                                    src={image.url}
                                    alt={image.product}
                                    fill
                                    className="w-full h-full object-cover"
                                />
                                <div className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex
                                    ? 'bg-orange-500/60'
                                    : 'bg-black/60'
                                    }`}></div>
                            </div>
                        ))}
                    </div>

                    {/* Mobile: Absolute positioned images like tees collection */}
                    <div className="sm:hidden">
                        {collectionImages.map((image, index) => (
                            <div
                                key={`mobile-${index}`}
                                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                            >
                                <Image
                                    src={image.url}
                                    alt={image.product}
                                    fill
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-orange-500/25"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile-First Center Content */}
                <div className="relative z-10 flex items-center justify-center min-h-screen text-white px-4 sm:px-8">
                    <div className="text-center max-w-4xl">
                        {/* Mobile-Optimized Bold Header */}
                        <div className="mb-8 sm:mb-12">
                            <div className="inline-block bg-orange-500 text-black px-4 sm:px-6 md:px-8 py-2 sm:py-3 mb-6 sm:mb-8 transform -rotate-1 sm:-rotate-2">
                                <span className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold">
                                    DROP INCOMING
                                </span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-black uppercase tracking-tight leading-none mb-4 sm:mb-6">
                                <span className="block text-orange-400">MODULAR</span>
                                <span className="block text-white">MESSAGE</span>
                            </h1>

                            <div className="text-xl sm:text-2xl md:text-3xl font-bold tracking-wide mb-6 sm:mb-8 text-orange-300">
                                CARPENTER SHORTS
                            </div>

                            <div className="text-sm sm:text-base md:text-lg font-medium tracking-wide opacity-90 max-w-2xl mx-auto mb-8 sm:mb-12">
                                Premium workwear-inspired shorts with modular details. Built for the modern urban explorer.
                                Drops June 15, 2025 at 1:00 PM BST.
                            </div>
                        </div>

                        {/* Mobile-Optimized Industrial Countdown */}
                        <div className="bg-black/80 backdrop-blur-xl border-2 border-orange-500/30 p-4 sm:p-6 md:p-8 mb-8 sm:mb-12 transform rotate-0 sm:rotate-1">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                                {timeUnits.map((unit, index) => (
                                    <div key={unit.label} className="text-center relative">
                                        <div className="absolute inset-0 bg-orange-500/20 rounded-lg"></div>
                                        <div className="relative p-2 sm:p-3 md:p-4">
                                            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black mb-1 sm:mb-2 text-orange-400">
                                                {unit.value.toString().padStart(2, '0')}
                                            </div>
                                            <div className="text-[10px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.2em] text-white/80 font-bold">
                                                {unit.label}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Date Info */}
                        <div className="text-center mb-8 sm:mb-12">
                            <div className="text-base sm:text-lg md:text-xl font-bold text-orange-400">
                                15 JUNE 2025 • 1:00 PM BST
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Image Navigation */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 sm:hidden z-30">
                    <div className="flex gap-2">
                        {collectionImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 touch-manipulation ${index === currentImageIndex ? 'bg-orange-400 scale-125' : 'bg-orange-400/40 active:bg-orange-400/80'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Mobile-Optimized Corner Counter */}
                <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-30">
                    <div className="bg-orange-500 text-black rounded-full px-3 py-1 sm:px-4 sm:py-2">
                        <span className="text-xs sm:text-sm font-black">
                            {(currentImageIndex + 1).toString().padStart(2, '0')} / {collectionImages.length.toString().padStart(2, '0')}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    // Fallback (shouldn't reach here, but just in case)
    return null;
} 