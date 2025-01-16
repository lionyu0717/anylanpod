import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(
  request: Request,
  { params }: { params: { keyword: string } }
) {
  try {
    const keyword = params.keyword;

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
    return NextResponse.json(data);

  } catch (error) {
    console.error('Check keyword API error:', error);
    return NextResponse.json(
      { error: 'Failed to check keyword' },
      { status: 500 }
    );
  }
} 