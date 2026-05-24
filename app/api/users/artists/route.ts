import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const artists = await User.find({ isArtist: true })
      .select('username avatar bio followers')
      .sort({ followers: -1 })
      .limit(100);

    return NextResponse.json(
      {
        artists,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch artists error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
