import { shopifyFetch } from '@/lib/shopify';
import { getCollectionsQuery } from '@/lib/shopify/queries';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function listCollections() {
    try {
        console.log('Fetching collections...');
        console.log('Store Domain:', process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN);
        console.log('Access Token:', process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.substring(0, 5) + '...');

        const response = await shopifyFetch<{
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
        }>(getCollectionsQuery);

        console.log('\nAPI Response:', JSON.stringify(response, null, 2));

        if (!response.collections?.edges) {
            console.log('No collections data found in response');
            return;
        }

        console.log('\nAvailable Collections:');
        console.log('=====================');
        
        response.collections.edges.forEach(({ node }) => {
            console.log(`\nTitle: ${node.title}`);
            console.log(`Handle: ${node.handle}`);
            console.log(`Description: ${node.description || 'No description'}`);
            console.log('---------------------');
        });

    } catch (error) {
        console.error('Error fetching collections:', error);
        if (error instanceof Error) {
            console.error('Error details:', error.message);
            console.error('Error stack:', error.stack);
        }
    }
}

// Run the test
listCollections(); 