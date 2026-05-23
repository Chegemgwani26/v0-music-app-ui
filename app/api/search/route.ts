import { NextRequest, NextResponse } from 'next/server'

// Mock database
const tracks: any[] = []

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')?.toLowerCase() || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 20

    let results = tracks

    if (query) {
      results = tracks.filter(t => 
        t.title.toLowerCase().includes(query) ||
        t.album.toLowerCase().includes(query) ||
        t.artist?.toLowerCase().includes(query)
      )
    }

    const total = results.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const paginatedResults = results.slice(start, start + limit)

    return NextResponse.json({
      results: paginatedResults,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Kutafuta kumeshindwa' },
      { status: 500 }
    )
  }
}