import { NextRequest, NextResponse } from 'next/server';

// Force dynamic behavior to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Use the correct domain we discovered from the redirect testing
const ADMIN_API_URL = 'https://world-elegant-kp.myshopify.com/admin/api/2024-10/graphql.json';
const ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

interface ProductVideo {
  id: string;
  alt?: string;
  mediaContentType: string;
  sources: Array<{
    url: string;
    mimeType: string;
    format: string;
    height: number;
    width: number;
  }>;
  preview?: {
    image?: {
      url: string;
    };
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { handle: string } }
) {
  try {
    if (!ADMIN_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'SHOPIFY_ADMIN_ACCESS_TOKEN environment variable is not set' },
        { status: 500 }
      );
    }

    const { handle } = params;
    console.log(`Fetching videos for product handle: ${handle}`);

    // Query to get product by handle and its video media
    const query = {
      query: `
        query {
          productByHandle(handle: "${handle}") {
            id
            title
            handle
            media(first: 20) {
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
      `
    };

    const response = await fetch(ADMIN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: JSON.stringify(query),
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('Admin API fetch failed:', response.status, response.statusText);
      return NextResponse.json(
        { error: `Failed to fetch product videos: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json() as any;
    
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return NextResponse.json(
        { error: 'GraphQL errors', details: data.errors },
        { status: 400 }
      );
    }

    const product = data.data?.productByHandle;
    
    if (!product) {
      console.log(`Product not found for handle: ${handle}`);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Extract video media
    const videos: ProductVideo[] = [];
    
    for (const mediaEdge of product.media.edges) {
      const media = mediaEdge.node;
      if (media.mediaContentType === 'VIDEO' && media.sources && media.sources.length > 0) {
        videos.push({
          id: media.id,
          alt: media.alt,
          mediaContentType: media.mediaContentType,
          sources: media.sources,
          preview: media.preview
        });
      }
    }

    console.log(`Found ${videos.length} videos for product ${product.title}`);
    
    if (videos.length > 0) {
      videos.forEach((video, index) => {
        console.log(`Video ${index + 1}:`);
        console.log(`  Sources: ${video.sources.length}`);
        video.sources.forEach((source, sourceIndex) => {
          console.log(`    Source ${sourceIndex + 1}: ${source.format} (${source.mimeType}) - ${source.width}x${source.height}`);
          console.log(`      URL: ${source.url}`);
        });
        if (video.preview?.image?.url) {
          console.log(`  Preview: ${video.preview.image.url}`);
        }
      });
    }

    const jsonResponse = NextResponse.json({
      productId: product.id,
      productTitle: product.title,
      productHandle: product.handle,
      videos: videos
    });

    // Add cache control headers to prevent any caching
    jsonResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    jsonResponse.headers.set('Pragma', 'no-cache');
    jsonResponse.headers.set('Expires', '0');
    
    return jsonResponse;

  } catch (error) {
    console.error('Product videos API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 