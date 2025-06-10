'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface VideoMedia {
    id: string;
    alt?: string;
    mediaContentType: string;
    preview?: {
        image?: {
            url: string;
        };
    };
    sources?: Array<{
        url: string;
        mimeType: string;
        format: string;
        height: number;
        width: number;
    }>;
}

interface ProductWithMedia {
    id: string;
    title: string;
    handle: string;
    media: {
        edges: Array<{
            node: VideoMedia;
        }>;
    };
}

interface ProductsResponse {
    data: {
        products: {
            edges: Array<{
                node: ProductWithMedia;
            }>;
        };
    };
}

export default function TestVideosPage() {
    const [products, setProducts] = useState<ProductWithMedia[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProductsWithVideos();
    }, []);

    const fetchProductsWithVideos = async () => {
        try {
            setLoading(true);
            setError(null);

            const query = {
                query: `
          query {
            products(first: 10) {
              edges {
                node {
                  id
                  title
                  handle
                  media(first: 10) {
                    edges {
                      node {
                        ... on Video {
                          id
                          alt
                          mediaContentType
                          preview {
                            image {
                              url
                            }
                          }
                          sources {
                            url
                            mimeType
                            format
                            height
                            width
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `
            };

            const response = await fetch('/api/admin-graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(query),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: ProductsResponse = await response.json();

            if (result.data?.products?.edges) {
                // Filter products that have video media
                const productsWithVideos = result.data.products.edges
                    .map(edge => edge.node)
                    .filter(product =>
                        product.media.edges.some(mediaEdge =>
                            mediaEdge.node.mediaContentType === 'VIDEO'
                        )
                    );

                setProducts(productsWithVideos);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const VideoPlayer = ({ video, productTitle }: { video: VideoMedia; productTitle: string }) => {
        const [videoError, setVideoError] = useState<string | null>(null);
        const [isLoading, setIsLoading] = useState(true);

        const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
            console.error('Video error:', e);
            setVideoError('Failed to load video');
            setIsLoading(false);
        };

        const handleVideoLoad = () => {
            setIsLoading(false);
            setVideoError(null);
        };

        const videoSources = video.sources || [];
        const previewImage = video.preview?.image?.url;

        return (
            <div className="border rounded-lg p-4 bg-white shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">
                    {productTitle} - Video {video.id.split('/').pop()}
                </h4>

                <div className="space-y-4">
                    {/* Video sources info */}
                    <div className="text-sm text-gray-600">
                        <p><strong>Media Type:</strong> {video.mediaContentType}</p>
                        <p><strong>Sources Available:</strong> {videoSources.length}</p>
                        {previewImage && (
                            <p><strong>Preview Image:</strong> Available</p>
                        )}
                    </div>

                    {/* Video sources details */}
                    {videoSources.length > 0 && (
                        <div className="text-xs text-gray-500">
                            <p><strong>Video Sources:</strong></p>
                            {videoSources.map((source, index) => (
                                <div key={index} className="ml-2">
                                    <p>• {source.format} ({source.mimeType}) - {source.width}x{source.height}</p>
                                    <p className="text-blue-600 break-all ml-4">{source.url}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Video Player Attempts */}
                    <div className="space-y-4">
                        {videoSources.length > 0 ? (
                            <>
                                {/* Direct Video Player */}
                                <div>
                                    <h5 className="font-medium text-sm mb-2">Direct Video Player:</h5>
                                    <div className="relative">
                                        {isLoading && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
                                                <div className="text-sm text-gray-600">Loading video...</div>
                                            </div>
                                        )}
                                        <video
                                            className="w-full max-w-md h-auto rounded border"
                                            controls
                                            poster={previewImage}
                                            onError={handleVideoError}
                                            onLoadedData={handleVideoLoad}
                                            onLoadStart={() => setIsLoading(true)}
                                        >
                                            {videoSources.map((source, index) => (
                                                <source
                                                    key={index}
                                                    src={source.url}
                                                    type={source.mimeType}
                                                />
                                            ))}
                                            Your browser does not support the video tag.
                                        </video>
                                        {videoError && (
                                            <div className="mt-2 text-red-600 text-sm">
                                                Error: {videoError}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Proxy Video Player */}
                                <div>
                                    <h5 className="font-medium text-sm mb-2">Proxy Video Player:</h5>
                                    <video
                                        className="w-full max-w-md h-auto rounded border"
                                        controls
                                        poster={previewImage}
                                    >
                                        {videoSources.map((source, index) => (
                                            <source
                                                key={index}
                                                src={`/api/video/proxy?url=${encodeURIComponent(source.url)}`}
                                                type={source.mimeType}
                                            />
                                        ))}
                                        Your browser does not support the video tag.
                                    </video>
                                </div>

                                {/* Test Links */}
                                <div>
                                    <h5 className="font-medium text-sm mb-2">Test Links:</h5>
                                    {videoSources.map((source, index) => (
                                        <div key={index} className="flex gap-2 items-center text-sm">
                                            <a
                                                href={source.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                Direct Link {index + 1}
                                            </a>
                                            <span>|</span>
                                            <a
                                                href={`/api/video/proxy?url=${encodeURIComponent(source.url)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-green-600 hover:underline"
                                            >
                                                Proxy Link {index + 1}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-gray-500 text-sm">
                                No video sources available for this video.
                            </div>
                        )}
                    </div>

                    {/* Preview Image */}
                    {previewImage && (
                        <div>
                            <h5 className="font-medium text-sm mb-2">Preview Image:</h5>
                            <div className="relative w-full max-w-md h-64">
                                <Image
                                    src={previewImage}
                                    alt={video.alt || 'Video preview'}
                                    fill
                                    className="object-cover rounded border"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Product Videos Test</h1>
                    <div className="flex items-center justify-center py-12">
                        <div className="text-lg text-gray-600">Loading products with videos...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Product Videos Test</h1>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <h2 className="text-red-800 font-medium mb-2">Error Loading Products</h2>
                        <p className="text-red-700">{error}</p>
                        <button
                            onClick={fetchProductsWithVideos}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Videos Test</h1>
                    <p className="text-gray-600">
                        Testing video playback for products. Found {products.length} products with videos.
                    </p>
                    <button
                        onClick={fetchProductsWithVideos}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Refresh Data
                    </button>
                </div>

                {products.length === 0 ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <h2 className="text-yellow-800 font-medium mb-2">No Videos Found</h2>
                        <p className="text-yellow-700">
                            No products with video media were found. This could mean:
                        </p>
                        <ul className="list-disc list-inside text-yellow-700 mt-2">
                            <li>Products don&apos;t have video media attached</li>
                            <li>Video media type is not being detected correctly</li>
                            <li>There&apos;s an issue with the GraphQL query</li>
                        </ul>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {products.map((product) => (
                            <div key={product.id} className="bg-white rounded-lg shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                    {product.title}
                                </h2>
                                <p className="text-gray-600 mb-6">Handle: {product.handle}</p>

                                <div className="space-y-6">
                                    {product.media.edges
                                        .filter(edge => edge.node.mediaContentType === 'VIDEO')
                                        .map((mediaEdge, index) => (
                                            <VideoPlayer
                                                key={`${product.id}-${index}`}
                                                video={mediaEdge.node}
                                                productTitle={product.title}
                                            />
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 