'use client';

import React from 'react';
import Link from 'next/link';
import { useCollections } from '@/context/CollectionsContext';

export default function SidebarNavigation() {
    const { collections, isLoading, error } = useCollections();

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
                        <li key={collection.id}>
                            <Link
                                href={`/collections/${collection.handle}`}
                                className="hover:text-gray-600 transition-colors duration-200"
                            >
                                {collection.title}
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