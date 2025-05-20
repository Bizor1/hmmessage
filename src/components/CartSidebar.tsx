'use client';

import { useCart, CartItem } from '@/context/CartContext';
import { createShopifyCheckout } from '@/lib/shopify/checkout';
import { shopifyFetch } from '@/lib/shopify';
import { getRecommendedProductsQuery } from '@/lib/shopify/queries';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Interface for recommended products
interface RecommendedProduct {
    id: string;
    title: string;
    handle: string;
    price: number;
    currencyCode: string;
    imageUrl: string;
    variantId: string;
}

interface ShopifyResponse {
    products: {
        edges: Array<{
            node: {
                id: string;
                title: string;
                handle: string;
                priceRange: {
                    minVariantPrice: {
                        amount: string;
                        currencyCode: string;
                    };
                };
                images: {
                    edges: Array<{
                        node: {
                            url: string;
                        };
                    }>;
                };
                variants: {
                    edges: Array<{
                        node: {
                            id: string;
                        };
                    }>;
                };
            };
        }>;
    };
}

// Reusable component for quantity adjustments
const QuantitySelector = ({ item, updateQuantity }: { item: CartItem, updateQuantity: (id: string, q: number) => void }) => {
    return (
        <div className="flex items-center border border-gray-200 text-xs w-fit">
            <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
                disabled={item.quantity <= 1} // Disable minus when quantity is 1
            >
                -
            </button>
            <span className="px-3 py-1">{item.quantity}</span>
            <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="px-2 py-1 hover:bg-gray-100"
            >
                +
            </button>
        </div>
    );
};

