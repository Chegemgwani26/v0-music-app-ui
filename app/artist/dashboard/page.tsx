'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Upload, Music } from 'lucide-react';

interface Song {
  _id: string;
  title: string;
  description: string;
  audioUrl: string;
  coverImage: string;
  duration: number;
  plays: number;
  likes: string[];
  artist: {
    _id: string;
    username: string;
    avatar: string;
  };
}

export default function ArtistDashboard() {
  const router = useRouter();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    audioUrl: '',
    coverImage: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth');
      return;
    }
    fetchArtistSongs();
  }, []);

  const fetchArtistSongs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/songs/upload?artistId=${token}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setSongs(data.songs || []);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const handleUploadSong = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('duration', formData.duration);
      formDataToSend.append('audioUrl', formData.audioUrl);
      formDataToSend.append('coverImage', formData.coverImage);

      const response = await fetch('/api/songs/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setSongs([data.song, ...songs]);
      setFormData({
        title: '',
        description: '',
        duration: '',
        audioUrl: '',
        coverImage: '',
      });
      setShowUploadForm(false);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">🎵 Artist Dashboard</h1>
            <p className="text-gray-400">Manage your music and followers</p>
          </div>
          <Button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Song
          </Button>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <Card className="mb-8 bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Upload New Song</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUploadSong} className="space-y-4">
                <div>
                  <Label htmlFor="title">Song Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter song title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your song"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration (seconds)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="180"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="audioUrl">Audio URL</Label>
                    <Input
                      id="audioUrl"
                      value={formData.audioUrl}
                      onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                      placeholder="https://example.com/audio.mp3"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="coverImage">Cover Image URL</Label>
                  <Input
                    id="coverImage"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://example.com/cover.jpg"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
                    {loading ? 'Uploading...' : 'Upload Song'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowUploadForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Songs List */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Your Songs</h2>
          {songs.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <p className="text-gray-400 text-center py-8">
                  <Music className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  No songs uploaded yet. Upload your first song!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {songs.map((song) => (
                <Card key={song._id} className="bg-slate-800 border-slate-700 hover:border-purple-500 transition">
                  {song.coverImage && (
                    <img
                      src={song.coverImage}
                      alt={song.title}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                  )}
                  <CardContent className="pt-4">
                    <h3 className="font-bold text-white mb-2 truncate">{song.title}</h3>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{song.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>▶ {song.plays} plays</span>
                      <span className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" /> {song.likes.length}
                      </span>
                    </div>
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
