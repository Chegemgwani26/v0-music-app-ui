import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Song from '@/lib/models/Song';

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    await connectDB();
    const { userId } = params;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    let userStats = {
      user,
      songsCount: 0,
      totalPlays: 0,
      totalLikes: 0,
    };

    if (user.isArtist) {
      const songs = await Song.find({ artist: userId });
      userStats.songsCount = songs.length;
      userStats.totalPlays = songs.reduce((sum, song) => sum + song.plays, 0);
      userStats.totalLikes = songs.reduce((sum, song) => sum + song.likes.length, 0);
    }

    return NextResponse.json(userStats, { status: 200 });
  } catch (error) {
    console.error('Fetch user stats error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
