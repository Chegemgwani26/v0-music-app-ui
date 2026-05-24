'use client';

import { Heart, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Song {
  _id: string;
  title: string;
  description: string;
  audioUrl: string;
  coverImage?: string;
  artist: {
    _id: string;
    username: string;
    avatar?: string;
  };
  plays: number;
  likes: string[];
}

interface SongCardProps {
  song: Song;
  onPlay?: (song: Song) => void;
  onLike?: (songId: string) => void;
  isLiked?: boolean;
}

export default function SongCard({ song, onPlay, onLike, isLiked = false }: SongCardProps) {
  return (
    <Card className="bg-slate-800 border-slate-700 hover:border-purple-500 transition group overflow-hidden">
      <div className="relative">
        {song.coverImage && (
          <img
            src={song.coverImage}
            alt={song.title}
            className="w-full h-48 object-cover group-hover:brightness-75 transition"
          />
        )}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <Button
            onClick={() => onPlay?.(song)}
            className="bg-purple-600 hover:bg-purple-700 rounded-full p-4"
          >
            <Play className="w-6 h-6 fill-current" />
          </Button>
        </div>
      </div>

      <CardContent className="pt-4">
        {/* Artist Avatar & Info */}
        <div className="flex items-center gap-2 mb-3">
          {song.artist.avatar && (
            <img
              src={song.artist.avatar}
              alt={song.artist.username}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <span className="text-xs text-gray-400">{song.artist.username}</span>
        </div>

        {/* Song Title */}
        <h3 className="font-bold text-white mb-1 truncate text-sm">{song.title}</h3>

        {/* Description */}
        <p className="text-xs text-gray-400 mb-3 line-clamp-2">{song.description}</p>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-400 border-t border-slate-700 pt-2">
          <span>▶️ {song.plays} plays</span>
          <Button
            onClick={() => onLike?.(song._id)}
            variant="ghost"
            size="sm"
            className="p-0 h-auto"
          >
            <Heart
              className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`}
            />
            <span className="ml-1">{song.likes.length}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
