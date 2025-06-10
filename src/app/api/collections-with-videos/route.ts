import { NextRequest, NextResponse } from 'next/server';

// Use the correct domain we discovered from the redirect testing
const ADMIN_API_URL = 'https://world-elegant-kp.myshopify.com/admin/api/2024-10/graphql.json';
const ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

interface CollectionWithVideo {
  id: string;
  handle: string;
  title: string;
  description: string;
  firstProductVideo: {
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
  } | null;
}

export async function GET() {
  try {
    if (!ADMIN_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'SHOPIFY_ADMIN_ACCESS_TOKEN environment variable is not set' },
        { status: 500 }
      );
    }

    // First, get all collections
    const collectionsQuery = {
      query: `
        query {
          collections(first: 10) {
            edges {
              node {
                id
                handle
                title
                description
              }
            }
          }
        }
      `
    };

    const collectionsResponse = await fetch(ADMIN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
      },
      body: JSON.stringify(collectionsQuery),
    });

    if (!collectionsResponse.ok) {
      console.error('Collections fetch failed:', collectionsResponse.status, collectionsResponse.statusText);
      return NextResponse.json(
        { error: `Failed to fetch collections: ${collectionsResponse.status}` },
        { status: collectionsResponse.status }
      );
    }

    const collectionsData = await collectionsResponse.json() as any;
    
    if (collectionsData.errors) {
      console.error('Collections GraphQL errors:', collectionsData.errors);
      return NextResponse.json(
        { error: 'GraphQL errors', details: collectionsData.errors },
        { status: 400 }
      );
    }

    const collections = collectionsData.data?.collections?.edges || [];
    console.log(`Found ${collections.length} collections`);

    // For each collection, get the first product with videos
    const collectionsWithVideos: CollectionWithVideo[] = [];

    for (const collectionEdge of collections) {
      const collection = collectionEdge.node;
      
      // Get first product from this collection
      const productsQuery = {
        query: `
          query {
            collection(id: "${collection.id}") {
              products(first: 1) {
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
          }
        `
      };

      const productsResponse = await fetch(ADMIN_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
        },
        body: JSON.stringify(productsQuery),
      });

      if (productsResponse.ok) {
        const productsData = await productsResponse.json() as any;
        
        if (!productsData.errors && productsData.data?.collection?.products?.edges?.length > 0) {
          const firstProduct = productsData.data.collection.products.edges[0].node;
          
          // Find first video in product media
          let firstProductVideo = null;
          for (const mediaEdge of firstProduct.media.edges) {
            const media = mediaEdge.node;
            if (media.mediaContentType === 'VIDEO' && media.sources && media.sources.length > 0) {
              firstProductVideo = {
                sources: media.sources,
                preview: media.preview
              };
              console.log(`Found video for collection ${collection.title} from product ${firstProduct.title}`);
              break;
            }
          }

          collectionsWithVideos.push({
            id: collection.id,
            handle: collection.handle,
            title: collection.title,
            description: collection.description,
            firstProductVideo
          });
        } else {
          // Collection has no products or has errors
          collectionsWithVideos.push({
            id: collection.id,
            handle: collection.handle,
            title: collection.title,
            description: collection.description,
            firstProductVideo: null
          });
        }
      } else {
        console.error(`Failed to fetch products for collection ${collection.title}`);
        // Still add the collection without video
        collectionsWithVideos.push({
          id: collection.id,
          handle: collection.handle,
          title: collection.title,
          description: collection.description,
          firstProductVideo: null
        });
      }
    }

    console.log(`Processed ${collectionsWithVideos.length} collections, ${collectionsWithVideos.filter(c => c.firstProductVideo).length} have videos`);

    return NextResponse.json({
      collections: collectionsWithVideos
    });

  } catch (error) {
    console.error('Collections with videos API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 