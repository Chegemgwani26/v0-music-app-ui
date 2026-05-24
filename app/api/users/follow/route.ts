import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
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
    const { artistId } = await request.json();

    if (!artistId) {
      return NextResponse.json(
        { message: 'Artist ID is required' },
        { status: 400 }
      );
    }

    const userId = payload.userId as string;

    // Check if already following
    const user = await User.findById(userId);
    if (user.following.includes(artistId)) {
      return NextResponse.json(
        { message: 'Already following this artist' },
        { status: 400 }
      );
    }

    // Add artist to following list
    await User.findByIdAndUpdate(
      userId,
      { $push: { following: artistId } }
    );

    // Add user to artist's followers
    await User.findByIdAndUpdate(
      artistId,
      { $push: { followers: userId } }
    );

    return NextResponse.json(
      { message: 'Successfully followed artist' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Follow error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
