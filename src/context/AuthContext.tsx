'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { logoutFromShopify, SimpleCustomer } from '@/lib/auth';
import { ShopifyOAuthTokenResponse } from '@/lib/shopify';

// Define the structure for storing token data in localStorage
interface StoredShopifyAuthData {
    accessToken: string;
    refreshToken?: string; // Optional, but good to store if available
    expiresAt: number; // Timestamp
    user?: SimpleCustomer; // Store basic user info
}

interface AuthContextType {
    isAuthenticated: boolean;
    accessToken: string | null;
    user: SimpleCustomer | null;
    login: (tokenResponse: ShopifyOAuthTokenResponse, userData?: SimpleCustomer) => void;
    logout: () => void;
    isLoading: boolean; // To handle async loading of session from storage
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const SHOPIFY_AUTH_DATA_KEY = 'shopifyAuthData';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<SimpleCustomer | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Start with loading true

    const loadSession = useCallback(() => {
        setIsLoading(true);
        const storedDataString = localStorage.getItem(SHOPIFY_AUTH_DATA_KEY);
        if (storedDataString) {
            try {
                const storedData = JSON.parse(storedDataString) as StoredShopifyAuthData;
                if (new Date().getTime() < storedData.expiresAt) {
                    setAccessToken(storedData.accessToken);
                    setUser(storedData.user || null);
                } else {
                    console.log('Shopify token expired, clearing session.');
                    localStorage.removeItem(SHOPIFY_AUTH_DATA_KEY);
                    // Optionally: Add refresh token logic here in the future
                }
            } catch (error) {
                console.error('Failed to parse stored auth data:', error);
                localStorage.removeItem(SHOPIFY_AUTH_DATA_KEY);
            }
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadSession();
        // Optional: Listen for storage events to sync across tabs
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === SHOPIFY_AUTH_DATA_KEY) {
                loadSession(); // Re-load session if auth data changed in another tab
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [loadSession]);

    const login = (tokenResponse: ShopifyOAuthTokenResponse, userData?: SimpleCustomer) => {
        const expiresAt = new Date().getTime() + (tokenResponse.expires_in * 1000);
        const authData: StoredShopifyAuthData = {
            accessToken: tokenResponse.access_token,
            refreshToken: tokenResponse.refresh_token,
            expiresAt,
            user: userData,
        };
        localStorage.setItem(SHOPIFY_AUTH_DATA_KEY, JSON.stringify(authData));
        setAccessToken(authData.accessToken);
        setUser(userData || null);
    };

    const logout = () => {
        localStorage.removeItem(SHOPIFY_AUTH_DATA_KEY);
        setAccessToken(null);
        setUser(null);
        logoutFromShopify(); // Attempt to logout from Shopify's session too
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!accessToken && !isLoading, // Only authenticated if not loading and token exists
                accessToken,
                user,
                login,
                logout,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 