import { NextResponse } from 'next/server';

// Handle CORS preflight requests
export async function OPTIONS(request: Request) {
  console.log('🔧 OPTIONS called');
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Shopify-Storefront-Access-Token',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function POST(request: Request) {
  console.log('🔥 POST /api/shopify called');
  console.log('Request method:', request.method);
  console.log('Request URL:', request.url);
  
  try {
    const { query, variables } = await request.json();
    console.log('📦 Request body parsed successfully');
    console.log('Query length:', query?.length || 0);
    
    const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    console.log('🔑 Environment variables check:');
    console.log('Access token:', accessToken ? 'SET' : 'MISSING');

    if (!accessToken) {
      console.error('Missing SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variable');
      return NextResponse.json(
        { error: 'Store configuration error' },
        { status: 500 }
      );
    }

    // Hardcoded Shopify URL
    const shopifyUrl = 'https://mymessageclothing.myshopify.com/api/2025-04/graphql.json';
    console.log('Attempting to fetch from:', shopifyUrl);

    const response = await fetch(shopifyUrl, {
      method: 'POST',
      headers: {
        'X-Shopify-Storefront-Access-Token': accessToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Shopify API error response:', errorText);
      console.error('Response status:', response.status);
      console.error('Response headers:', Object.fromEntries(response.headers.entries()));
      
      return NextResponse.json(
        { error: `Shopify API error: ${response.status}` },
        { 
          status: response.status,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Shopify-Storefront-Access-Token',
          }
        }
      );
    }

    const result = await response.json();
    
    if (result.errors) {
      console.error('GraphQL Errors:', result.errors);
      return NextResponse.json(
        { error: result.errors[0].message },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Shopify-Storefront-Access-Token',
          }
        }
      );
    }

    // Add CORS headers to successful response
    return NextResponse.json(result, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Shopify-Storefront-Access-Token',
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Shopify-Storefront-Access-Token',
        }
      }
    );
  }
} 