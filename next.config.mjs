/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN:
      process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
    SHOPIFY_STOREFRONT_ACCESS_TOKEN:
      process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID:
      process.env.NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID,
    NEXT_PUBLIC_SHOPIFY_AUTH_AUTHORIZE_URL:
      process.env.NEXT_PUBLIC_SHOPIFY_AUTH_AUTHORIZE_URL,
    NEXT_PUBLIC_SHOPIFY_AUTH_TOKEN_URL:
      process.env.NEXT_PUBLIC_SHOPIFY_AUTH_TOKEN_URL,
    NEXT_PUBLIC_SHOPIFY_AUTH_LOGOUT_URL:
      process.env.NEXT_PUBLIC_SHOPIFY_AUTH_LOGOUT_URL,
    NEXT_PUBLIC_SHOPIFY_AUTH_REDIRECT_URI:
      process.env.NEXT_PUBLIC_SHOPIFY_AUTH_REDIRECT_URI,
    NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_API_URL:
      process.env.NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_API_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "worldelegantkp.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
