'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Music, Star, MessageCircle, Share2, Play } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'

interface TrackDetail {
  id: string
  title: string
  artist: string
  album: string
  fileUrl: string
  albumArt?: string
  comments: any[]
  ratings: {
    average: number
    total: number
  }
}

export default function TrackPage() {
  const params = useParams()
  const trackId = params.id as string
  const [track, setTrack] = useState<TrackDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [rating, setRating] = useState(5)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadTrackDetails()
  }, [trackId])

  const loadTrackDetails = async () => {
    try {
      const res = await fetch(`/api/tracks/${trackId}`)
      if (res.ok) {
        const data = await res.json()
        setTrack(data.track)
      }
    } catch (error) {
      console.error('Error loading track:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!commentText.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch(`/api/tracks/${trackId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: commentText, rating })
      })

      if (res.ok) {
        setCommentText('')
        loadTrackDetails()
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Music className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!track) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Nyimzo haikupatikana</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Track Header */}
        <div className="bg-card rounded-3xl p-8 border border-border mb-8">
          <div className="flex gap-8">
            {/* Album Art */}
            <div className="w-48 h-48 rounded-2xl overflow-hidden bg-secondary flex-shrink-0">
              {track.albumArt ? (
                <Image
                  src={track.albumArt}
                  alt={track.title}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Music className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Track Info */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">{track.album}</p>
                <h1 className="text-4xl font-bold text-foreground mb-2">{track.title}</h1>
                <p className="text-lg text-muted-foreground mb-4">{track.artist}</p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(track.ratings.average)
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {track.ratings.average} ({track.ratings.total} ratings)
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <a href={track.fileUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button className="w-full rounded-full bg-primary">
                    <Play className="w-4 h-4 mr-2" />
                    Sikiliza Sasa
                  </Button>
                </a>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-card rounded-3xl p-8 border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            Hakikisho ({track.comments.length})
          </h2>

          {/* Add Comment */}
          <div className="mb-8 pb-8 border-b border-border">
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Tathmini
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(r => (
                  <button
                    key={r}
                    onClick={() => setRating(r)}
                    className="transition"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        r <= rating
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Andika hakikisho..."
              className="w-full p-4 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
              rows={3}
            />
            <Button
              onClick={handleAddComment}
              disabled={submitting || !commentText.trim()}
              className="mt-3 rounded-full"
            >
              {submitting ? 'Inatuma...' : 'Tuma Hakikisho'}
            </Button>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {track.comments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Hakuna hakikisho bado</p>
            ) : (
              track.comments.map(comment => (
                <div key={comment.id} className="bg-secondary/50 rounded-lg p-4 border border-border/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-foreground">User</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-foreground">{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}