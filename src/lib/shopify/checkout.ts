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
    try {
        // Transform cart items into Shopify line items
        const lineItems = cartItems.map(item => ({
            merchandiseId: item.id, // This should be a Shopify variant ID
            quantity: item.quantity
        }));

        // Create cart using Shopify Storefront API
        const response = await shopifyFetch<CartCreateResponse>(
            createCartMutation,
            {
                lineItems
            }
        );

        if (response.cartCreate.userErrors.length > 0) {
            throw new Error(response.cartCreate.userErrors[0].message);
        }

        // Return the checkout URL
        return response.cartCreate.cart.checkoutUrl;
    } catch (error) {
        console.error('Error creating Shopify cart:', error);
        throw error;
    }
} 