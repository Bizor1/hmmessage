import { shopifyFetch } from '../shopify';
import { createCartMutation } from './queries';
import { CartItem } from '@/context/CartContext';

interface CartCreateResponse {
    cartCreate: {
        cart: {
            id: string;
            checkoutUrl: string;
            lines: {
                edges: Array<{
                    node: {
                        id: string;
                        quantity: number;
                        merchandise: {
                            id: string;
                            title: string;
                        };
                    };
                }>;
            };
        };
        userErrors: Array<{
            field: string;
            message: string;
        }>;
    };
}

export async function createShopifyCheckout(cartItems: CartItem[]) {
    console.group('🛒 Shopify Checkout Creation Process');
    console.log('📥 Input cart items:', cartItems);
    console.log('📊 Cart items count:', cartItems.length);
    
    try {
        // Transform cart items into Shopify line items
        const lineItems = cartItems.map(item => ({
            merchandiseId: item.variantId || item.id, // Use variantId if available, fallback to id
            quantity: item.quantity
        }));

        console.log('🔄 Transformed line items:', lineItems);
        console.log('🔍 Line items details:');
        lineItems.forEach((item, index) => {
            console.log(`  Item ${index + 1}:`, {
                merchandiseId: item.merchandiseId,
                quantity: item.quantity,
                hasVariantId: !!cartItems[index].variantId,
                originalItem: cartItems[index]
            });
        });

        console.log('📡 Making Shopify API request...');
        console.log('🎯 Using mutation:', 'createCartMutation');
        console.log('📋 Request variables:', { lineItems });

        // Create cart using Shopify Storefront API
        const response = await shopifyFetch<CartCreateResponse>(
            createCartMutation,
            {
                lineItems
            }
        );

        console.log('✅ Shopify API response received:', response);
        console.log('🔍 Response details:');
        console.log('  - Cart ID:', response.cartCreate?.cart?.id);
        console.log('  - Checkout URL:', response.cartCreate?.cart?.checkoutUrl);
        console.log('  - Lines count:', response.cartCreate?.cart?.lines?.edges?.length);
        console.log('  - User errors count:', response.cartCreate?.userErrors?.length);

        if (response.cartCreate.userErrors.length > 0) {
            console.error('❌ Shopify cart creation errors:', response.cartCreate.userErrors);
            response.cartCreate.userErrors.forEach((error, index) => {
                console.error(`  Error ${index + 1}:`, {
                    field: error.field,
                    message: error.message
                });
            });
            throw new Error(response.cartCreate.userErrors[0].message);
        }

        const checkoutUrl = response.cartCreate.cart.checkoutUrl;
        console.log('🎉 Checkout URL generated successfully:', checkoutUrl);
        
        // Parse and analyze the checkout URL
        try {
            const url = new URL(checkoutUrl);
            console.log('🔗 Checkout URL analysis:');
            console.log('  - Protocol:', url.protocol);
            console.log('  - Host:', url.host);
            console.log('  - Pathname:', url.pathname);
            console.log('  - Search params:', url.search);
            console.log('  - Full URL:', url.toString());
            
            // Check if it's using custom domain or myshopify domain
            if (url.host.includes('.myshopify.com')) {
                console.log('✅ Using Shopify subdomain - should work');
            } else {
                console.log('⚠️ Using custom domain - potential checkout configuration needed');
            }
        } catch (urlError) {
            console.error('❌ Failed to parse checkout URL:', urlError);
        }

        console.groupEnd();
        
        // Return the checkout URL
        return checkoutUrl;
    } catch (error) {
        console.error('💥 Error creating Shopify cart:', error);
        console.log('🔍 Error details:');
        console.log('  - Error type:', typeof error);
        console.log('  - Error message:', error instanceof Error ? error.message : 'Unknown error');
        console.log('  - Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        console.groupEnd();
        throw error;
    }
} 