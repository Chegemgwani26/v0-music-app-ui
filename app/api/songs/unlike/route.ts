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

    const userId = payload.userId as string;
    const song = await Song.findById(songId);

    if (!song) {
      return NextResponse.json(
        { message: 'Song not found' },
        { status: 404 }
      );
    }

    // Check if already unliked
    if (!song.likes.includes(userId)) {
      return NextResponse.json(
        { message: 'You have not liked this song' },
        { status: 400 }
      );
    }

    // Remove like
    await Song.findByIdAndUpdate(
      songId,
      { $pull: { likes: userId } }
    );

    return NextResponse.json(
      { message: 'Song unliked successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unlike error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
