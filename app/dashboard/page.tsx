'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Upload, LogOut, Music, Play, Trash2, Loader } from 'lucide-react'
import Image from 'next/image'

interface Track {
  id: string
  title: string
  album: string
  fileUrl: string
  uploadedAt: string
}

interface Artist {
  id: string
  name: string
  email: string
  artistName: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [tracks, setTracks] = useState<Track[]>([])
  const [uploading, setUploading] = useState(false)
  const [artist, setArtist] = useState<Artist | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const artistData = localStorage.getItem('artist')

    if (!token) {
      router.push('/auth/login')
      return
    }

    if (artistData) {
      setArtist(JSON.parse(artistData))
    }

    loadTracks(token)
  }, [router])

  const loadTracks = async (token: string) => {
    try {
      const res = await fetch('/api/tracks', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (res.ok) {
        const data = await res.json()
        setTracks(data.tracks || [])
      }
    } catch (error) {
      console.error('Error loading tracks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setUploading(true)

    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', file.name.replace(/\.[^/.]+$/, ''))
      formData.append('album', 'My Album')

      try {
        const token = localStorage.getItem('token')
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })

        if (res.ok) {
          const data = await res.json()
          setTracks([data.track, ...tracks])
        }
      } catch (error) {
        console.error('Upload failed:', error)
      }
    }

    setUploading(false)
    const input = e.target as HTMLInputElement
    input.value = ''
  }

  const handleDelete = async (trackId: string) => {
    if (!window.confirm('Taka kuondoa nyimzo hii?')) return

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/tracks/${trackId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (res.ok) {
        setTracks(tracks.filter(t => t.id !== trackId))
      }
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('artist')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">SoundWave</span>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="rounded-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Toka
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Karibu, {artist?.artistName}!
          </h1>
          <p className="text-muted-foreground">{artist?.email}</p>
        </div>

        {/* Upload Section */}
        <div className="bg-card rounded-2xl p-8 border border-border mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Pakua Nyimzo Mpya
          </h2>

          <label className="flex items-center justify-center w-full p-8 border-2 border-dashed border-primary/30 rounded-xl cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition">
            <input
              type="file"
              multiple
              accept="audio/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
            <div className="text-center">
              <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
              <p className="text-foreground font-semibold">
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    Inakipakia...
                  </span>
                ) : (
                  'Dondosha au bonyeza kupakia nyimzo'
                )}
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                MP3, WAV, FLAC, OGG
              </p>
            </div>
          </label>
        </div>

        {/* Tracks List */}
        <div className="bg-card rounded-2xl p-8 border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Nyimzo Zako ({tracks.length})
          </h2>

          {tracks.length === 0 ? (
            <div className="text-center py-12">
              <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg">
                Huna nyimzo iliyopakuwa bado
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                Pakua nyimzo yako ya kwanza kuanza
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition border border-border/40"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Music className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {track.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {track.album}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a href={track.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        title="Sikiliza"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    </a>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(track.id)}
                      title="Futa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}