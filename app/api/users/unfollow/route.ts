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

    // Remove artist from following list
    await User.findByIdAndUpdate(
      userId,
      { $pull: { following: artistId } }
    );

    // Remove user from artist's followers
    await User.findByIdAndUpdate(
      artistId,
      { $pull: { followers: userId } }
    );

    return NextResponse.json(
      { message: 'Successfully unfollowed artist' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unfollow error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
