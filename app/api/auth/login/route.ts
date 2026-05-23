import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

// Mock database - replace with MongoDB in production
const artists: any[] = []

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Tafadhali jaza barua pepe na nenosiri' },
        { status: 400 }
      )
    }

    // Find artist
    const artist = artists.find(a => a.email === email)
    if (!artist) {
      return NextResponse.json(
        { error: 'Barua pepe au nenosiri si sahihi' },
        { status: 401 }
      )
    }

    // Check password
    const isPasswordValid = await bcryptjs.compare(password, artist.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Barua pepe au nenosiri si sahihi' },
        { status: 401 }
      )
    }

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
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Kuingia kumeshindwa' },
      { status: 500 }
    )
  }
}