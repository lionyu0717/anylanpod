import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_SEARCH_API_URL;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    if (!API_URL) {
      return NextResponse.json({ error: 'API URL is not configured' }, { status: 500 });
    }

    const response = await fetch(`${API_URL}/search?query=${encodeURIComponent(query)}`);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
} 