'use client';

import { useEffect, useState } from 'react';
import { executeStorefrontQuery } from '@/lib/shopifyClient';

const TEST_QUERY = `
  query {
    shop {
      name
      primaryDomain {
        url
      }
    }
  }
`;

export default function TestPage() {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function testConnection() {
            try {
                setLoading(true);
                setError(null);
                const result = await executeStorefrontQuery({
                    query: TEST_QUERY
                });
                setData(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        }

        testConnection();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Shopify Connection Test</h1>

            {loading && <p>Loading...</p>}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p className="font-bold">Error:</p>
                    <p>{error}</p>
                </div>
            )}

            {data && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    <p className="font-bold">Connection Successful!</p>
                    <pre className="mt-2 whitespace-pre-wrap">
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
} 