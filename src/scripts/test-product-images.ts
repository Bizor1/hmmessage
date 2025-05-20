import { shopifyFetch } from '@/lib/shopify';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const getProductImagesQuery = `
  query {
    products(first: 50) {
      edges {
        node {
          title
          images(first: 10) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

interface ShopifyResponse {
    products: {
        edges: Array<{
            node: {
                title: string;
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
}

async function listProductImages() {
    try {
        console.log('Fetching product images...\n');
        console.log('Store Domain:', process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN);
        console.log('Access Token:', process.env.STOREFRONT_API_ACCESS_TOKEN_PUBLIC?.substring(0, 5) + '...');
        
        const response = await shopifyFetch<ShopifyResponse>(getProductImagesQuery);
        
        response.products.edges.forEach(({ node: product }) => {
            console.log(`Product: ${product.title}`);
            console.log('Images:');
            
            product.images.edges.forEach(({ node: image }, index) => {
                console.log(`  ${index + 1}. URL: ${image.url}`);
                console.log(`     Alt Text: ${image.altText || 'No alt text'}`);
                
                // Check if image name/url contains front or back
                const url = image.url.toLowerCase();
                const altText = (image.altText || '').toLowerCase();
                
                const tags = [];
                if (url.includes('front') || altText.includes('front')) tags.push('FRONT');
                if (url.includes('back') || altText.includes('back')) tags.push('BACK');
                
                if (tags.length > 0) {
                    console.log(`     Tags: ${tags.join(', ')}`);
                }
            });
            console.log('-------------------\n');
        });

    } catch (error) {
        console.error('Error fetching product images:', error);
        if (error instanceof Error) {
            console.error('Error details:', error.message);
            console.error('Error stack:', error.stack);
        }
    }
}

// Run the script
listProductImages(); 