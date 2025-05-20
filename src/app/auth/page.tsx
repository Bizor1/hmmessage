'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CldImage } from 'next-cloudinary';
import { useAuth } from '@/context/AuthContext';
import { redirectToShopifyAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

// Add environment variables to window object
declare global {
    interface Window {
        env?: {
            NEXT_PUBLIC_SHOPIFY_AUTH_AUTHORIZE_URL: string;
            NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID: string;
            NEXT_PUBLIC_SHOPIFY_AUTH_REDIRECT_URI: string;
            NEXT_PUBLIC_SHOPIFY_AUTH_TOKEN_URL: string;
            NEXT_PUBLIC_SHOPIFY_AUTH_LOGOUT_URL: string;
            NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_API_URL: string;
        };
    }
}

// Initialize window.env with environment variables
if (typeof window !== 'undefined') {
    window.env = {
        NEXT_PUBLIC_SHOPIFY_AUTH_AUTHORIZE_URL: process.env.NEXT_PUBLIC_SHOPIFY_AUTH_AUTHORIZE_URL || '',
        NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID: process.env.NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID || '',
        NEXT_PUBLIC_SHOPIFY_AUTH_REDIRECT_URI: process.env.NEXT_PUBLIC_SHOPIFY_AUTH_REDIRECT_URI || '',
        NEXT_PUBLIC_SHOPIFY_AUTH_TOKEN_URL: process.env.NEXT_PUBLIC_SHOPIFY_AUTH_TOKEN_URL || '',
        NEXT_PUBLIC_SHOPIFY_AUTH_LOGOUT_URL: process.env.NEXT_PUBLIC_SHOPIFY_AUTH_LOGOUT_URL || '',
        NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_API_URL: process.env.NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_API_URL || '',
    };
}

export default function AuthPage() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            router.push('/account');
        }
    }, [isAuthenticated, isLoading, router]);

    const handleLoginClick = async () => {
        if (isLoading) return;
        try {
            // Test cookie functionality
            const testCookie = 'test_cookie';
            document.cookie = `${testCookie}=test; path=/; domain=${window.location.hostname}`;
            console.log('Test cookie set. All cookies:', document.cookie);

            // Try to read the test cookie
            const cookies = document.cookie.split(';').map(c => c.trim());
            console.log('Current cookies:', cookies);

            // Clear test cookie
            document.cookie = `${testCookie}=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;

            await redirectToShopifyAuth();
        } catch (error) {
            console.error('Error initiating Shopify login:', error);
        }
    };

    useEffect(() => {
        document.body.classList.add('auth-page');
        return () => {
            document.body.classList.remove('auth-page');
        };
    }, []);

    if (isLoading || isAuthenticated) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container-represent py-12">
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-8">
                        <Link href="/">
                            <CldImage
                                src="mymessage/images/logo"
                                alt="MYMESSAGE"
                                width={120}
                                height={40}
                                className="mx-auto"
                            />
                        </Link>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
                        <button
                            onClick={handleLoginClick}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Continue with Shopify
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 