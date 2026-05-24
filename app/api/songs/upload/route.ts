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

    if (!payload.isArtist) {
      return NextResponse.json(
        { message: 'Only artists can upload songs' },
        { status: 403 }
      );
    }

    await connectDB();
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const duration = parseInt(formData.get('duration') as string);
    const audioUrl = formData.get('audioUrl') as string; // URL from storage service
    const coverImage = formData.get('coverImage') as string; // URL from storage service

    if (!title || !duration || !audioUrl) {
      return NextResponse.json(
        { message: 'Title, duration, and audio URL are required' },
        { status: 400 }
      );
    }

    const newSong = new Song({
      title,
      artist: payload.userId,
      description: description || '',
      audioUrl,
      coverImage: coverImage || null,
      duration,
      plays: 0,
      likes: [],
    });

    await newSong.save();

    return NextResponse.json(
      {
        message: 'Song uploaded successfully',
        song: newSong,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const artistId = searchParams.get('artistId');

    if (!artistId) {
      return NextResponse.json(
        { message: 'Artist ID is required' },
        { status: 400 }
      );
    }

    const songs = await Song.find({ artist: artistId }).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        songs,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
