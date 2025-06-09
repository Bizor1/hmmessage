import { shopifyFetch } from '@/lib/shopify';
import { getCollectionsQuery, getCollectionProductsQuery } from '@/lib/shopify/queries';
import CollectionClientLayout from '@/components/CollectionClientLayout';
import { Metadata } from 'next';

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
                title: string;
                availableForSale: boolean;
                selectedOptions: Array<{
                    name: string;
                    value: string;
                }>;
            };
        }>;
    };
    options: Array<{
        name: string;
        value: string;
    }>;
}

interface CollectionResponse {
    collection?: {
        products: {
            edges: Array<{
                node: ShopifyProduct;
            }>;
        };
    };
}

export const metadata: Metadata = {
    title: 'All Products | 247',
    description: 'Browse our complete collection of products',
};

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

        if (!collectionsResponse?.collections?.edges) {
            console.error('No collections found');
            return [];
        }

        // Then, fetch products from each collection in parallel
        const collections = collectionsResponse.collections.edges;
        const productsPromises = collections.map(({ node }) =>
            shopifyFetch<CollectionResponse>(getCollectionProductsQuery, {
                handle: node.handle
            }).catch(error => {
                console.error(`Error fetching products for collection ${node.handle}:`, error);
                return { collection: { products: { edges: [] } } };
            })
        );

        const productsResponses = await Promise.all(productsPromises);

        // Combine and deduplicate products based on ID
        const productsMap = new Map();
        productsResponses.forEach((response: CollectionResponse) => {
            if (response.collection?.products?.edges) {
                response.collection.products.edges.forEach(({ node }) => {
                    if (!productsMap.has(node.id)) {
                        // Get front/back images
                        const images = node.images.edges;
                        const frontImage = images.find(img =>
                            img.node.url.toLowerCase().includes('front')
                        ) || images[0];
                        const backImage = images.find(img =>
                            img.node.url.toLowerCase().includes('back')
                        ) || images[1] || images[0];

                        // Transform variants
                        const variants = node.variants.edges.map(({ node: variant }) => ({
                            id: variant.id,
                            title: variant.title,
                            availableForSale: variant.availableForSale,
                            selectedOptions: variant.selectedOptions
                        }));

                        productsMap.set(node.id, {
                            id: node.id,
                            name: node.title,
                            href: `/products/${node.handle}`,
                            imageUrlFront: frontImage?.node.url || '',
                            imageUrlBack: backImage?.node.url || '',
                            price: parseFloat(node.priceRange.minVariantPrice.amount),
                            currencyCode: node.priceRange.minVariantPrice.currencyCode,
                            variants,
                            options: node.options
                        });
                    }
                });
            }
        });

        return Array.from(productsMap.values());
    } catch (error) {
        console.error('Error fetching all products:', error);
        return [];
    }
}

export default async function AllProductsPage() {
    const products = await getAllProducts();

    return (
        <div className="min-h-screen">
            <CollectionClientLayout
                collectionName="All Products"
                products={products}
                description="Browse our complete collection of products"
                productCount={products.length}
            />
        </div>
    );
} 