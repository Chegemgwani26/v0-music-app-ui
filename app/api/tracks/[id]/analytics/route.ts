import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

// Mock database
const tracks: any[] = []
const analytics: any[] = []

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

// GET - Get analytics for a track
export async function GET(
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

    const track = tracks.find(t => t.id === params.id && t.artistId === decoded.artistId)
    if (!track) {
      return NextResponse.json(
        { error: 'Nyimzo haikupatikana' },
        { status: 404 }
      )
    }

    const trackAnalytics = analytics.filter(a => a.trackId === params.id)
    const totalPlays = trackAnalytics.length
    const totalListeners = new Set(trackAnalytics.map(a => a.userId)).size
    const avgDuration = trackAnalytics.length > 0
      ? (trackAnalytics.reduce((sum, a) => sum + (a.duration || 0), 0) / trackAnalytics.length).toFixed(2)
      : 0

    // Group by date
    const playsByDate: any = {}
    trackAnalytics.forEach(a => {
      const date = new Date(a.playedAt).toISOString().split('T')[0]
      playsByDate[date] = (playsByDate[date] || 0) + 1
    })

    return NextResponse.json({
      analytics: {
        trackId: params.id,
        totalPlays,
        totalListeners,
        avgDuration,
        playsByDate: Object.entries(playsByDate).map(([date, plays]) => ({
          date,
          plays
        }))
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Haiwezi kupata analytics' },
      { status: 500 }
    )
  }
}

// POST - Record a play event
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { duration, userId } = await req.json()

    const playEvent = {
      id: Date.now().toString(),
      trackId: params.id,
      userId: userId || 'anonymous',
      duration: duration || 0,
      playedAt: new Date()
    }

    analytics.push(playEvent)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Kurekodi kumeshindwa' },
      { status: 500 }
    )
  }
}