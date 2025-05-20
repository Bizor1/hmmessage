import { shopifyFetch } from '@/lib/shopify';
import { getCollectionsQuery, getCollectionProductsQuery } from '@/lib/shopify/queries';
import CollectionClientLayout from '@/components/CollectionClientLayout';

interface ShopifyProduct {
    id: string;
    title: string;
    handle: string;
    description: string;
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
}

interface CollectionResponse {
    collection?: {
        products?: {
            edges: Array<{
                node: ShopifyProduct;
            }>;
        };
    };
}

async function getAllProducts() {
    try {
        // First, get all collections
        const collectionsResponse = await shopifyFetch<{
            collections: {
                edges: Array<{
                    node: {
                        handle: string;
                    };
                }>;
            };
        }>(getCollectionsQuery);

        // Then, fetch products from each collection
        const collections = collectionsResponse.collections.edges;
        const productsPromises = collections.map(({ node }) =>
            shopifyFetch<CollectionResponse>(getCollectionProductsQuery, {
                handle: node.handle
            })
        );

        const productsResponses = await Promise.all(productsPromises);

        // Combine and deduplicate products based on ID
        const productsMap = new Map();
        productsResponses.forEach((response: CollectionResponse) => {
            if (response.collection?.products?.edges) {
                response.collection.products.edges.forEach(({ node }) => {
                    if (!productsMap.has(node.id)) {
                        // First try to find front/back images by URL
                        const frontImage = node.images.edges.find(
                            img => img.node.url.toLowerCase().includes('front')
                        );

                        const backImage = node.images.edges.find(
                            img => img.node.url.toLowerCase().includes('back')
                        );

                        // If we found both front and back images by URL, use them
                        const imageUrlFront = frontImage?.node.url || node.images.edges[0]?.node.url || '';
                        const imageUrlBack = backImage?.node.url || node.images.edges[1]?.node.url || node.images.edges[0]?.node.url || '';

                        productsMap.set(node.id, {
                            id: node.id,
                            name: node.title,
                            href: `/products/${node.handle}`,
                            imageUrlFront,
                            imageUrlBack,
                            price: parseFloat(node.priceRange.minVariantPrice.amount),
                            currencyCode: node.priceRange.minVariantPrice.currencyCode,
                            variantId: node.variants?.edges[0]?.node.id
                        });
                    }
                });
            }
        });

        return Array.from(productsMap.values());
    } catch (error) {
        console.error('Error fetching all products:', error);
        throw error;
    }
}

export default async function AllProductsPage() {
    const products = await getAllProducts();

    return (
        <CollectionClientLayout
            collectionName="All Products"
            products={products}
            description="Browse our complete collection of products"
            productCount={products.length}
        />
    );
} 