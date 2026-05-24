'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Search, LogOut, UserPlus, UserCheck } from 'lucide-react';

interface Artist {
  _id: string;
  username: string;
  avatar?: string;
  bio: string;
  isArtist: boolean;
  followers: string[];
}

export default function ArtistsPage() {
  const router = useRouter();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserId(payload.userId);
    } catch (error) {
      console.error('Error decoding token:', error);
    }

    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      // This would fetch all artists from your database
      // For now, we'll use a placeholder
      const response = await fetch('/api/users/artists');
      const data = await response.json();
      const artistsList = data.artists || [];
      setArtists(artistsList);
      setFilteredArtists(artistsList);
    } catch (error) {
      console.error('Error fetching artists:', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setFilteredArtists(artists);
      return;
    }

    const filtered = artists.filter(
      (artist) =>
        artist.username.toLowerCase().includes(value.toLowerCase()) ||
        artist.bio.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredArtists(filtered);
  };

  const handleFollow = async (artistId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ artistId }),
      });

      if (response.ok) {
        setFollowingIds([...followingIds, artistId]);
      }
    } catch (error) {
      console.error('Error following artist:', error);
    }
  };

  const handleUnfollow = async (artistId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/unfollow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ artistId }),
      });

      if (response.ok) {
        setFollowingIds(followingIds.filter((id) => id !== artistId));
      }
    } catch (error) {
      console.error('Error unfollowing artist:', error);
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
            <Users className="w-8 h-8 text-purple-500" />
            <h1 className="text-2xl font-bold text-white">Browse Artists</h1>
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
              placeholder="Search artists..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Artists Grid */}
        <div>
          {loading ? (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <p className="text-gray-400 text-center py-8">Loading artists...</p>
              </CardContent>
            </Card>
          ) : filteredArtists.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <p className="text-gray-400 text-center py-8">No artists found. Try a different search!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredArtists.map((artist) => (
                <Card key={artist._id} className="bg-slate-800 border-slate-700 hover:border-purple-500 transition">
                  <CardContent className="pt-6">
                    {/* Avatar */}
                    {artist.avatar && (
                      <img
                        src={artist.avatar}
                        alt={artist.username}
                        className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                      />
                    )}

                    {/* Name */}
                    <h3 className="text-lg font-bold text-white text-center mb-2">{artist.username}</h3>

                    {/* Bio */}
                    <p className="text-sm text-gray-400 text-center mb-4 line-clamp-3">{artist.bio}</p>

                    {/* Followers */}
                    <p className="text-xs text-gray-500 text-center mb-4">
                      👥 {artist.followers.length} followers
                    </p>

                    {/* Follow Button */}
                    <Button
                      onClick={() =>
                        followingIds.includes(artist._id)
                          ? handleUnfollow(artist._id)
                          : handleFollow(artist._id)
                      }
                      className={`w-full ${
                        followingIds.includes(artist._id)
                          ? 'bg-gray-600 hover:bg-gray-700'
                          : 'bg-purple-600 hover:bg-purple-700'
                      }`}
                    >
                      {followingIds.includes(artist._id) ? (
                        <>
                          <UserCheck className="w-4 h-4 mr-2" />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Follow
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
