'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchButtonProps {
    color?: 'black' | 'white';
}

export default function SearchButton({ color = 'black' }: SearchButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsOpen(false);
            setSearchQuery('');
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:opacity-75 transition-opacity"
                aria-label="Search"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke={color}
                    className="w-6 h-6"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 z-[98]"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Search Bar */}
                    <div className="absolute right-0 top-full mt-2 w-screen max-w-sm bg-white shadow-lg z-[99] p-4">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="w-full py-2 pr-8 text-sm border-b border-gray-200 focus:outline-none focus:border-black"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-black disabled:opacity-50 transition-colors"
                                disabled={!searchQuery.trim()}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                                <span className="sr-only">Search</span>
                            </button>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
} 