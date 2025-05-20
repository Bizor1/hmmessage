'use client';

import { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';

// Define the same DummyProduct type here or import from a shared types file
interface DummyProduct {
    id: string;
    imageUrlFront: string;
    imageUrlBack: string;
    name: string;
    price: number;
    currencyCode?: string;
    color?: string;
    variantCount?: number;
    href: string;
}

interface CollectionClientLayoutProps {
    collectionName: string;
    products: DummyProduct[];
    description?: string;
    productCount?: number;
}

export default function CollectionClientLayout({
    collectionName,
    products,
    description = "Discover the latest arrivals...",
    productCount
}: CollectionClientLayoutProps) {
    const [isFilterBarVisible, setIsFilterBarVisible] = useState(true);
    const filterBarRef = useRef<HTMLDivElement>(null);

    const actualProductCount = productCount || products.length;

    useEffect(() => {
        const handleScroll = () => {
            if (filterBarRef.current) {
                const shouldBeVisible = window.scrollY < (filterBarRef.current.offsetTop - 100);
                setIsFilterBarVisible(shouldBeVisible);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="container-represent py-4 pt-24">
            {/* Static Header Section */}
            <div className="mb-8">
                <h1 className="text-2xl font-medium mb-2">
                    {collectionName}
                    <sup className="text-xs font-normal text-gray-400 ml-1">{actualProductCount}</sup>
                </h1>
                <p className="text-sm text-gray-600 max-w-xl">{description}</p>
            </div>

            {/* Sticky Container for Filter Bar */}
            <div ref={filterBarRef} className={`sticky top-16 z-10 bg-[var(--background)] transition-opacity duration-300 ${isFilterBarVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {/* View and Filter Controls Row - Stacks on small screens */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center pt-4 pb-4 mb-6 border-b border-represent-gray space-y-4 md:space-y-0">
                    {/* Updated View Controls - Adjusted flex */}
                    <div className="flex items-center justify-between md:justify-start space-x-4">
                        <div>
                            <span className="text-xs font-medium mr-2">View</span>
                            <button className="inline-block w-3 h-3 bg-black mr-px"></button>
                            <button className="inline-block w-3 h-3 bg-black mr-px"></button>
                            <button className="inline-block w-3 h-3 bg-gray-300"></button>
                        </div>
                    </div>
                    {/* Filter Button - Aligned end on md+ */}
                    <div className="flex justify-end">
                        <button className="text-xs font-medium flex items-center">
                            Filter
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="mt-0">
                {products && products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-represent-muted">No products found in this collection.</p>
                )}
            </div>
        </div>
    );
} 