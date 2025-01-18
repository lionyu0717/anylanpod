import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');

    if (!keyword) {
      return NextResponse.json({ error: 'Keyword parameter is required' }, { status: 400 });
    }

    const db = getDb();
    const result = await db.query(
      `SELECT id, keyword, created_at 
       FROM tts_records 
       WHERE keyword ILIKE $1 
       ORDER BY created_at DESC 
       LIMIT 5`,
      [`%${keyword}%`]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Search keywords error:', error);
    return NextResponse.json(
      { error: 'Failed to search keywords' },
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