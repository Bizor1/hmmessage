'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { prefetchShopifyData } from '@/lib/prefetch';

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000, // Consider data fresh for 1 minute
                gcTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
            },
        },
    }));

    useEffect(() => {
        // Prefetch data when the app initializes
        prefetchShopifyData();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
} 