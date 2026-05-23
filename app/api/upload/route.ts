import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

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

export async function POST(req: NextRequest) {
  try {
    // Verify token
    const decoded = verifyToken(req)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Karibu ingia' },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const album = formData.get('album') as string

    if (!file) {
      return NextResponse.json(
        { error: 'Hakuna faili' },
        { status: 400 }
      )
    }

    // Create uploads directory
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = `${Date.now()}-${file.name}`
    const filepath = join(uploadsDir, filename)

    await writeFile(filepath, buffer)

    // Create track
    const track = {
      id: Date.now().toString(),
      artistId: decoded.artistId,
      title: title || file.name.replace(/\.[^/.]+$/, ''),
      album: album || 'My Album',
      fileUrl: `/uploads/${filename}`,
      uploadedAt: new Date(),
      plays: 0
    }

    tracks.push(track)

    return NextResponse.json({
      success: true,
      track: {
        id: track.id,
        title: track.title,
        album: track.album,
        fileUrl: track.fileUrl,
        uploadedAt: track.uploadedAt
      }
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Kupakia kumeshindwa' },
      { status: 500 }
    )
  }
}