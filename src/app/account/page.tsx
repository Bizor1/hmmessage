'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { shopifyFetch } from '@/lib/shopify';
import LoadingSpinner from '@/components/LoadingSpinner';

// Define the GraphQL query to fetch customer data
const getCustomerDataQuery = `
  query($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
      # Add other fields like addresses or orders if needed later
      # defaultAddress {
      #   address1, city, zip, country
      # }
      # orders(first: 10) {
      #   edges { node { id, orderNumber, totalPrice { amount } } }
      # }
    }
  }
`;

// Define the expected shape of the customer data
interface CustomerData {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    // Add types for address/orders if fetched
}

export default function AccountPage() {
    const { accessToken, isAuthenticated, logout } = useAuth();
    const router = useRouter();

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth');
        }
    }, [isAuthenticated, router]);

    const { data: customerData, isLoading, error, isError } = useQuery<
        { customer: CustomerData | null }, // Query Function Return Type
        Error,                         // Error Type
        CustomerData | null            // Selected Data Type
    >({
        queryKey: ['customerData', accessToken],
        queryFn: async () => {
            if (!accessToken) {
                return { customer: null }; // Return expected shape even if not fetching
            }
            try {
                const response = await shopifyFetch<{ customer: CustomerData | null }>(
                    getCustomerDataQuery,
                    { customerAccessToken: accessToken }
                );
                // Check if customer data is null (could happen if token is invalid/expired despite being present)
                if (!response.customer) {
                    console.warn('Customer data not found, possibly invalid token.');
                    return { customer: null }; // Return expected shape
                }
                return response; // Return the full response object
            } catch (fetchError) {
                console.error("Error fetching customer data:", fetchError);
                if (fetchError instanceof Error && fetchError.message.includes('invalid')) {
                    // Handle invalid token (e.g., logout)
                }
                throw fetchError;
            }
        },
        enabled: !!accessToken && isAuthenticated,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        select: (data) => data?.customer, // Select the customer property from the response
    });

    const handleLogout = () => {
        logout();
        router.push('/'); // Redirect to homepage after logout
    };

    // Render loading state
    if (isLoading && isAuthenticated) {
        return (
            <div className="container-represent py-12 min-h-[50vh] flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    // Render error state
    if (isError) {
        return (
            <div className="container-represent py-12">
                <h1 className="text-2xl font-medium mb-4">Account Error</h1>
                <p className="mb-4">There was an error loading your account details. Please try logging out and back in.</p>
                <pre className="text-xs bg-red-100 p-2 rounded mb-4">Error: {error?.message}</pre>
                <button
                    onClick={handleLogout}
                    className="btn-represent bg-red-600 hover:bg-red-700"
                >
                    Logout
                </button>
            </div>
        );
    }

    // Render account details if authenticated and data is loaded
    if (isAuthenticated && customerData) {
        return (
            <div className="container-represent py-12">
                <h1 className="text-2xl font-medium mb-6">My Account</h1>
                <div className="bg-white p-6 shadow rounded mb-6">
                    <h2 className="text-lg font-semibold mb-4">Welcome, {customerData.firstName || 'Customer'}!</h2>
                    <p className="text-sm text-gray-600 mb-1">Email: {customerData.email}</p>
                    {/* Add more customer details display here */}
                </div>
                <button
                    onClick={handleLogout}
                    className="btn-represent"
                >
                    Logout
                </button>
            </div>
        );
    }

    // Fallback or if still redirecting
    return (
        <div className="container-represent py-12 min-h-[50vh] flex items-center justify-center">
            <p>Loading account...</p>
        </div>
    );
} 