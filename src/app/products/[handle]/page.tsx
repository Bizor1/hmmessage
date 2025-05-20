import { Metadata } from "next";
import { notFound } from 'next/navigation';
import { shopifyFetch } from '@/lib/shopify';
import ProductDetailsClient from '@/components/ProductDetailsClient';

// Query to get product details including all images
const getProductQuery = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      media(first: 20) {
        edges {
          node {
            ... on MediaImage {
              mediaContentType
              image {
                url
                altText
              }
            }
            ... on Video {
              mediaContentType
              sources {
                url
                mimeType
                format
              }
              previewImage {
                url
              }
            }
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
    }
  }
`;

interface ShopifyProduct {
    id: string;
    title: string;
    description: string;
    handle: string;
    priceRange: {
        minVariantPrice: {
            amount: string;
            currencyCode: string;
        };
    };
    media: {
        edges: Array<{
            node: {
                mediaContentType: string;
                image?: {
                    url: string;
                    altText: string | null;
                };
                sources?: Array<{
                    url: string;
                    mimeType: string;
                    format: string;
                }>;
                previewImage?: {
                    url: string;
                };
            };
        }>;
    };
    variants: {
        edges: Array<{
            node: {
                id: string;
                title: string;
                availableForSale: boolean;
                selectedOptions: Array<{
                    name: string;
                    value: string;
                }>;
            };
        }>;
    };
    options: Array<{
        name: string;
        values: string[];
    }>;
}

interface PageProps {
    params: {
        handle: string;
    };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    try {
        const response = await shopifyFetch<{ product: ShopifyProduct }>(getProductQuery, {
            handle: params.handle
        });

        if (!response.product) {
            return {
                title: 'Product Not Found',
            };
        }

        return {
            title: response.product.title,
            description: response.product.description,
            openGraph: {
                images: response.product.media.edges.map(edge => ({
                    url: edge.node.image?.url || edge.node.sources?.[0].url || '',
                    alt: edge.node.image?.altText || response.product.title,
                })),
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Product',
        };
    }
}

export default async function ProductPage({ params }: PageProps) {
    const { handle } = params;

    try {
        const response = await shopifyFetch<{ product: ShopifyProduct }>(getProductQuery, {
            handle
        });

        if (!response.product) {
            notFound();
        }

        // Sort images to prioritize front/back/detail images
        const sortedImages = response.product.media.edges.sort((a, b) => {
            const urlA = a.node.image?.url?.toLowerCase() || '';
            const urlB = b.node.image?.url?.toLowerCase() || '';

            // Front images first
            if (urlA.includes('front')) return -1;
            if (urlB.includes('front')) return 1;

            // Back images second
            if (urlA.includes('back')) return -1;
            if (urlB.includes('back')) return 1;

            // Detail images last
            if (urlA.includes('detail')) return 1;
            if (urlB.includes('detail')) return -1;

            return 0;
        });

        // Separate detail images
        const detailImages = sortedImages.filter(img =>
            img.node.image?.url?.toLowerCase().includes('detail') ||
            img.node.sources?.some(source => source.url.toLowerCase().includes('detail'))
        );

        const mainImages = sortedImages.filter(img =>
            !img.node.image?.url?.toLowerCase().includes('detail') &&
            !img.node.sources?.some(source => source.url.toLowerCase().includes('detail'))
        );

        const transformedProduct = {
            id: response.product.id,
            title: response.product.title,
            description: response.product.description,
            price: parseFloat(response.product.priceRange.minVariantPrice.amount),
            currencyCode: response.product.priceRange.minVariantPrice.currencyCode,
            mainImages: mainImages.map(img => ({
                url: img.node.image?.url || img.node.sources?.[0].url || '',
                altText: img.node.image?.altText || response.product.title,
                type: (img.node.mediaContentType === 'VIDEO' ? 'video' : 'image') as 'video' | 'image',
                previewUrl: img.node.previewImage?.url
            })),
            detailImages: detailImages.map(img => ({
                url: img.node.image?.url || img.node.sources?.[0].url || '',
                altText: img.node.image?.altText || response.product.title,
                type: (img.node.mediaContentType === 'VIDEO' ? 'video' : 'image') as 'video' | 'image',
                previewUrl: img.node.previewImage?.url
            })),
            options: response.product.options,
            variants: response.product.variants.edges.map(({ node }) => ({
                id: node.id,
                title: node.title,
                availableForSale: node.availableForSale,
                selectedOptions: node.selectedOptions
            }))
        };

        return <ProductDetailsClient product={transformedProduct} />;
    } catch (error) {
        console.error('Error fetching product:', error);
        notFound();
    }
} 