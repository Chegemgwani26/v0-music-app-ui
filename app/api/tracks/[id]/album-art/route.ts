import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import sharp from 'sharp'

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

export async function POST(
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

    const formData = await req.formData()
    const file = formData.get('albumArt') as File

    if (!file) {
      return NextResponse.json(
        { error: 'Hakuna picha' },
        { status: 400 }
      )
    }

    // Validate image
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Faili lazima liwe picha' },
        { status: 400 }
      )
    }

    // Create albums directory
    const albumsDir = join(process.cwd(), 'public', 'albums')
    if (!existsSync(albumsDir)) {
      await mkdir(albumsDir, { recursive: true })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = `${params.id}-${Date.now()}.jpg`
    const filepath = join(albumsDir, filename)

    // Optimize image with sharp
    await sharp(buffer)
      .resize(500, 500, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toFile(filepath)

    track.albumArt = `/albums/${filename}`

    return NextResponse.json({
      success: true,
      albumArt: track.albumArt
    })
  } catch (error) {
    console.error('Album art upload error:', error)
    return NextResponse.json(
      { error: 'Kupakia picha kumeshindwa' },
      { status: 500 }
    )
  }
}