export default function CartSidebar() {
    const {
        isCartOpen,
        closeCart,
        cartItems,
        removeFromCart,
        updateQuantity,
        cartTotal,
        addToCart
    } = useCart();

    const [isProcessing, setIsProcessing] = useState(false);
    const [checkoutError, setCheckoutError] = useState<string | null>(null);
    const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([]);

    // Fetch recommended products
    useEffect(() => {
        async function fetchRecommendedProducts() {
            try {
                const response = await shopifyFetch<ShopifyResponse>(getRecommendedProductsQuery, { first: 3 });
                const products = response.products.edges.map(({ node }) => ({
                    id: node.id,
                    title: node.title,
                    handle: node.handle,
                    price: parseFloat(node.priceRange.minVariantPrice.amount),
                    currencyCode: node.priceRange.minVariantPrice.currencyCode,
                    imageUrl: node.images.edges[0]?.node.url || '',
                    variantId: node.variants.edges[0]?.node.id
                }));
                setRecommendedProducts(products);
            } catch (error) {
                console.error('Error fetching recommended products:', error);
            }
        }

        if (isCartOpen) {
            fetchRecommendedProducts();
        }
    }, [isCartOpen]);

    const formattedTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cartTotal);

    const handleCheckout = async () => {
        setIsProcessing(true);
        setCheckoutError(null);

        try {
            const checkoutUrl = await createShopifyCheckout(cartItems);
            window.location.href = checkoutUrl;
        } catch (error) {
            console.error('Checkout error:', error);
            setCheckoutError('Failed to create checkout. Please try again.');
            setIsProcessing(false);
        }
    };

    return (
        <>
            {/* Backdrop Overlay */}
            {isCartOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[98] transition-opacity duration-300 ease-in-out"
                    onClick={closeCart}
                    aria-hidden="true"
                ></div>
            )}

            {/* Sidebar */}
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-[99] transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b border-gray-200">
                        <h2 className="text-sm font-medium uppercase tracking-wider">Your Cart</h2>
                        <button onClick={closeCart} className="text-gray-500 hover:text-black">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="sr-only">Close cart</span>
                        </button>
                    </div>

                    {/* Shipping Notice (Optional) */}
                    {/* <div className="p-3 text-center text-xs bg-gray-50 border-b border-gray-200"> */}
                    {/*    YOU'RE $X AWAY FROM <span className="font-medium">FREE SHIPPING</span> */}
                    {/* </div> */}

                    {/* Cart Items List */}
                    <div className="flex-grow overflow-y-auto p-4 space-y-4">
                        {cartItems.length === 0 ? (
                            <p className="text-center text-gray-500">Your cart is empty.</p>
                        ) : (
                            cartItems.map(item => (
                                <div key={item.id} className="flex space-x-4 border-b border-gray-100 pb-4 last:border-b-0">
                                    <div className="w-20 h-20 bg-gray-100 flex-shrink-0">
                                        {item.imageUrl ? (
                                            <Image src={item.imageUrl} alt={item.name} width={80} height={80} className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200"></div> // Placeholder
                                        )}
                                    </div>
                                    <div className="flex-grow flex flex-col justify-between">
                                        <div>
                                            <Link href={item.href || '#'} className="text-sm font-medium hover:underline" onClick={closeCart}>{item.name}</Link>
                                            <p className="text-xs text-gray-500 mt-1">{item.variantTitle || 'One Size'}</p>
                                            <QuantitySelector item={item} updateQuantity={updateQuantity} />
                                        </div>
                                        <p className="text-sm font-medium text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price)}</p>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="text-xs text-gray-500 hover:text-black underline self-start pt-1">
                                        Remove
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Recommended Products Section */}
                    <div className="p-4 border-t border-gray-200">
                        <h3 className="text-xs font-medium uppercase tracking-wider mb-3">You Might Also Like</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {recommendedProducts.map((product) => (
                                <div key={product.id} className="relative group">
                                    <Link
                                        href={`/products/${product.handle}`}
                                        onClick={closeCart}
                                        className="block aspect-square relative overflow-hidden bg-gray-100"
                                    >
                                        <Image
                                            src={product.imageUrl}
                                            alt={product.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </Link>
                                    <div className="mt-2">
                                        <Link
                                            href={`/products/${product.handle}`}
                                            onClick={closeCart}
                                            className="text-xs hover:underline line-clamp-1"
                                        >
                                            {product.title}
                                        </Link>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-xs">
                                                {new Intl.NumberFormat('en-US', {
                                                    style: 'currency',
                                                    currency: product.currencyCode
                                                }).format(product.price)}
                                            </span>
                                            <button
                                                onClick={() => {
                                                    addToCart({
                                                        id: product.variantId,
                                                        name: product.title,
                                                        price: product.price,
                                                        imageUrl: product.imageUrl,
                                                        href: `/products/${product.handle}`
                                                    });
                                                }}
                                                className="text-xs bg-black text-white px-2 py-1 hover:bg-gray-800 transition-colors"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer (Totals & Checkout) */}
                    <div className="p-4 border-t border-gray-200 mt-auto bg-white">
                        <div className="flex justify-between text-xs mb-2">
                            <span>Subtotal:</span>
                            <span>{formattedTotal}</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium mb-3">
                            <span>CART TOTAL:</span>
                            <span>{formattedTotal}</span>
                        </div>
                        <p className="text-xs text-center text-gray-500 mb-3">Gift cards & promotional codes applied at checkout</p>
                        {checkoutError && (
                            <p className="text-red-500 text-xs text-center mb-3">{checkoutError}</p>
                        )}
                        <button
                            className="w-full bg-black text-white py-3 text-sm font-medium uppercase tracking-wider flex items-center justify-center disabled:opacity-50"
                            disabled={cartItems.length === 0 || isProcessing}
                            onClick={handleCheckout}
                        >
                            {isProcessing ? (
                                <>
                                    Processing...
                                    <svg className="animate-spin h-4 w-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </>
                            ) : (
                                <>
                                    Secure Checkout
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H4.5a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                    </svg>
                                </>
                            )}
                        </button>
                        {/* Payment Icons Placeholder */}
                        <div className="mt-4 text-center text-xs text-gray-400">
                            {/* Add payment SVGs or an image sprite here */}
                            Payment methods placeholder
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 