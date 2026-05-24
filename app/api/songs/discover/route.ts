import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Song from '@/lib/models/Song';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const songs = await Song.find({}).sort({ plays: -1 }).limit(50).populate('artist', 'username avatar');

    return NextResponse.json(
      {
        songs,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Discover error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
