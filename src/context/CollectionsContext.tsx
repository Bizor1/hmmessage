'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { executeStorefrontQuery } from '@/lib/shopifyClient';
import { getCollectionsQuery } from '@/lib/shopify/queries';

interface Collection {
    id: string;
    handle: string;
    title: string;
    description: string;
}

interface CollectionsContextType {
    collections: Collection[];
    isLoading: boolean;
    error: string | null;
}

const CollectionsContext = createContext<CollectionsContextType | undefined>(undefined);

export function CollectionsProvider({ children }: { children: React.ReactNode }) {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCollections() {
            try {
                const response = await executeStorefrontQuery<{
                    collections: {
                        edges: Array<{
                            node: Collection;
                        }>;
                    };
                }>({
                    query: getCollectionsQuery
                });

                const fetchedCollections = response.collections.edges.map(({ node }) => node);
                setCollections(fetchedCollections);
                setError(null);
            } catch (err) {
                console.error('Error fetching collections:', err);
                setError('Failed to load collections');
            } finally {
                setIsLoading(false);
            }
        }

        fetchCollections();
    }, []);

    return (
        <CollectionsContext.Provider value={{ collections, isLoading, error }}>
            {children}
        </CollectionsContext.Provider>
    );
}

export const useCollections = () => {
    const context = useContext(CollectionsContext);
    if (context === undefined) {
        throw new Error('useCollections must be used within a CollectionsProvider');
    }
    return context;
}; 