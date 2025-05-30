'use client';

import { useEffect, useState } from 'react';
import { executeStorefrontQuery } from '@/lib/shopifyClient';

// Simple test query to get shop information
const TEST_QUERY = `
  query {
    shop {
      name
      description
      brand {
        logo {
          image {
            url
          }
        }
      }
    }
  }
`;

interface ShopInfo {
    shop: {
        name: string;
        description: string;
        brand?: {
            logo?: {
                image?: {
                    url?: string;
                };
            };
        };
    };
}

export default function TestShopify() {
    const [shopInfo, setShopInfo] = useState<ShopInfo | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchShopInfo() {
            try {
                setLoading(true);
                const data = await executeStorefrontQuery<ShopInfo>({
                    query: TEST_QUERY
                });
                setShopInfo(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching shop info:', err);
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        }

        fetchShopInfo();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Shopify Integration Test</h1>

            {loading && <p>Loading...</p>}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p>Error: {error}</p>
                </div>
            )}

            {shopInfo && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    <h2 className="font-bold">Shop Information:</h2>
                    <p>Name: {shopInfo.shop.name}</p>
                    <p>Description: {shopInfo.shop.description}</p>
                    {shopInfo.shop.brand?.logo?.image?.url && (
                        <img
                            src={shopInfo.shop.brand.logo.image.url}
                            alt="Shop Logo"
                            className="mt-2 max-w-xs"
                        />
                    )}
                </div>
            )}
        </div>
    );
} 