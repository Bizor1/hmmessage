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
        setCartItems(prevItems => {
            // Check if the exact variant already exists in cart
            const existingItem = prevItems.find(i =>
                i.variantId === item.variantId ||
                (i.id === item.id && JSON.stringify(i.selectedOptions) === JSON.stringify(item.selectedOptions))
            );

            if (existingItem) {
                return prevItems.map(i =>
                    (i.variantId === item.variantId ||
                        (i.id === item.id && JSON.stringify(i.selectedOptions) === JSON.stringify(item.selectedOptions)))
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...prevItems, { ...item, quantity: 1 }];
        });
    }, []);

    const removeFromCart = useCallback((id: string) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    }, []);

    const updateQuantity = useCallback((id: string, quantity: number) => {
        if (quantity < 1) return;
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        );
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