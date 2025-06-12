'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
    href: string;
    selectedOptions?: Array<{
        name: string;
        value: string;
    }>;
    variantId?: string;
}

interface CartContextType {
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    cartItems: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    itemCount: number;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const openCart = useCallback(() => setIsCartOpen(true), []);
    const closeCart = useCallback(() => setIsCartOpen(false), []);

    const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
        console.group('🛍️ Adding item to cart');
        console.log('📦 Item being added:', item);

        setCartItems(prevItems => {
            console.log('🔍 Current cart items:', prevItems);

            // Check if the exact variant already exists in cart
            const existingItem = prevItems.find(i =>
                i.variantId === item.variantId ||
                (i.id === item.id && JSON.stringify(i.selectedOptions) === JSON.stringify(item.selectedOptions))
            );

            if (existingItem) {
                console.log('✅ Item already exists, updating quantity');
                console.log('  - Existing item:', existingItem);
                const updatedItems = prevItems.map(i =>
                    (i.variantId === item.variantId ||
                        (i.id === item.id && JSON.stringify(i.selectedOptions) === JSON.stringify(item.selectedOptions)))
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
                console.log('📊 Updated cart items:', updatedItems);
                console.groupEnd();
                return updatedItems;
            }

            console.log('🆕 Adding new item to cart');
            const newItems = [...prevItems, { ...item, quantity: 1 }];
            console.log('📊 New cart items:', newItems);
            console.groupEnd();
            return newItems;
        });
    }, []);

    const removeFromCart = useCallback((id: string) => {
        console.group('🗑️ Removing item from cart');
        console.log('📦 Item ID to remove:', id);

        setCartItems(prevItems => {
            console.log('🔍 Current cart items:', prevItems);
            const filteredItems = prevItems.filter(item => item.id !== id);
            console.log('📊 Cart items after removal:', filteredItems);
            console.groupEnd();
            return filteredItems;
        });
    }, []);

    const updateQuantity = useCallback((id: string, quantity: number) => {
        console.group('🔄 Updating item quantity');
        console.log('📦 Item ID:', id);
        console.log('🔢 New quantity:', quantity);

        if (quantity < 1) {
            console.log('❌ Quantity less than 1, ignoring update');
            console.groupEnd();
            return;
        }

        setCartItems(prevItems => {
            console.log('🔍 Current cart items:', prevItems);
            const updatedItems = prevItems.map(item =>
                item.id === id ? { ...item, quantity } : item
            );
            console.log('📊 Updated cart items:', updatedItems);
            console.groupEnd();
            return updatedItems;
        });
    }, []);

    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider
            value={{
                isCartOpen,
                openCart,
                closeCart,
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                itemCount,
                cartTotal
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}; 