'use client';

import { useQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { shopifyFetch } from '@/lib/shopify';
import { getCollectionProductsQuery } from '@/lib/shopify/queries';
import ProductGrid from './ProductGrid';
import LoadingSpinner from './LoadingSpinner';

interface ShopifyResponse {
    collection: {
        id: string;
        title: string;
        description: string;
        products: {
            edges: Array<{
                node: {
                    id: string;
                    title: string;
                    handle: string;
                    priceRange: {
                        minVariantPrice: {
                            amount: string;
                            currencyCode: string;
                        };
                    };
                    images: {
                        edges: Array<{
                            node: {
                                url: string;
                                altText: string | null;
                            };
                        }>;
                    };
                    variants: {
                        edges: Array<{
                            node: {
                                id: string;
                            };
                        }>;
                    };
                };
            }>;
        };
    };
}

interface CollectionClientProps {
    handle: string;
}

export default function CollectionClient({ handle }: CollectionClientProps) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['collection', handle],
        queryFn: async () => {
            const response = await shopifyFetch<ShopifyResponse>(getCollectionProductsQuery, { handle });
            if (!response.collection) {
                throw new Error('Collection not found');
            }
            return response.collection;
        },
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (error || !data) {
        notFound();
    }

    const products = data.products.edges.map(({ node }) => {
        const firstVariantId = node.variants.edges[0]?.node.id;
        return {
            id: node.id,
            variantId: firstVariantId,
            name: node.title,
            href: `/products/${node.handle}`,
            price: parseFloat(node.priceRange.minVariantPrice.amount),
            currencyCode: node.priceRange.minVariantPrice.currencyCode,
            imageUrlFront: node.images.edges.find(img =>
                img.node.url.toLowerCase().includes('front')
            )?.node.url || node.images.edges[0]?.node.url || '',
            imageUrlBack: node.images.edges.find(img =>
                img.node.url.toLowerCase().includes('back')
            )?.node.url || node.images.edges[1]?.node.url || node.images.edges[0]?.node.url || '',
        };
    });

    return (
        <div className="py-12">
            <div className="container-represent">
                <h1 className="text-2xl font-medium mb-8">{data.title}</h1>
                <ProductGrid products={products} />
            </div>
        </div>
    );
} 