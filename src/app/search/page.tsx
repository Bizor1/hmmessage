import { Metadata } from 'next';
import { Suspense } from 'react';
import SearchResults from '@/components/SearchResults';

export const metadata: Metadata = {
    title: 'Search | Fashion Brand',
    description: 'Search through our collection of premium clothing and accessories.',
};

export default function SearchPage({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const query = typeof searchParams?.q === 'string' ? searchParams.q : '';

    return (
        <div className="min-h-screen bg-white">
            <div className="container-represent py-8">
                <Suspense fallback={<div>Loading...</div>}>
                    <SearchResults searchQuery={query} />
                </Suspense>
            </div>
        </div>
    );
} 