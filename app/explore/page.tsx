'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Search, Music, Heart, MessageSquare, Star, BarChart3, LogOut } from 'lucide-react'
import Image from 'next/image'

interface Track {
  id: string
  title: string
  album: string
  fileUrl: string
  albumArt?: string
  artist: string
}

interface SearchResult extends Track {
  plays?: number
  rating?: number
}

export default function ExplorePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    setToken(storedToken)
  }, [])

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    setLoading(true)

    if (!query.trim()) {
      setResults([])
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data.results || [])
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = (trackId: string) => {
    setFavorites(prev =>
      prev.includes(trackId)
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    )
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('artist')
    router.push('/')
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
          {token && (
            <Button
              onClick={handleLogout}
              variant="outline"
              className="rounded-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Toka
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-6">Tafuta Nyimzo</h1>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Tafuta nyimzo, msanii, au album..."
              className="w-full pl-12 pr-4 py-3 bg-secondary border border-border rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Results */}
        {searchQuery && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {loading ? 'Inatafuta...' : `Matokeo (${results.length})`}
            </h2>

            {results.length === 0 && !loading && (
              <div className="text-center py-12">
                <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Hakuna matokeo ya tafuta</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map(track => (
                <div
                  key={track.id}
                  className="bg-card rounded-2xl p-6 border border-border/40 hover:border-primary/40 transition group"
                >
                  {/* Album Art */}
                  <div className="relative w-full aspect-square mb-4 rounded-xl overflow-hidden bg-secondary">
                    {track.albumArt ? (
                      <Image
                        src={track.albumArt}
                        alt={track.title}
                        fill
                        className="object-cover group-hover:scale-110 transition"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Music className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Track Info */}
                  <h3 className="font-bold text-foreground truncate">{track.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{track.artist || track.album}</p>

                  {/* Stats */}
                  <div className="flex gap-3 text-xs text-muted-foreground mt-3 mb-4">
                    {track.plays && (
                      <span className="flex items-center gap-1">
                        <BarChart3 className="w-3 h-3" />
                        {track.plays}
                      </span>
                    )}
                    {track.rating && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {track.rating}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <a href={track.fileUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full rounded-full">
                        Sikiliza
                      </Button>
                    </a>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={() => toggleFavorite(track.id)}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          favorites.includes(track.id)
                            ? 'text-primary fill-primary'
                            : 'text-muted-foreground'
                        }`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={() => router.push(`/track/${track.id}`)}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!searchQuery && (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-xl text-muted-foreground">Ingiza kitu ili tafuta nyimzo</p>
          </div>
        )}
      </div>
    </div>
  )
}