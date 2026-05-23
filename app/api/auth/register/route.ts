import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

// Mock database - replace with MongoDB in production
const artists: any[] = []

export async function POST(req: NextRequest) {
  try {
    const { name, email, artistName, password } = await req.json()

    // Validate input
    if (!name || !email || !artistName || !password) {
      return NextResponse.json(
        { error: 'Tafadhali jaza sehemu zote' },
        { status: 400 }
      )
    }

    // Check if artist exists
    const existingArtist = artists.find(a => a.email === email)
    if (existingArtist) {
      return NextResponse.json(
        { error: 'Email hii tayari imetumika' },
        { status: 400 }
      )
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    // Create artist
    const artist = {
      id: Date.now().toString(),
      name,
      email,
      artistName,
      password: hashedPassword,
      createdAt: new Date()
    }

    artists.push(artist)

    // Create token
    const token = jwt.sign(
      { artistId: artist.id, email: artist.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    )

    return NextResponse.json({
      token,
      artist: {
        id: artist.id,
        name: artist.name,
        email: artist.email,
        artistName: artist.artistName
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Usajili umeshindwa' },
      { status: 500 }
    )
  }
}