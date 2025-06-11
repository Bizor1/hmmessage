'use client';

import { CldImage } from 'next-cloudinary';
import { useState } from 'react';
import Image from 'next/image';

interface Product {
    name: string;
    collection: string;
    images: {
        front: string;
        back: string;
        human?: string;
    };
    colors: string[];
}

const dropProducts: Product[] = [
    {
        name: 'Under His Shelter Long Sleeve Tee',
        collection: 'Long Sleeve Tee Collection',
        images: {
            front: 'https://res.cloudinary.com/duhfv8nqy/image/upload/v1749622259/White_front_vvqvr8.jpg',
            back: 'https://res.cloudinary.com/duhfv8nqy/image/upload/v1749622259/Whiteback_dd47cj.png',
            human: 'https://res.cloudinary.com/duhfv8nqy/image/upload/v1749621404/WhatsApp_Image_2025-06-09_at_9.18.52_AM_ps4u5f.jpg'
        },
        colors: ['White', 'Black']
    },
    {
        name: 'Under His Shelter Long Sleeve Tee',
        collection: 'Long Sleeve Tee Collection',
        images: {
            front: 'https://res.cloudinary.com/duhfv8nqy/image/upload/v1749622131/Blackfront_qnzpya.jpg',
            back: 'https://res.cloudinary.com/duhfv8nqy/image/upload/v1749622131/Black_back_g3l790.png',
            human: 'https://res.cloudinary.com/duhfv8nqy/image/upload/v1749622132/DFE0B0E5-C406-4889-BFDF-460C915820D9_nrzl7s.png'
        },
        colors: ['Black', 'White']
    },
    {
        name: 'Modular Message Carpenter Shorts',
        collection: 'Shorts Collection',
        images: {
            front: 'https://res.cloudinary.com/duhfv8nqy/image/upload/v1749621658/CE172B24-BBD8-4CB2-B1D9-99598376708B_ke9ack.jpg',
            back: 'https://res.cloudinary.com/duhfv8nqy/image/upload/v1749621654/F98AFA65-781D-4F09-8569-4F3A75E2F13D_ffmsme.jpg'
        },
        colors: ['Washed Blue', 'Black']
    },
    {
        name: 'Modular Message Carpenter Shorts',
        collection: 'Shorts Collection',
        images: {
            front: 'https://res.cloudinary.com/duhfv8nqy/image/upload/v1747325445/mymessage/images/PHOTO-2025-04-29-10-42-32.jpg',
            back: 'https://res.cloudinary.com/duhfv8nqy/image/upload/v1747325443/mymessage/images/PHOTO-2025-04-29-10-42-32%20%282%29.jpg'
        },
        colors: ['Black', 'Washed Blue']
    }
];

interface DropShowcaseProps {
    variant?: 'homepage' | 'overlay';
    className?: string;
}

export default function DropShowcase({ variant = 'homepage', className = '' }: DropShowcaseProps) {
    const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

    if (variant === 'overlay') {
        return (
            <div className={`w-full max-w-6xl mx-auto px-4 ${className}`}>
                <div className="text-center mb-12">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 uppercase tracking-wide">
                        What&apos;s Dropping
                    </h3>
                    <div className="text-gray-400 text-sm md:text-base">
                        Exclusive pieces you won&apos;t want to miss
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {dropProducts.map((product, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden rounded-lg bg-black/30 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-500"
                            onMouseEnter={() => setHoveredProduct(index)}
                            onMouseLeave={() => setHoveredProduct(null)}
                        >
                            <div className="aspect-square relative overflow-hidden">
                                <Image
                                    src={hoveredProduct === index && product.images.back ? product.images.back : product.images.front}
                                    alt={product.name}
                                    width={400}
                                    height={400}
                                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                />

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Product info overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="text-xs uppercase tracking-wider text-gray-300 mb-1">
                                        {product.collection}
                                    </div>
                                    <div className="font-medium text-sm md:text-base mb-2 line-clamp-2">
                                        {product.name}
                                    </div>
                                    <div className="flex gap-1">
                                        {product.colors.map((color, colorIndex) => (
                                            <span
                                                key={colorIndex}
                                                className="text-xs px-2 py-1 bg-white/20 rounded-full backdrop-blur-sm"
                                            >
                                                {color}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Animated border effect */}
                            <div className="absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r from-red-500 via-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Homepage variant - more compact
    return (
        <div className={`w-full max-w-4xl mx-auto px-4 ${className}`}>
            <div className="text-center mb-8 md:mb-12">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 uppercase tracking-wide">
                    What&apos;s Dropping
                </h3>
                <div className="text-gray-400 text-sm">
                    Exclusive pieces you won&apos;t want to miss
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {dropProducts.map((product, index) => (
                    <div
                        key={index}
                        className="group relative overflow-hidden rounded-lg bg-black/20 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300"
                        onMouseEnter={() => setHoveredProduct(index)}
                        onMouseLeave={() => setHoveredProduct(null)}
                    >
                        <div className="aspect-square relative overflow-hidden">
                            <Image
                                src={hoveredProduct === index && product.images.back ? product.images.back : product.images.front}
                                alt={product.name}
                                width={300}
                                height={300}
                                className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                            />

                            {/* Subtle overlay on hover */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        {/* Product name on hover */}
                        <div className="absolute bottom-0 left-0 right-0 p-2 text-white bg-gradient-to-t from-black/80 to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <div className="text-xs font-medium line-clamp-2">
                                {product.name}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 