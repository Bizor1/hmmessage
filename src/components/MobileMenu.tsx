'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useCollections } from '@/context/CollectionsContext';
import { useDropCountdown } from '@/hooks/useCountdown';
import { useRouter } from 'next/navigation';

// Collections that have active drops
const DROP_COLLECTIONS = [
    'long-sleeve-tee',
    'long-sleeve-tees',
    'longsleeve',
    'longsleeve-tee',
    'shorts',
    'carpenter-shorts',
    'modular-message-shorts'
];

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const { } = useCart();
    const { collections } = useCollections();
    const { isExpired } = useDropCountdown();
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const hasActiveDrop = (collectionHandle: string) => {
        if (isExpired) return false;
        return DROP_COLLECTIONS.some(dropHandle =>
            collectionHandle.toLowerCase().includes(dropHandle) ||
            dropHandle.includes(collectionHandle.toLowerCase())
        );
    };

    if (!isOpen) return null;

    // Get the first collection since we know there's only one
    const mainCollection = collections?.[0];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            onClose();
            setSearchQuery('');
        }
    };

    return (
        <div className="fixed inset-0 bg-white z-[60] md:hidden">
            <div className="flex flex-col h-full">
                {/* Menu Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <button onClick={onClose} className="text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="sr-only">Close menu</span>
                    </button>
                    <Link href="/" className="text-xl font-bold">
                        MyMessage
                    </Link>
                    <div className="w-6" /> {/* Empty div for flex spacing */}
                </div>

                {/* Menu Content - Scrollable */}
                <div className="flex-grow overflow-y-auto p-4 space-y-6">
                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="search"
                            placeholder="Search products..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            aria-label="Search"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-gray-500"
                            >
                                <path
                                    d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </form>

                    {/* Shop Section */}
                    <div className="border-t border-gray-100 pt-4">
                        <h3 className="text-sm font-semibold uppercase mb-4">SHOP</h3>
                        <div className="space-y-3">
                            <Link href="/new-arrivals" className="block text-base py-2" onClick={onClose}>
                                New Arrivals
                            </Link>
                            <Link href="/collections/all" className="block text-base py-2" onClick={onClose}>
                                All Products
                            </Link>
                            {collections?.map((collection) => (
                                <Link
                                    key={collection.id}
                                    href={`/collections/${collection.handle}`}
                                    className="flex items-center justify-between py-2 group"
                                    onClick={onClose}
                                >
                                    <span className="text-base">{collection.title}</span>
                                    {hasActiveDrop(collection.handle) && (
                                        <div className="flex items-center gap-2">
                                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium uppercase tracking-wide animate-pulse">
                                                DROP
                                            </span>
                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                        </div>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Explore Section */}
                    <div className="border-t border-gray-100 pt-4">
                        <h3 className="text-sm font-semibold uppercase mb-4">EXPLORE</h3>
                        <div className="space-y-3">
                            <Link href="/about" className="block text-base py-2" onClick={onClose}>
                                About Us
                            </Link>
                            <Link href="/story" className="block text-base py-2" onClick={onClose}>
                                Story
                            </Link>
                            <Link href="/contact" className="block text-base py-2" onClick={onClose}>
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 