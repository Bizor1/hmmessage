import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { shopifyFetch } from '@/lib/shopify';
import { getCollectionProductsQuery } from '@/lib/shopify/queries';
import CollectionClient from '@/components/CollectionClient';

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
                };
            }>;
        };
    };
}

interface PageProps {
    params: {
        handle: string;
    };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    try {
        const response = await shopifyFetch<ShopifyResponse>(getCollectionProductsQuery, {
            handle: params.handle
        });

        if (!response.collection) {
            notFound();
        }

        return {
            title: `${response.collection.title} | 247`,
            description: response.collection.description,
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Collection',
        };
    }
}

export default function CollectionPage({ params }: PageProps) {
    return <CollectionClient handle={params.handle} />;
} 