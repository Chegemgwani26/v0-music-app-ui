import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

// Mock database
const tracks: any[] = []

function verifyToken(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.slice(7)
  try {
    return jwt.verify(token, JWT_SECRET) as any
  } catch (error) {
    return null
  }
}

export async function GET(req: NextRequest) {
  try {
    // Verify token
    const decoded = verifyToken(req)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Karibu ingia' },
        { status: 401 }
      )
    }

    // Get artist's tracks
    const artistTracks = tracks.filter(t => t.artistId === decoded.artistId)

    return NextResponse.json({
      tracks: artistTracks.sort((a, b) => 
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      )
    })
  } catch (error) {
    console.error('Get tracks error:', error)
    return NextResponse.json(
      { error: 'Haiwezi kupata nyimzo' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const decoded = verifyToken(req)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Karibu ingia' },
        { status: 401 }
      )
    }

    const trackIndex = tracks.findIndex(
      t => t.id === params.id && t.artistId === decoded.artistId
    )

    if (trackIndex === -1) {
      return NextResponse.json(
        { error: 'Nyimzo haikupatikana' },
        { status: 404 }
      )
    }

    tracks.splice(trackIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete track error:', error)
    return NextResponse.json(
      { error: 'Kuondoa kumeshindwa' },
      { status: 500 }
    )
  }
}