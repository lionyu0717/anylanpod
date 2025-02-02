import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');

    if (!keyword) {
      return NextResponse.json({ error: 'Keyword parameter is required' }, { status: 400 });
    }

    if (!API_URL) {
      return NextResponse.json({ error: 'API URL is not configured' }, { status: 500 });
    }

    const response = await fetch(
      `${API_URL}/api/check/${encodeURIComponent(keyword)}?timespan=1d`,
      {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Keyword check error response:', errorText);
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({
      keyword: data.keyword,
      timespan: data.timespan,
      found: data.found
    });

  } catch (error) {
    console.error('Check keyword API error:', error);
    return NextResponse.json(
      { error: 'Failed to check keyword' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 