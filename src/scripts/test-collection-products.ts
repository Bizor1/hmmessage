import { shopifyFetch } from '@/lib/shopify';
import { getCollectionProductsQuery } from '@/lib/shopify/queries';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function listCollectionProducts() {
    try {
        console.log('Fetching products from clothing collection...');
        console.log('Query:', getCollectionProductsQuery);
        
        const response = await shopifyFetch<{
            collection: {
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
        }>(getCollectionProductsQuery, {
            handle: 'clothing'
        });

        console.log('\nAPI Response:', JSON.stringify(response, null, 2));

        if (!response.collection) {
            console.log('Collection not found');
            return;
        }

        const { collection } = response;
        console.log('\nCollection Title:', collection.title);
        console.log('Collection Description:', collection.description);
        console.log('Number of Products:', collection.products.edges.length);

        collection.products.edges.forEach(({ node: product }, index) => {
            console.log(`\nProduct ${index + 1}:`);
            console.log('Title:', product.title);
            console.log('Handle:', product.handle);
            console.log('Price:', `${product.priceRange.minVariantPrice.amount} ${product.priceRange.minVariantPrice.currencyCode}`);
            console.log('Number of Images:', product.images.edges.length);
            product.images.edges.forEach((image, i) => {
                console.log(`Image ${i + 1}:`, image.node.url);
            });
        });

    } catch (error) {
        console.error('Error fetching collection products:', error);
        if (error instanceof Error) {
            console.error('Error details:', error.message);
            console.error('Error stack:', error.stack);
        }
    }
}

// Run the test
listCollectionProducts(); 