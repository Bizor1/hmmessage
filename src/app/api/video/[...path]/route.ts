import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Get the original URL from query parameters
    const { searchParams } = new URL(request.url);
    const originalUrl = searchParams.get('url');
    
    let videoUrl: string;
    
    if (originalUrl) {
      // Use the original URL directly
      videoUrl = originalUrl;
    } else {
      // Fallback: construct URL from path
      const videoPath = params.path.join('/');
      
      // Check if the path already contains the full domain
      if (videoPath.includes('shopifycdn.com') || videoPath.includes('cdn.shopify.com') || videoPath.includes('mymessageclo.com')) {
        videoUrl = videoPath.startsWith('http') ? videoPath : `https://${videoPath}`;
      } else {
        // Default to your custom domain
        videoUrl = `https://www.mymessageclo.com/${videoPath}`;
      }
    }

    console.log('Proxying video from:', videoUrl);

    const response = await fetch(videoUrl, {
      headers: {
        'User-Agent': 'MyMessage-Clothing-App/1.0',
        'Accept': 'video/mp4,video/*,*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'public, max-age=3600',
      },
    });

    if (!response.ok) {
      console.error('Video fetch failed:', response.status, response.statusText);
      return new NextResponse('Video not found', { status: 404 });
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