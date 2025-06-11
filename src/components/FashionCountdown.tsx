'use client';

import { useDropCountdown } from '@/hooks/useCountdown';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface FashionCountdownProps {
    className?: string;
}

export default function FashionCountdown({ className = '' }: FashionCountdownProps) {
    const { days, hours, minutes, seconds, isExpired } = useDropCountdown();
    const [mounted, setMounted] = useState(false);
    const [currentLayout, setCurrentLayout] = useState(0);

    // All product and human photos organized by collection
    const collectionAssets = {
        tees: {
            human: [
                'https://res.cloudinary.com/duhfv8nqy/image/upload/v1749621404/WhatsApp_Image_2025-06-09_at_9.18.52_AM_ps4u5f.jpg',
                'https://res.cloudinary.com/duhfv8nqy/image/upload/v1749621403/WhatsApp_Image_2025-06-09_at_9.18.52_AM_1_jf1pzd.jpg',
                'https://res.cloudinary.com/duhfv8nqy/image/upload/v1749622132/DFE0B0E5-C406-4889-BFDF-460C915820D9_nrzl7s.png'
            ],
            products: [
                'https://res.cloudinary.com/duhfv8nqy/image/upload/v1749622259/White_front_vvqvr8.jpg',
                'https://res.cloudinary.com/duhfv8nqy/image/upload/v1749622259/Whiteback_dd47cj.png',
                'https://res.cloudinary.com/duhfv8nqy/image/upload/v1749622131/Blackfront_qnzpya.jpg',
                'https://res.cloudinary.com/duhfv8nqy/image/upload/v1749622131/Black_back_g3l790.png'
            ]
        },
        shorts: {
            products: [
                'https://res.cloudinary.com/duhfv8nqy/image/upload/v1749621658/CE172B24-BBD8-4CB2-B1D9-99598376708B_ke9ack.jpg',
                'https://res.cloudinary.com/duhfv8nqy/image/upload/v1749621654/F98AFA65-781D-4F09-8569-4F3A75E2F13D_ffmsme.jpg',
                'https://res.cloudinary.com/duhfv8nqy/image/upload/v1747325445/mymessage/images/PHOTO-2025-04-29-10-42-32.jpg',
                'https://res.cloudinary.com/duhfv8nqy/image/upload/v1747325443/mymessage/images/PHOTO-2025-04-29-10-42-32%20%282%29.jpg'
            ]
        }
    };

    // Dynamic layouts for the collage
    const layouts = [
        {
            name: 'Under His Shelter ',
            subtitle: 'Long Sleeve Tees',
            mainImage: collectionAssets.tees.human[0],
            secondaryImages: [
                collectionAssets.tees.products[0],
                collectionAssets.tees.products[2]
            ],
            accentImage: collectionAssets.tees.human[1]
        },
        {
            name: 'Under His Shelter ',
            subtitle: 'Premium Essentials',
            mainImage: collectionAssets.tees.human[2],
            secondaryImages: [
                collectionAssets.tees.products[1],
                collectionAssets.tees.products[3]
            ],
            accentImage: collectionAssets.tees.human[0]
        },
        {
            name: 'Modular Message',
            subtitle: 'Carpenter Shorts',
            mainImage: collectionAssets.shorts.products[0],
            secondaryImages: [
                collectionAssets.shorts.products[1],
                collectionAssets.shorts.products[2]
            ],
            accentImage: collectionAssets.shorts.products[3]
        }
    ];

    useEffect(() => {
        setMounted(true);

        // Cycle through layouts
        const layoutInterval = setInterval(() => {
            setCurrentLayout((prev) => (prev + 1) % layouts.length);
        }, 6000);

        return () => clearInterval(layoutInterval);
    }, [layouts.length]);

    if (isExpired || !mounted) return null;

    const timeUnits = [
        { label: 'DAYS', value: days },
        { label: 'HOURS', value: hours },
        { label: 'MINUTES', value: minutes },
        { label: 'SECONDS', value: seconds },
    ];

    const currentLayoutData = layouts[currentLayout];

    return (
        <div className={`relative w-full min-h-screen bg-black overflow-hidden ${className}`}>
            {/* Background Image */}
            <div className="absolute inset-0">
                {layouts.map((layout, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === currentLayout ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <Image
                            src={layout.mainImage}
                            alt={layout.name}
                            fill
                            className="w-full h-full object-cover object-center"
                        />
                        {/* Strong overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80"></div>
                    </div>
                ))}
            </div>

            {/* Mobile-First Content Layout */}
            <div className="relative z-20 flex flex-col justify-center min-h-screen text-white px-4 sm:px-8 md:px-16">
                <div className="max-w-4xl mx-auto w-full">
                    {/* Collection Info - Mobile Optimized */}
                    <div className="mb-8 md:mb-12 text-center">
                        <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4 md:mb-6">
                            <span className="text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] font-light">
                                Exclusive Collection Drop
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-black uppercase tracking-tight leading-none mb-3 md:mb-4">
                            <span className="block text-white drop-shadow-2xl">
                                {currentLayoutData.name.split(' ')[0]}
                            </span>
                            <span className="block text-white/90 drop-shadow-2xl">
                                {currentLayoutData.name.split(' ').slice(1).join(' ')}
                            </span>
                        </h1>

                        <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light tracking-wide text-white/90 mb-6 md:mb-8 drop-shadow-lg">
                            {currentLayoutData.subtitle}
                        </div>
                    </div>

                    {/* Mobile-Optimized Countdown */}
                    <div className="bg-black/70 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-6 md:p-8 mb-8 md:mb-12 shadow-2xl">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-12">
                            {timeUnits.map((unit, index) => (
                                <div key={unit.label} className="text-center">
                                    <div className="relative">
                                        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black mb-1 md:mb-2 text-white drop-shadow-lg">
                                            {unit.value.toString().padStart(2, '0')}
                                        </div>
                                        <div className="text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.1em] sm:tracking-[0.2em] text-white/80 font-light">
                                            {unit.label}
                                        </div>
                                        <div className="w-full h-px bg-white/30 mt-2 md:mt-3"></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Release Info */}
                        <div className="text-center mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/20">
                            <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-white mb-1 md:mb-2">
                                15 June 2025 • 1:00 PM BST
                            </div>
                            <div className="text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/70">
                                Mark Your Calendar
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile-Optimized Secondary Images */}
            <div className="absolute top-4 right-4 sm:top-8 sm:right-8 md:top-0 md:right-0 md:w-1/3 md:h-full z-10">
                {/* Mobile: Simple stack, Desktop: Grid */}
                <div className="md:grid md:grid-rows-2 md:gap-2 md:p-4 md:h-full">
                    {currentLayoutData.secondaryImages.map((image, index) => (
                        <div
                            key={index}
                            className={`relative overflow-hidden rounded-lg shadow-2xl transition-all duration-1000 
                                ${index === 0 ? 'block' : 'hidden md:block'}  // Show only first image on mobile
                                w-16 h-16 sm:w-20 sm:h-20 md:w-auto md:h-auto
                                ${index === 1 ? 'mt-2 md:mt-0' : ''}
                            `}
                            style={{
                                transform: `translateX(${index * 5}px) rotate(${index % 2 === 0 ? '1deg' : '-1deg'})`,
                                zIndex: 10 + index
                            }}
                        >
                            <Image
                                src={image}
                                alt="Product"
                                fill
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/20"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile-Optimized Accent Image */}
            <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 w-20 h-20 sm:w-32 sm:h-32 md:w-48 md:h-48 overflow-hidden rounded-full shadow-2xl border-2 md:border-4 border-white/20 transition-all duration-1000 z-10">
                <Image
                    src={currentLayoutData.accentImage}
                    alt="Collection"
                    fill
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                />
            </div>

            {/* Mobile-Friendly Layout Navigation */}
            <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 z-30">
                <div className="flex gap-2">
                    {layouts.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentLayout(index)}
                            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 touch-manipulation ${index === currentLayout
                                ? 'bg-white scale-125'
                                : 'bg-white/40 hover:bg-white/60 active:bg-white/80'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Mobile Counter */}
            <div className="absolute top-4 left-4 sm:top-8 sm:left-8 md:top-8 md:right-8 md:left-auto z-30">
                <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 sm:px-4 sm:py-2 border border-white/20">
                    <span className="text-xs sm:text-sm font-mono text-white">
                        {(currentLayout + 1).toString().padStart(2, '0')} / {layouts.length.toString().padStart(2, '0')}
                    </span>
                </div>
            </div>
        </div>
    );
} 