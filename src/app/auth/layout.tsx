import Script from 'next/script';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Get environment variables at build/server time
    const envVars = {
        NEXT_PUBLIC_SHOPIFY_AUTH_AUTHORIZE_URL: process.env.NEXT_PUBLIC_SHOPIFY_AUTH_AUTHORIZE_URL,
        NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID: process.env.NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID,
        NEXT_PUBLIC_SHOPIFY_AUTH_REDIRECT_URI: process.env.NEXT_PUBLIC_SHOPIFY_AUTH_REDIRECT_URI,
        NEXT_PUBLIC_SHOPIFY_AUTH_TOKEN_URL: process.env.NEXT_PUBLIC_SHOPIFY_AUTH_TOKEN_URL,
        NEXT_PUBLIC_SHOPIFY_AUTH_LOGOUT_URL: process.env.NEXT_PUBLIC_SHOPIFY_AUTH_LOGOUT_URL,
        NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_API_URL: process.env.NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_API_URL,
    };

    return (
        <>
            <Script
                id="env-script"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{
                    __html: `window.env = ${JSON.stringify(envVars)};`,
                }}
            />
            {children}
        </>
    );
} 