import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Song from '@/lib/models/Song';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') as string;

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { message: 'Search query is required' },
        { status: 400 }
      );
    }

    const songs = await Song.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    })
      .populate('artist', 'username avatar')
      .limit(50);

    return NextResponse.json(
      {
        songs,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
