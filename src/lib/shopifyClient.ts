import { createStorefrontClient } from '@shopify/hydrogen-react';

// Format the domain to ensure it's clean
const formatDomain = (domain: string) => {
  return domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
};

// Initialize the Shopify Storefront client
export const client = createStorefrontClient({
  storeDomain: 'https://mymessageclothing.myshopify.com',
  publicStorefrontToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
  storefrontApiVersion: '2025-04',
});

// Get a new client for each request
export function getStorefrontClient() {
  return client;
}

// Helper function to execute GraphQL queries
export async function executeStorefrontQuery<T>({
  query,
  variables = {},
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  try {
    const response = await fetch('/api/shopify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
      console.error('API Response:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.error) {
      console.error('GraphQL Error:', result.error);
      throw new Error(result.error);
    }

    return result.data as T;
  } catch (error) {
    console.error('Shopify query error:', error);
    throw error;
  }
} 