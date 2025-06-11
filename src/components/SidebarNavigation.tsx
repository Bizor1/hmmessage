'use client';

import React from 'react';
import Link from 'next/link';
import { useCollections } from '@/context/CollectionsContext';
import { useDropCountdown } from '@/hooks/useCountdown';

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

export default function SidebarNavigation() {
    const { collections, isLoading, error } = useCollections();
    const { isExpired } = useDropCountdown();

    const hasActiveDrop = (collectionHandle: string) => {
        if (isExpired) return false;
        return DROP_COLLECTIONS.some(dropHandle =>
            collectionHandle.toLowerCase().includes(dropHandle) ||
            dropHandle.includes(collectionHandle.toLowerCase())
        );
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500">
                Failed to load collections. Please try again later.
            </div>
        );
    }

    return (
        <nav className="space-y-6">
            <div>
                <h2 className="font-semibold mb-4 text-lg">SHOP</h2>
                <ul className="space-y-2">
                    <li>
                        <Link
                            href="/collections/all"
                            className="hover:text-gray-600 transition-colors duration-200"
                        >
                            All Products
                        </Link>
                    </li>
                    {collections.map((collection) => (
                        <li key={collection.id} className="relative">
                            <Link
                                href={`/collections/${collection.handle}`}
                                className="hover:text-gray-600 transition-colors duration-200 flex items-center justify-between group"
                            >
                                <span>{collection.title}</span>
                                {hasActiveDrop(collection.handle) && (
                                    <div className="flex items-center gap-2">
                                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium uppercase tracking-wide animate-pulse">
                                            DROP
                                        </span>
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                    </div>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2 className="font-semibold mb-4 text-lg">EXPLORE</h2>
                <ul className="space-y-2">
                    <li>
                        <Link
                            href="/about"
                            className="hover:text-gray-600 transition-colors duration-200"
                        >
                            About Us
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/contact"
                            className="hover:text-gray-600 transition-colors duration-200"
                        >
                            Contact
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
} 