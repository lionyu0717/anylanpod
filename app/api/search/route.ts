import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const body = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    if (!API_URL) {
      return NextResponse.json({ error: 'API URL is not configured' }, { status: 500 });
    }

    // Validate difficulty
    const difficulty = body.difficulty.toLowerCase();
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return NextResponse.json({ error: 'Invalid difficulty level' }, { status: 400 });
    }

    // Validate voice gender
    const voiceGender = body.voice_gender.toUpperCase();
    if (!['MALE', 'FEMALE', 'NEUTRAL'].includes(voiceGender)) {
      return NextResponse.json({ error: 'Invalid voice gender' }, { status: 400 });
    }

    // Validate language code format (e.g., en-US)
    if (!/^[a-z]{2}-[A-Z]{2}$/.test(body.language)) {
      return NextResponse.json({ error: 'Invalid language code format' }, { status: 400 });
    }

    // Clean up the query - remove 'OR' and use comma for the API
    const cleanQuery = query.replace(/\s+OR\s+/g, ',');

    const response = await fetch(
      `${API_URL}/api/script/${encodeURIComponent(cleanQuery)}?timespan=${body.timespan}&difficulty=${difficulty}&language=${body.language}&generate_tts=true&voice_name=${body.voice_name}&voice_gender=${voiceGender}`,
      {
        method: 'POST',
        headers: {
          'accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Search API error response:', errorText);
      throw new Error(`Failed to generate podcast: ${response.status}`);
    }

    const data = await response.json();

    // Return the API response directly without saving to database
    return NextResponse.json(data);

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate podcast' },
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