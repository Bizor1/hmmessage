import { shopifyFetch } from '../lib/shopify';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

interface SelectedOption {
  name: string;
  value: string;
}

interface ProductVariant {
  id: string;
  title: string;
  sku: string;
  availableForSale: boolean;
  requiresSellingPlan: boolean;
  quantityAvailable: number;
  selectedOptions: SelectedOption[];
  price: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice?: {
    amount: string;
    currencyCode: string;
  };
  barcode: string;
  weight: number;
  weightUnit: string;
}

interface ProductImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

interface Collection {
  id: string;
  title: string;
  handle: string;
}

interface ShopifyResponse {
  product: {
    id: string;
    title: string;
    handle: string;
    description: string;
    descriptionHtml: string;
    availableForSale: boolean;
    requiresSellingPlan: boolean;
    totalInventory: number;
    tags: string[];
    vendor: string;
    productType: string;
    publishedAt: string;
    featuredImage: {
      url: string;
      altText: string | null;
    };
    options: ProductOption[];
    variants: {
      edges: Array<{
        node: ProductVariant;
      }>;
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
          width: number;
          height: number;
        };
      }>;
    };
    collections: {
      edges: Array<{
        node: Collection;
      }>;
    };
  };
}

const getAllProductsQuery = `
  query {
    products(first: 10) {
      edges {
        node {
          id
          title
          handle
          availableForSale
          vendor
          productType
        }
      }
    }
  }
`;

const getProductQuery = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      availableForSale
      totalInventory
      tags
      vendor
      productType
      publishedAt
      featuredImage {
        url
        altText
      }
      options {
        id
        name
        values
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            sku
            availableForSale
            quantityAvailable
            selectedOptions {
              name
              value
            }
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            barcode
            weight
            weightUnit
          }
        }
      }
      images(first: 20) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      collections(first: 5) {
        edges {
          node {
            id
            title
            handle
          }
        }
      }
    }
  }
`;

async function testProductInfo() {
  console.log('Testing Product Information Fetch...\n');
  
  try {
    console.log('First, getting list of products...');
    const productsResponse = await shopifyFetch<{
      products: {
        edges: Array<{
          node: {
            id: string;
            title: string;
            handle: string;
            availableForSale: boolean;
            vendor: string;
            productType: string;
          };
        }>;
      };
    }>(getAllProductsQuery);

    console.log('\nAvailable Products:');
    console.log('==================');
    productsResponse.products.edges.forEach(({ node }) => {
      console.log(`\nTitle: ${node.title}`);
      console.log(`Handle: ${node.handle}`);
      console.log(`Available: ${node.availableForSale}`);
      console.log(`Type: ${node.productType}`);
      console.log(`Vendor: ${node.vendor}`);
      console.log('-------------------');
    });

    console.log('\nNow fetching specific product details...');
    const response = await shopifyFetch<ShopifyResponse>(getProductQuery, {
      handle: 'modular-message-carpenter-shorts-black'
    });

    console.log('\nFull Product Information:');
    console.log(JSON.stringify(response, null, 2));

    if (response.product) {
      const product = response.product;
      
      console.log('\n=== Basic Info ===');
      console.log('Title:', product.title);
      console.log('Available:', product.availableForSale);
      console.log('Type:', product.productType);
      console.log('Vendor:', product.vendor);
      console.log('Tags:', product.tags.join(', '));
      
      console.log('\n=== Options ===');
      product.options.forEach((option: ProductOption) => {
        console.log(`${option.name}:`, option.values.join(', '));
      });

      console.log('\n=== Variants ===');
      product.variants.edges.forEach(({ node }: { node: ProductVariant }) => {
        console.log('\nVariant:', node.title);
        console.log('SKU:', node.sku);
        console.log('Available:', node.availableForSale);
        console.log('Quantity:', node.quantityAvailable);
        console.log('Price:', `${node.price.currencyCode} ${node.price.amount}`);
        if (node.compareAtPrice) {
          console.log('Compare at:', `${node.compareAtPrice.currencyCode} ${node.compareAtPrice.amount}`);
        }
        console.log('Options:', node.selectedOptions.map((opt: SelectedOption) => `${opt.name}: ${opt.value}`).join(', '));
      });

      console.log('\n=== Collections ===');
      product.collections.edges.forEach(({ node }: { node: Collection }) => {
        console.log('-', node.title);
      });
    }

  } catch (error) {
    console.error('\nTest failed! ❌');
    console.error('Error details:', error instanceof Error ? error.message : error);
  }
}

testProductInfo(); 