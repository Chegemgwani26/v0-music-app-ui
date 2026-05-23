"use client"

import { useState } from "react"
import Image from "next/image"
import { 
  Play, 
  Pause, 
  Heart, 
  MoreHorizontal, 
  Shuffle, 
  ChevronLeft, 
  Share2,
  Crown,
  CheckCircle2,
  Home,
  Search,
  Library,
  SkipBack,
  SkipForward,
  Repeat,
  Volume2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Track {
  id: number
  title: string
  album: string
  albumCover: string
  plays: string
  duration: string
}

const tracks: Track[] = [
  {
    id: 1,
    title: "Midnight Dreams",
    album: "Eternal Echoes",
    albumCover: "/album-1.jpg",
    plays: "1,247,892,541",
    duration: "3:42"
  },
  {
    id: 2,
    title: "City Lights",
    album: "Urban Stories",
    albumCover: "/album-2.jpg",
    plays: "982,156,234",
    duration: "4:15"
  },
  {
    id: 3,
    title: "Electric Soul",
    album: "Neon Nights",
    albumCover: "/album-3.jpg",
    plays: "756,234,891",
    duration: "3:28"
  },
  {
    id: 4,
    title: "Golden Hour",
    album: "Sunset Boulevard",
    albumCover: "/album-4.jpg",
    plays: "634,521,789",
    duration: "4:02"
  },
  {
    id: 5,
    title: "Thunder",
    album: "Storm Season",
    albumCover: "/album-5.jpg",
    plays: "521,987,456",
    duration: "3:55"
  },
  {
    id: 6,
    title: "Neon Paradise",
    album: "Cyber Dreams",
    albumCover: "/album-6.jpg",
    plays: "445,678,923",
    duration: "3:51"
  },
  {
    id: 7,
    title: "Echoes of Tomorrow",
    album: "Future Vibes",
    albumCover: "/album-7.jpg",
    plays: "398,765,432",
    duration: "4:33"
  },
  {
    id: 8,
    title: "Crystalline",
    album: "Luminous Heart",
    albumCover: "/album-8.jpg",
    plays: "367,234,789",
    duration: "3:19"
  },
  {
    id: 9,
    title: "Midnight Run",
    album: "Nocturnal Tales",
    albumCover: "/album-9.jpg",
    plays: "312,456,678",
    duration: "4:08"
  },
  {
    id: 10,
    title: "Sonic Waves",
    album: "Frequency",
    albumCover: "/album-10.jpg",
    plays: "289,123,456",
    duration: "3:36"
  }
]

export function ArtistProfile() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [likedTracks, setLikedTracks] = useState<number[]>([1, 3])
  const [currentTrack, setCurrentTrack] = useState(tracks[0])
  const [isFollowing, setIsFollowing] = useState(false)
  const [progress, setProgress] = useState(35)

  const toggleLike = (id: number) => {
    setLikedTracks(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    )
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden max-w-md mx-auto">
      {/* Mobile Frame */}
      <div className="relative h-screen flex flex-col">
        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 pt-3 pb-2 bg-gradient-to-b from-black/60 to-transparent">
          <span className="text-xs font-medium text-foreground">9:41</span>
          <div className="flex items-center gap-1">
            <div className="flex gap-0.5">
              <div className="w-1 h-2.5 bg-foreground rounded-sm" />
              <div className="w-1 h-2.5 bg-foreground rounded-sm" />
              <div className="w-1 h-2.5 bg-foreground rounded-sm" />
              <div className="w-1 h-2.5 bg-foreground/40 rounded-sm" />
            </div>
            <span className="text-xs font-medium text-foreground ml-1">5G</span>
            <div className="ml-1 w-6 h-3 border border-foreground rounded-sm relative">
              <div className="absolute inset-0.5 right-1 bg-foreground rounded-[1px]" style={{ width: '70%' }} />
              <div className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-0.5 h-1.5 bg-foreground rounded-r-full" />
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-44">
          {/* Hero Banner */}
          <div className="relative h-80">
            <Image
              src="/artist-banner.jpg"
              alt="Marcus Cole"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background" />
            
            {/* Navigation */}
            <div className="absolute top-12 left-0 right-0 flex items-center justify-between px-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-foreground hover:bg-black/60"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-foreground hover:bg-black/60"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Artist Info */}
          <div className="relative px-5 -mt-16 pb-4">
            <div className="flex items-end gap-3">
              <h1 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-2">
                Marcus Cole
                <CheckCircle2 className="w-6 h-6 text-accent fill-accent stroke-background" />
              </h1>
            </div>
            
            <p className="text-muted-foreground text-sm mt-1">
              42.8M monthly listeners
            </p>

            {/* Premium Button */}
            <Button 
              className="mt-4 w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold py-5 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition[...]
            >
              <Crown className="w-5 h-5 mr-2" />
              Upgrade to Premium Artist
            </Button>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-5">
              <Button
                variant="outline"
                onClick={() => setIsFollowing(!isFollowing)}
                className={cn(
                  "flex-1 rounded-full border-2 font-semibold py-5 transition-all duration-300",
                  isFollowing 
                    ? "border-primary text-primary bg-primary/10" 
                    : "border-muted-foreground/50 text-foreground hover:border-foreground"
                )}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
              
              <Button
                size="icon"
                className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:scale-105 hover:shadow-primary/50 transition-all duration-300"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                <Shuffle className="w-6 h-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                <MoreHorizontal className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Top Tracks */}
          <div className="px-5 mt-2">
            <h2 className="text-xl font-bold text-foreground mb-4">Popular</h2>
            
            <div className="space-y-1">
              {tracks.map((track, index) => (
                <div
                  key={track.id}
                  className={cn(
                    "group flex items-center gap-3 p-2 rounded-xl transition-all duration-200 cursor-pointer",
                    currentTrack.id === track.id 
                      ? "bg-primary/15" 
                      : "hover:bg-secondary/80"
                  )}
                  onClick={() => {
                    setCurrentTrack(track)
                    setIsPlaying(true)
                  }}
                >
                  {/* Track Number / Play Indicator */}
                  <div className="w-7 flex items-center justify-center">
                    {currentTrack.id === track.id && isPlaying ? (
                      <div className="flex items-end gap-0.5 h-4">
                        <div className="w-1 bg-primary rounded-full animate-pulse" style={{ height: '60%', animationDelay: '0ms' }} />
                        <div className="w-1 bg-primary rounded-full animate-pulse" style={{ height: '100%', animationDelay: '150ms' }} />
                        <div className="w-1 bg-primary rounded-full animate-pulse" style={{ height: '40%', animationDelay: '300ms' }} />
                      </div>
                    ) : (
                      <span className={cn(
                        "text-sm font-medium",
                        currentTrack.id === track.id ? "text-primary" : "text-muted-foreground"
                      )}>
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Album Cover */}
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                    <Image
                      src={track.albumCover}
                      alt={track.album}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Play className="w-5 h-5 text-foreground fill-foreground" />
                    </div>
                  </div>

                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-medium text-sm truncate",
                      currentTrack.id === track.id ? "text-primary" : "text-foreground"
                    )}>
                      {track.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {track.plays} plays
                    </p>
                  </div>

                  {/* Duration & Like */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-medium">
                      {track.duration}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleLike(track.id)
                      }}
                    >
                      <Heart 
                        className={cn(
                          "w-4 h-4 transition-colors",
                          likedTracks.includes(track.id) 
                            ? "text-primary fill-primary" 
                            : "text-muted-foreground"
                        )} 
                      />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* See More Button */}
            <Button
              variant="ghost"
              className="w-full mt-4 text-muted-foreground hover:text-foreground font-medium"
            >
              See discography
            </Button>
          </div>
        </div>

        {/* Mini Player */}
        <div className="absolute bottom-16 left-2 right-2 z-40">
          <div className="bg-card/95 backdrop-blur-xl rounded-2xl p-3 shadow-2xl border border-border/50">
            {/* Progress Bar */}
            <div className="absolute top-0 left-4 right-4 h-0.5 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Album Art */}
              <div className="relative w-12 h-12 rounded-lg overflow-hidden shadow-md">
                <Image
                  src={currentTrack.albumCover}
                  alt={currentTrack.album}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">
                  {currentTrack.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  Marcus Cole
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-9 h-9 rounded-full text-muted-foreground hover:text-foreground"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  className="w-10 h-10 rounded-full bg-foreground text-background hover:bg-foreground/90"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-9 h-9 rounded-full text-muted-foreground hover:text-foreground"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 z-30">
          <div className="bg-background/80 backdrop-blur-2xl border-t border-border/30">
            <div className="flex items-center justify-around py-2 pb-6">
              <NavItem icon={Home} label="Home" active />
              <NavItem icon={Search} label="Search" />
              <NavItem icon={Library} label="Library" />
            </div>
          </div>
          {/* Home Indicator */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-foreground/30 rounded-full" />
        </div>
      </div>
    </div>
  )
}

function NavItem({ 
  icon: Icon, 
  label, 
  active = false 
}: { 
  icon: typeof Home
  label: string
  active?: boolean 
}) {
  return (
    <button className="flex flex-col items-center gap-1 px-6 py-1 transition-colors">
      <Icon 
        className={cn(
          "w-6 h-6 transition-colors",
          active ? "text-foreground" : "text-muted-foreground"
        )} 
      />
      <span className={cn(
        "text-[10px] font-medium transition-colors",
        active ? "text-foreground" : "text-muted-foreground"
      )}>
        {label}
      </span>
    </button>
  )
}
