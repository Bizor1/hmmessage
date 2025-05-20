'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from './ProductCard';
import { shopifyFetch } from '@/lib/shopify';

interface DummyProduct {
    id: string;
    imageUrlFront: string;
    imageUrlBack: string;
    name: string;
    price: number;
    currencyCode?: string;
    color?: string;
    variantCount?: number;
    href: string;
    variantId?: string;
}

interface ShopifyProduct {
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
                altText: string | null;
            };
        }>;
    };
    variants: {
        edges: Array<{
            node: {
                id: string;
                selectedOptions: Array<{
                    name: string;
                    value: string;
                }>;
            };
        }>;
    };
}

const searchProductsQuery = `
  query searchProducts($query: String!) {
    products(first: 24, query: $query) {
      edges {
        node {
          id
          title
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 10) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default function SearchResults({ searchQuery }: { searchQuery: string }) {
    const [products, setProducts] = useState<DummyProduct[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function performSearch() {
            if (!searchQuery.trim()) {
                setProducts([]);
                return;
            }

            setIsLoading(true);
            try {
                const response = await shopifyFetch<{
                    products: {
                        edges: Array<{
                            node: ShopifyProduct;
                        }>;
                    };
                }>(searchProductsQuery, {
                    query: searchQuery
                });

                const transformedProducts: DummyProduct[] = response.products.edges.map(({ node }) => {
                    // First try to find front/back images by URL
                    const frontImage = node.images.edges.find(
                        img => img.node.url.toLowerCase().includes('front')
                    );

                    const backImage = node.images.edges.find(
                        img => img.node.url.toLowerCase().includes('back')
                    );

                    // If we found both front and back images by URL, use them
                    if (frontImage && backImage) {
                        return {
                            id: node.id,
                            name: node.title,
                            href: `/products/${node.handle}`,
                            price: parseFloat(node.priceRange.minVariantPrice.amount),
                            currencyCode: node.priceRange.minVariantPrice.currencyCode,
                            imageUrlFront: frontImage.node.url,
                            imageUrlBack: backImage.node.url,
                            color: node.variants.edges[0]?.node.selectedOptions.find(
                                opt => opt.name.toLowerCase() === 'color'
                            )?.value,
                            variantId: node.variants.edges[0]?.node.id
                        };
                    }

                    // If we didn't find front/back images by URL, fall back to using first two images
                    return {
                        id: node.id,
                        name: node.title,
                        href: `/products/${node.handle}`,
                        price: parseFloat(node.priceRange.minVariantPrice.amount),
                        currencyCode: node.priceRange.minVariantPrice.currencyCode,
                        imageUrlFront: node.images.edges[0]?.node.url || '',
                        imageUrlBack: node.images.edges[1]?.node.url || node.images.edges[0]?.node.url || '',
                        color: node.variants.edges[0]?.node.selectedOptions.find(
                            opt => opt.name.toLowerCase() === 'color'
                        )?.value,
                        variantId: node.variants.edges[0]?.node.id
                    };
                });

                setProducts(transformedProducts);
            } catch (error) {
                console.error('Error searching products:', error);
            } finally {
                setIsLoading(false);
            }
        }

        performSearch();
    }, [searchQuery]);

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-medium">
                    {searchQuery ? `Search results for "${searchQuery}"` : 'Search our products'}
                </h1>
                <p className="text-gray-500">
                    {products.length} {products.length === 1 ? 'result' : 'results'}
                </p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="aspect-square bg-gray-200 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4 mt-2"></div>
                        </div>
                    ))}
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : searchQuery ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">No products found matching &quot;{searchQuery}&quot;</p>
                    <button
                        onClick={() => router.push('/')}
                        className="mt-4 text-sm text-black underline"
                    >
                        Continue shopping
                    </button>
                </div>
            ) : null}
        </div>
    );
} 