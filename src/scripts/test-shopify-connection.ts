import { shopifyFetch } from '@/lib/shopify';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Query to fetch products with their details
const testQuery = `
  query {
    products(first: 10) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
              }
            }
          }
        }
      }
    }
  }
`;

// Customer login mutation
const customerAccessTokenCreateMutation = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

// Customer information query (requires access token)
const customerQuery = `
  query($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
      orders(first: 5) {
        edges {
          node {
            id
            orderNumber
            totalPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

// Checkout creation mutation
const checkoutCreateMutation = `
  mutation checkoutCreate {
    checkoutCreate(input: {}) {
      checkout {
        id
        webUrl
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
`;

// Customer creation mutation
const customerCreateMutation = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

// Add type definitions
type CustomerAccessToken = {
  accessToken: string;
  expiresAt: string;
};

type CustomerAccessTokenCreateResponse = {
  customerAccessTokenCreate: {
    customerAccessToken: CustomerAccessToken | null;
    customerUserErrors: Array<{
      code: string;
      field: string[];
      message: string;
    }>;
  };
};

type CustomerResponse = {
  customer: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    orders: {
      edges: Array<{
        node: {
          id: string;
          orderNumber: number;
          totalPrice: {
            amount: string;
            currencyCode: string;
          };
        };
      }>;
    };
  };
};

type CheckoutCreateResponse = {
  checkoutCreate: {
    checkout: {
      id: string;
      webUrl: string;
    } | null;
    checkoutUserErrors: Array<{
      code: string;
      field: string[];
      message: string;
    }>;
  };
};

type CustomerCreateResponse = {
  customerCreate: {
    customer: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    } | null;
    customerUserErrors: Array<{
      code: string;
      field: string[];
      message: string;
    }>;
  };
};

async function testShopifyConnection() {
  console.log('Testing Shopify API connection...');
  
  try {
    // Check if environment variables are set
    if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN) {
      throw new Error('NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is not set in .env file');
    }
    if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
      throw new Error('SHOPIFY_STOREFRONT_ACCESS_TOKEN is not set in .env file');
    }

    console.log('Environment variables found ✓');
    
    // Test the API connection
    const response = await shopifyFetch<{
      products: {
        edges: Array<{
          node: {
            id: string;
            title: string;
            description: string;
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
                  title: string;
                  price: {
                    amount: string;
                    currencyCode: string;
                  };
                  availableForSale: boolean;
                };
              }>;
            };
          };
        }>;
      };
    }>(testQuery);

    console.log('\nConnection successful! ✅');
    console.log('Products found:', response.products.edges.length);
    
    if (response.products.edges.length === 0) {
      console.log('No products found in the store.');
    } else {
      response.products.edges.forEach(({ node: product }, index) => {
        const firstVariant = product.variants.edges[0]?.node;
        const firstImage = product.images.edges[0]?.node;
        
        console.log(`\n${index + 1}. ${product.title}`);
        console.log(`   ID: ${product.id}`);
        console.log(`   Handle: ${product.handle}`);
        console.log(`   Price: ${firstVariant?.price.amount} ${firstVariant?.price.currencyCode}`);
        console.log(`   Available: ${firstVariant?.availableForSale ? 'Yes' : 'No'}`);
        if (firstImage) {
          console.log(`   Image: ${firstImage.url}`);
        }
      });
    }
  } catch (error) {
    console.error('\nConnection test failed! ❌');
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    process.exit(1);
  }
}

async function testShopifyAuth() {
  console.log('Testing Shopify Authentication and Checkout...\n');
  
  try {
    // 1. Create customer access token (login)
    console.log('1. Testing customer login...');
    const loginResponse = await shopifyFetch<CustomerAccessTokenCreateResponse>(customerAccessTokenCreateMutation, {
      input: {
        email: "customer@example.com",
        password: "your-password"
      }
    });

    console.log('Login response:', loginResponse);

    if (loginResponse.customerAccessTokenCreate?.customerAccessToken?.accessToken) {
      const accessToken = loginResponse.customerAccessTokenCreate.customerAccessToken.accessToken;
      
      // 2. Fetch customer information using the token
      console.log('\n2. Fetching customer information...');
      const customerInfo = await shopifyFetch<CustomerResponse>(customerQuery, {
        customerAccessToken: accessToken
      });

      console.log('Customer info:', customerInfo);
    }

    // 3. Create a checkout
    console.log('\n3. Creating a checkout...');
    const checkoutResponse = await shopifyFetch<CheckoutCreateResponse>(checkoutCreateMutation);
    
    if (checkoutResponse.checkoutCreate?.checkout) {
      console.log('Checkout created!');
      console.log('Checkout URL:', checkoutResponse.checkoutCreate.checkout.webUrl);
    }

  } catch (error) {
    console.error('\nTest failed! ❌');
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    process.exit(1);
  }
}

async function testCustomerCreation() {
  console.log('\nTesting customer creation...');
  
  const testCustomer = {
    email: `test${Date.now()}@example.com`, // Unique email
    password: 'TestPass123!',
    firstName: 'Test',
    lastName: 'User'
  };

  try {
    const response = await shopifyFetch<CustomerCreateResponse>(
      customerCreateMutation,
      {
        input: testCustomer
      }
    );

    if (response.customerCreate.customerUserErrors.length > 0) {
      console.log('❌ Customer creation failed:');
      console.log(JSON.stringify(response.customerCreate.customerUserErrors, null, 2));
    } else {
      console.log('✓ Customer created successfully:');
      console.log(JSON.stringify(response.customerCreate.customer, null, 2));
    }

    return response;
  } catch (error) {
    console.error('❌ Error during customer creation:', error);
    throw error;
  }
}

// Main execution
async function main() {
  try {
    // Test basic connection
    await testShopifyConnection();
    
    // Test customer creation
    await testCustomerCreation();
    
    // Test authentication (existing function)
    await testShopifyAuth();
    
  } catch (error) {
    console.error('❌ Tests failed:', error);
    process.exit(1);
  }
}

// Run the tests
main(); 