import { shopifyFetch } from './shopify';
import { getCollectionsQuery, getCollectionProductsQuery } from './shopify/queries';

interface ShopifyCollection {
    collections: {
        edges: Array<{
            node: {
                id: string;
                handle: string;
                title: string;
                description: string;
            };
        }>;
    };
}

interface ShopifyCollectionProducts {
    collection: {
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

// Function to prefetch all collections
async function prefetchCollections() {
    try {
        const response = await shopifyFetch<ShopifyCollection>(getCollectionsQuery);
        return response.collections.edges;
    } catch (error) {
        console.error('Error prefetching collections:', error);
        return [];
    }
}

// Function to prefetch products for a collection
async function prefetchCollectionProducts(handle: string) {
    try {
        const response = await shopifyFetch<ShopifyCollectionProducts>(
            getCollectionProductsQuery,
            { handle }
        );
        return response.collection.products.edges;
    } catch (error) {
        console.error(`Error prefetching products for collection ${handle}:`, error);
        return [];
    }
}

// Main prefetch function that will be called on app initialization
export async function prefetchShopifyData() {
    console.log('Starting data prefetch...');
    
    // First fetch all collections
    const collections = await prefetchCollections();
    
    // Then fetch products for each collection in parallel
    const productPromises = collections.map(({ node }) => 
        prefetchCollectionProducts(node.handle)
    );
    
    await Promise.all(productPromises);
    
    console.log('Data prefetch complete');
} 