import { NextRequest, NextResponse } from 'next/server';

// Use the correct domain we discovered from the redirect testing
const ADMIN_API_URL = 'https://world-elegant-kp.myshopify.com/admin/api/2024-10/graphql.json';
const ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

export async function POST(request: NextRequest) {
  try {
    if (!ADMIN_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'SHOPIFY_ADMIN_ACCESS_TOKEN environment variable is not set' },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    console.log('Admin GraphQL Query:', body.query);

    const response = await fetch(ADMIN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error('Shopify API Error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      
      return NextResponse.json(
        { error: `Shopify API error: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Log any GraphQL errors
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
    }
    
    // Log successful queries
    if (data.data) {
      console.log('GraphQL query successful, data keys:', Object.keys(data.data));
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'This endpoint only accepts POST requests' },
    { status: 405 }
  );
} 