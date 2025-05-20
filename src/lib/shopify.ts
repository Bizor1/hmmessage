// src/lib/shopify.ts

// Type for the expected GraphQL response structure
type ShopifyResponse<T> = {
    data?: T;
    errors?: { message: string }[];
};

/**
 * Sends a GraphQL query or mutation to the Shopify Storefront API.
 * @param query The GraphQL query or mutation string.
 * @param variables Optional variables for the GraphQL query.
 * @returns The data part of the Shopify response.
 * @throws Error if the fetch fails or Shopify returns errors.
 */
export async function shopifyFetch<T>(
    query: string,
    variables: Record<string, unknown> = {}
): Promise<T> {
    const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!storeDomain || !storefrontAccessToken) {
        throw new Error('Missing required environment variables NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN');
    }

    const endpoint = `https://${storeDomain}/api/2024-01/graphql.json`;

    try {
        console.log('Making request to Shopify API:', endpoint);
        console.log('Request headers:', {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': storefrontAccessToken.substring(0, 5) + '...'  // Log only first 5 chars for security
        });
        
        const result = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': storefrontAccessToken
            },
            body: JSON.stringify({ query, variables })
        });

        console.log('Response status:', result.status, result.statusText);
        
        if (!result.ok) {
            const errorText = await result.text();
            console.error('Error response body:', errorText);
            throw new Error(`Fetch failed: ${result.status} ${result.statusText} - ${errorText}`);
        }

        const body = await result.json() as ShopifyResponse<T>;

        if (body.errors) {
            console.error('Shopify GraphQL Errors:', body.errors);
            throw new Error(body.errors.map((e) => e.message).join('\n'));
        }

        if (!body.data) {
            throw new Error('No data returned from Shopify API.');
        }

        return body.data;
    } catch (error) {
        console.error('Error fetching from Shopify:', error);
        if (error instanceof Error) {
            throw new Error(`Shopify API fetch error: ${error.message}`);
        } else {
            throw new Error('An unknown error occurred while fetching from Shopify.');
        }
    }
}

// --- New Code for Customer Account API & OAuth ---

// Helper to generate code_verifier and code_challenge for PKCE
export async function generatePkceChallenge() {
    const verifier = generateRandomString(128);
    const challenge = await sha256(verifier);
    const base64Challenge = bufferToBase64UrlEncoded(challenge);
    return { verifier, challenge: base64Challenge };
}

function generateRandomString(length: number) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let text = '';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function sha256(plain: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return crypto.subtle.digest('SHA-256', data);
}

function bufferToBase64UrlEncoded(buffer: ArrayBuffer): string {
    const view = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < view.length; i++) {
        binary += String.fromCharCode(view[i]);
    }
    return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}


export interface ShopifyOAuthTokenResponse {
    access_token: string;
    expires_in: number;
    id_token?: string; // If OpenID scope is used
    refresh_token: string;
    scope: string;
    token_type: 'Bearer';
}

/**
 * Exchanges an authorization code for an access token with Shopify's OAuth token endpoint.
 */
export async function exchangeCodeForToken(
    authorizationCode: string,
    codeVerifier: string,
    clientId: string,
    redirectUri: string,
    tokenEndpoint: string
): Promise<ShopifyOAuthTokenResponse> {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', clientId);
    params.append('redirect_uri', redirectUri);
    params.append('code', authorizationCode);
    params.append('code_verifier', codeVerifier);

    try {
        const response = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Shopify Token Exchange Error:', response.status, errorBody);
            throw new Error(`Failed to exchange code for token: ${response.status} - ${errorBody}`);
        }

        const tokenData: ShopifyOAuthTokenResponse = await response.json();
        return tokenData;

    } catch (error) {
        console.error('Error in exchangeCodeForToken:', error);
        if (error instanceof Error) {
            throw new Error(`Token exchange failed: ${error.message}`);
        }
        throw new Error('An unknown error occurred during token exchange.');
    }
}

/**
 * Sends a GraphQL query or mutation to the Shopify Customer Account API.
 * @param query The GraphQL query or mutation string.
 * @param accessToken The customer's access token.
 * @param variables Optional variables for the GraphQL query.
 * @returns The data part of the Shopify response.
 * @throws Error if the fetch fails or Shopify returns errors.
 */
export async function customerAccountApiFetch<T>(
    query: string,
    accessToken: string,
    variables: Record<string, unknown> = {}
): Promise<T> {
    const customerApiUrl = process.env.NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_API_URL;

    if (!customerApiUrl) {
        throw new Error('Missing required environment variable NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_API_URL');
    }
    // The Customer Account API endpoint is usually the base URL directly.
    // Example: https://{shop_id}.account.myshopify.com/api/customer/graphql.json - this needs to be verified from Shopify docs/admin for your setup
    // For now, let's assume customerApiUrl is the full GraphQL endpoint or we append a standard path.
    // Let's assume customerApiUrl IS the graphql endpoint.
    // const endpoint = `${customerApiUrl}/api/2024-01/graphql`; // Or whatever the correct path is

    const endpoint = customerApiUrl; // Assuming this env var IS the full GraphQL endpoint path

    try {
        const result = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`, // Customer Account API uses Bearer token
            },
            body: JSON.stringify({ query, variables }),
        });

        if (!result.ok) {
            const errorText = await result.text();
            console.error('Shopify Customer API Error Response:', errorText);
            throw new Error(`Customer Account API Fetch failed: ${result.status} ${result.statusText} - ${errorText}`);
        }

        const body = await result.json() as ShopifyResponse<T>;

        if (body.errors) {
            console.error('Shopify Customer Account API GraphQL Errors:', body.errors);
            throw new Error(body.errors.map((e) => e.message).join('\n'));
        }

        if (!body.data) {
            throw new Error('No data returned from Shopify Customer Account API.');
        }
        return body.data;
    } catch (error) {
        console.error('Error fetching from Shopify Customer Account API:', error);
        if (error instanceof Error) {
            throw new Error(`Customer Account API fetch error: ${error.message}`);
        } else {
            throw new Error('An unknown error occurred while fetching from Customer Account API.');
        }
    }
} 