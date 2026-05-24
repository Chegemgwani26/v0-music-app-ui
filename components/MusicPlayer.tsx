'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MusicPlayerProps {
  audioUrl: string;
  title: string;
  artist: string;
  coverImage?: string;
  duration: number;
  onLike?: () => void;
  isLiked?: boolean;
}

export default function MusicPlayer({
  audioUrl,
  title,
  artist,
  coverImage,
  duration,
  onLike,
  isLiked = false,
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(100);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    if (!time) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = parseFloat(e.target.value);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume / 100;
    setVolume(newVolume);
  };

  return (
    <div className="w-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
      <audio ref={audioRef} src={audioUrl} />

      {/* Song Info */}
      <div className="flex items-center gap-4 mb-6">
        {coverImage && (
          <img
            src={coverImage}
            alt={title}
            className="w-20 h-20 rounded-lg object-cover shadow-lg"
          />
        )}
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-1">{title}</h3>
          <p className="text-purple-100">{artist}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleProgressChange}
          className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, white 0%, white ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) 100%)`,
          }}
        />
        <div className="flex justify-between text-sm mt-2 text-purple-100">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={togglePlay}
            className="bg-white text-purple-600 hover:bg-purple-100 rounded-full p-3"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-1" />
            )}
          </Button>

          <div className="flex items-center gap-2 w-32">
            <Volume2 className="w-5 h-5" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={onLike}
            variant="ghost"
            size="sm"
            className={isLiked ? 'text-red-400' : 'text-white hover:text-red-400'}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </div>
    </div>
  );
}
