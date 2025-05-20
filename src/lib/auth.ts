// Add window.env type declaration
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

import { generatePkceChallenge, ShopifyOAuthTokenResponse } from './shopify';

// Constants for storage keys
const PKCE_VERIFIER_KEY = 'pkce_verifier';
const AUTH_STATE_KEY = 'auth_state';

// Helper function to get required environment variables
function getRequiredEnvVariable(name: string): string {
    const value = typeof window !== 'undefined' && window.env?.[name as keyof typeof window.env] || process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

// Helper function to generate random string for state
function generateRandomString(length: number): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Helper function to set a cookie
function setCookie(name: string, value: string, minutes: number = 5) {
    const date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    const expires = "; expires=" + date.toUTCString();
    const domain = window.location.hostname;
    document.cookie = `${name}=${value}${expires}; path=/; domain=${domain}; SameSite=Lax`;
    
    // Debug cookie setting
    console.log('[Auth] Setting cookie:', {
        name,
        value: value.substring(0, 5) + '...',
        domain,
        currentHost: window.location.hostname,
        fullCookie: document.cookie
    });
}

// Helper function to get a cookie
function getCookie(name: string): string | null {
    const cookies = document.cookie.split(';').map(c => c.trim());
    console.log('[Auth] All cookies:', cookies);
    
    const nameEQ = name + "=";
    for(const c of cookies) {
        if (c.indexOf(nameEQ) === 0) {
            const value = c.substring(nameEQ.length);
            console.log('[Auth] Found cookie:', { name, value: value.substring(0, 5) + '...' });
            return value;
        }
    }
    console.log('[Auth] Cookie not found:', name);
    return null;
}

// Helper function to delete a cookie
function deleteCookie(name: string) {
    const domain = window.location.hostname;
    document.cookie = `${name}=; path=/; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

/**
 * Initiates the Shopify OAuth login flow by redirecting the user.
 */
export async function redirectToShopifyAuth() {
    try {
        if (typeof window === 'undefined') {
            throw new Error("redirectToShopifyAuth can only be called on the client side.");
        }

        console.log('[Auth] Starting auth flow on:', window.location.href);

        // Clear any existing state
        deleteCookie(AUTH_STATE_KEY);
        sessionStorage.removeItem(PKCE_VERIFIER_KEY);

        // Generate and store state
        const state = generateRandomString(32);
        
        // Store state in multiple ways for redundancy
        setCookie(AUTH_STATE_KEY, state);
        sessionStorage.setItem(AUTH_STATE_KEY, state);
        
        // Verify storage
        const storedStateCookie = getCookie(AUTH_STATE_KEY);
        const storedStateSession = sessionStorage.getItem(AUTH_STATE_KEY);
        
        console.log('[Auth] State storage verification:', {
            state,
            storedStateCookie,
            storedStateSession,
            cookieMatches: storedStateCookie === state,
            sessionMatches: storedStateSession === state,
            allCookies: document.cookie
        });

        if (!storedStateCookie && !storedStateSession) {
            throw new Error("Failed to store authentication state");
        }

        // Generate and store PKCE challenge
        const { verifier, challenge } = await generatePkceChallenge();
        sessionStorage.setItem(PKCE_VERIFIER_KEY, verifier);

        // Get required environment variables
        const authorizeUrl = getRequiredEnvVariable('NEXT_PUBLIC_SHOPIFY_AUTH_AUTHORIZE_URL');
        const clientId = getRequiredEnvVariable('NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID');
        const redirectUri = getRequiredEnvVariable('NEXT_PUBLIC_SHOPIFY_AUTH_REDIRECT_URI');

        // Create authorization URL with stored state
        const params = new URLSearchParams({
            client_id: clientId,
            response_type: 'code',
            redirect_uri: redirectUri,
            scope: 'openid email',
            state: state,
            code_challenge: challenge,
            code_challenge_method: 'S256',
        });

        const fullUrl = `${authorizeUrl}?${params.toString()}`;
        console.log('[Auth] Redirecting to:', fullUrl);
        
        // Add a small delay to ensure storage is complete
        await new Promise(resolve => setTimeout(resolve, 100));
        
        window.location.href = fullUrl;
    } catch (error) {
        console.error('[Auth] Error in redirectToShopifyAuth:', error);
        throw error;
    }
}

export async function handleShopifyCallback(searchParams: URLSearchParams): Promise<ShopifyOAuthTokenResponse> {
    console.log('[Auth] Starting callback handling on:', window.location.href);

    const code = searchParams.get('code');
    const receivedState = searchParams.get('state');
    
    if (typeof window === 'undefined') {
        throw new Error("handleShopifyCallback should be processed on the client side.");
    }

    // Try to get state from multiple sources
    const storedStateCookie = getCookie(AUTH_STATE_KEY);
    const storedStateSession = sessionStorage.getItem(AUTH_STATE_KEY);
    const storedState = storedStateCookie || storedStateSession;
    
    const codeVerifier = sessionStorage.getItem(PKCE_VERIFIER_KEY);
    
    const debugInfo = {
        receivedState,
        storedStateCookie,
        storedStateSession,
        hasCodeVerifier: !!codeVerifier,
        currentUrl: window.location.href,
        allCookies: document.cookie,
        domain: window.location.hostname
    };
    
    console.log('[Auth] Callback debug info:', debugInfo);

    // Clear stored values
    deleteCookie(AUTH_STATE_KEY);
    sessionStorage.removeItem(AUTH_STATE_KEY);
    sessionStorage.removeItem(PKCE_VERIFIER_KEY);

    if (!code) {
        throw new Error('Authorization code not found in callback.');
    }

    if (!storedState || storedState !== receivedState) {
        console.error('[Auth] State mismatch:', debugInfo);
        throw new Error('Invalid state parameter. Possible CSRF attack.');
    }

    if (!codeVerifier) {
        throw new Error('PKCE code_verifier not found in session storage.');
    }

    try {
        // Call our server-side API route for token exchange
        const response = await fetch('/api/auth/callback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code,
                state: receivedState,
                codeVerifier
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Token exchange failed');
        }

        const tokenData = await response.json();
        return tokenData;
    } catch (error) {
        console.error('[Auth] Error in token exchange:', error);
        throw error;
    }
}

// Minimal SimpleCustomer type (customize as needed)
export type SimpleCustomer = {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
};

// Shopify logout helper
export function logoutFromShopify() {
    const logoutUrl = process.env.NEXT_PUBLIC_SHOPIFY_AUTH_LOGOUT_URL;
    if (logoutUrl && typeof window !== 'undefined') {
        window.location.href = logoutUrl;
    } else if (typeof window !== 'undefined') {
        // Fallback: just clear session storage
        sessionStorage.clear();
    }
}

// (Optional) Stub for getCustomer
export async function getCustomer(accessToken: string): Promise<SimpleCustomer | undefined> {
    try {
        const apiUrl = getRequiredEnvVariable('NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_API_URL');
        const response = await fetch(`${apiUrl}/customer/current.json`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error('[Auth] Failed to fetch customer data:', response.status);
            return undefined;
        }

        const data = await response.json();
        return {
            id: data.customer.id,
            email: data.customer.email,
            firstName: data.customer.firstName,
            lastName: data.customer.lastName
        };
    } catch (error) {
        console.error('[Auth] Error fetching customer:', error);
        return undefined;
    }
} 