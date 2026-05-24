'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Search, LogOut } from 'lucide-react';
import SongCard from '@/components/SongCard';
import MusicPlayer from '@/components/MusicPlayer';

interface Song {
  _id: string;
  title: string;
  description: string;
  audioUrl: string;
  coverImage?: string;
  duration: number;
  artist: {
    _id: string;
    username: string;
    avatar?: string;
  };
  plays: number;
  likes: string[];
}

export default function DiscoverPage() {
  const router = useRouter();
  const [songs, setSongs] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [likedSongs, setLikedSongs] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth');
      return;
    }

    // Extract user ID from token
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserId(payload.userId);
    } catch (error) {
      console.error('Error decoding token:', error);
    }

    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await fetch('/api/songs/discover');
      const data = await response.json();
      setSongs(data.songs || []);
      setFilteredSongs(data.songs || []);
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setFilteredSongs(songs);
      return;
    }

    const filtered = songs.filter(
      (song) =>
        song.title.toLowerCase().includes(value.toLowerCase()) ||
        song.artist.username.toLowerCase().includes(value.toLowerCase()) ||
        song.description.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSongs(filtered);
  };

  const handleLike = async (songId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/songs/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ songId }),
      });

      if (response.ok) {
        const newLikedSongs = [...likedSongs, songId];
        setLikedSongs(newLikedSongs);

        // Update songs to reflect like
        setSongs(
          songs.map((song) =>
            song._id === songId
              ? { ...song, likes: [...song.likes, userId] }
              : song
          )
        );
      }
    } catch (error) {
      console.error('Error liking song:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Music className="w-8 h-8 text-purple-500" />
            <h1 className="text-2xl font-bold text-white">Discover Music</h1>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search songs, artists..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Now Playing */}
        {selectedSong && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">🎧 Now Playing</h2>
            <MusicPlayer
              audioUrl={selectedSong.audioUrl}
              title={selectedSong.title}
              artist={selectedSong.artist.username}
              coverImage={selectedSong.coverImage}
              duration={selectedSong.duration}
              onLike={() => handleLike(selectedSong._id)}
              isLiked={likedSongs.includes(selectedSong._id)}
            />
          </div>
        )}

        {/* Songs Grid */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">🎵 All Songs</h2>
          {loading ? (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <p className="text-gray-400 text-center py-8">Loading songs...</p>
              </CardContent>
            </Card>
          ) : filteredSongs.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <p className="text-gray-400 text-center py-8">No songs found. Try a different search!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredSongs.map((song) => (
                <SongCard
                  key={song._id}
                  song={song}
                  onPlay={() => setSelectedSong(song)}
                  onLike={handleLike}
                  isLiked={likedSongs.includes(song._id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
