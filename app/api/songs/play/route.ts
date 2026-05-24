import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Song from '@/lib/models/Song';
import { verifyRequestToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const payload = await verifyRequestToken(request);
    if (!payload) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const { songId } = await request.json();

    if (!songId) {
      return NextResponse.json(
        { message: 'Song ID is required' },
        { status: 400 }
      );
    }

    // Increment play count
    await Song.findByIdAndUpdate(
      songId,
      { $inc: { plays: 1 } }
    );

    return NextResponse.json(
      { message: 'Play count incremented' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Play error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
