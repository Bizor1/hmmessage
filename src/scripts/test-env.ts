import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('Testing environment variables...');
console.log('NEXT_PUBLIC_SHOPIFY_AUTH_AUTHORIZE_URL:', process.env.NEXT_PUBLIC_SHOPIFY_AUTH_AUTHORIZE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV); 