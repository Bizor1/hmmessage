'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { handleShopifyCallback, getCustomer, SimpleCustomer } from '@/lib/auth';
import { ShopifyOAuthTokenResponse } from '@/lib/shopify';

function ShopifyCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, isLoading: isAuthLoading, isAuthenticated } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(true);

    useEffect(() => {
        // Prevent running if auth is still loading or already authenticated by a quick redirect
        if (isAuthLoading || isAuthenticated) {
            if (isAuthenticated) router.replace('/account');
            return;
        }

        const processCallback = async () => {
            setProcessing(true);
            setError(null);

            if (!searchParams) {
                setError('Missing search parameters for callback.');
                setProcessing(false);
                return;
            }

            const code = searchParams.get('code');
            const state = searchParams.get('state');

            if (!code || !state) {
                const errorParam = searchParams.get('error');
                const errorDescription = searchParams.get('error_description');
                if (errorParam) {
                    console.error(`Shopify Auth Error: ${errorParam} - ${errorDescription}`);
                    setError(`Login failed: ${errorDescription || errorParam}. Please try again.`);
                } else {
                    setError('Missing required parameters in Shopify callback. Please try again.');
                }
                setProcessing(false);
                return;
            }

            try {
                // handleShopifyCallback will validate state and exchange code for token
                const tokenResponse: ShopifyOAuthTokenResponse = await handleShopifyCallback(new URLSearchParams({
                    code,
                    state
                }));

                // With the access token, fetch customer information
                let customerData: SimpleCustomer | undefined;
                if (tokenResponse.access_token) {
                    customerData = await getCustomer(tokenResponse.access_token);
                }

                // Update AuthContext
                login(tokenResponse, customerData);

                // Redirect to account page or home
                router.replace('/account'); // Or a previously stored target path

            } catch (err) {
                console.error('Error processing Shopify callback:', err);
                setError(err instanceof Error ? err.message : 'An unexpected error occurred during login. Please try again.');
            }
            setProcessing(false);
        };

        processCallback();

    }, [searchParams, login, router, isAuthLoading, isAuthenticated]);

    if (error) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <h1 className="text-xl font-semibold text-red-600 mb-4">Login Error</h1>
                <p className="text-gray-700 mb-2">{error}</p>
                <p className="text-gray-600 text-sm mb-6">
                    There was an issue logging you in. Please try returning to the login page.
                </p>
                <button
                    onClick={() => router.push('/auth')}
                    className="btn-represent"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
            <h1 className="text-xl font-semibold text-gray-800">Processing Login...</h1>
            <p className="text-gray-600 mt-2">Please wait while we securely log you in.</p>
            {processing && (
                <div className="mt-4 w-6 h-6 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
            )}
        </div>
    );
}

// Wrap with Suspense because useSearchParams() needs it when used in a Client Component
// rendered during static export or SSR without dynamic rendering.
export default function CallbackPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><p>Loading callback...</p></div>}>
            <ShopifyCallback />
        </Suspense>
    );
} 