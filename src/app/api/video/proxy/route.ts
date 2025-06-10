import { NextRequest, NextResponse } from 'next/server';

// This route needs to be dynamic since it processes query parameters
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const videoUrl = request.nextUrl.searchParams.get('url');
    
    if (!videoUrl) {
      return new NextResponse('URL parameter is required', { status: 400 });
    }

    console.log('Proxying video from:', videoUrl);

    const response = await fetch(videoUrl, {
      headers: {
        'User-Agent': 'MyMessage-Clothing-App/1.0',
        'Accept': 'video/mp4,video/*,*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'public, max-age=3600',
        'Referer': 'https://www.mymessageclo.com',
        'Origin': 'https://www.mymessageclo.com',
      },
    });

    if (!response.ok) {
      console.error('Video fetch failed:', response.status, response.statusText);
      console.error('Failed URL:', videoUrl);
      return new NextResponse(`Video not found: ${response.status} ${response.statusText}`, { 
        status: response.status 
      });
    }

    const videoBuffer = await response.arrayBuffer();
    
    return new NextResponse(videoBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'video/mp4',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
        'Content-Length': videoBuffer.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error('Video proxy error:', error);
    return new NextResponse('Failed to fetch video', { status: 500 });
  }
} 