import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

// Mock database
const tracks: any[] = []
const comments: any[] = []
const ratings: any[] = []

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

// GET - Get track details with comments and ratings
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const track = tracks.find(t => t.id === params.id)
    if (!track) {
      return NextResponse.json(
        { error: 'Nyimzo haikupatikana' },
        { status: 404 }
      )
    }

    const trackComments = comments.filter(c => c.trackId === params.id)
    const trackRatings = ratings.filter(r => r.trackId === params.id)
    const averageRating = trackRatings.length > 0
      ? (trackRatings.reduce((sum, r) => sum + r.rating, 0) / trackRatings.length).toFixed(1)
      : 0

    return NextResponse.json({
      track: {
        ...track,
        comments: trackComments,
        ratings: {
          average: averageRating,
          total: trackRatings.length
        }
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Haiwezi kupata track' },
      { status: 500 }
    )
  }
}

// POST - Add comment
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const decoded = verifyToken(req)
    const { text, rating } = await req.json()

    const track = tracks.find(t => t.id === params.id)
    if (!track) {
      return NextResponse.json(
        { error: 'Nyimzo haikupatikana' },
        { status: 404 }
      )
    }

    if (text) {
      const comment = {
        id: Date.now().toString(),
        trackId: params.id,
        userId: decoded?.artistId || 'anonymous',
        text,
        createdAt: new Date()
      }
      comments.push(comment)
    }

    if (rating && rating >= 1 && rating <= 5) {
      const existingRating = ratings.find(
        r => r.trackId === params.id && r.userId === (decoded?.artistId || 'anonymous')
      )

      if (existingRating) {
        existingRating.rating = rating
      } else {
        ratings.push({
          id: Date.now().toString(),
          trackId: params.id,
          userId: decoded?.artistId || 'anonymous',
          rating,
          createdAt: new Date()
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Kuongeza kumeshindwa' },
      { status: 500 }
    )
  }
}

// DELETE - Delete comment
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

    const { commentId } = await req.json()
    const commentIndex = comments.findIndex(
      c => c.id === commentId && c.userId === decoded.artistId
    )

    if (commentIndex === -1) {
      return NextResponse.json(
        { error: 'Hakikisho haikupatikana' },
        { status: 404 }
      )
    }

    comments.splice(commentIndex, 1)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Kuondoa kumeshindwa' },
      { status: 500 }
    )
  }
}