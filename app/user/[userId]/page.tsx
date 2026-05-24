'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, MapPin, Calendar, Music, LogOut, ArrowLeft } from 'lucide-react';
import MusicPlayer from '@/components/MusicPlayer';

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  bio: string;
  isArtist: boolean;
  followers: string[];
  following: string[];
  createdAt: string;
}

interface UserStats {
  user: UserProfile;
  songsCount: number;
  totalPlays: number;
  totalLikes: number;
}

export default function UserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setCurrentUserId(payload.userId);
    } catch (error) {
      console.error('Error decoding token:', error);
    }

    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      setUserStats(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ artistId: userId }),
      });

      if (response.ok) {
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error following:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/unfollow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ artistId: userId }),
      });

      if (response.ok) {
        setIsFollowing(false);
      }
    } catch (error) {
      console.error('Error unfollowing:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <p className="text-white">Loading profile...</p>
      </div>
    );
  }

  if (!userStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <p className="text-white">Profile not found</p>
      </div>
    );
  }

  const { user } = userStats;
  const isOwnProfile = currentUserId === userId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          {isOwnProfile && (
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Profile Card */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardContent className="pt-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar */}
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-32 h-32 rounded-full object-cover shadow-lg"
                />
              )}

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">{user.username}</h1>
                {user.bio && <p className="text-gray-400 mb-4">{user.bio}</p>}

                <div className="flex flex-wrap gap-4 mb-4 justify-center md:justify-start text-sm text-gray-400">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                  <span>
                    👥 {user.followers.length} followers
                  </span>
                  {user.isArtist && (
                    <span className="flex items-center">
                      <Music className="w-4 h-4 mr-1" />
                      {userStats.songsCount} songs
                    </span>
                  )}
                </div>

                {/* Follow Button */}
                {!isOwnProfile && (
                  <Button
                    onClick={isFollowing ? handleUnfollow : handleFollow}
                    className={isFollowing ? 'bg-gray-600 hover:bg-gray-700' : 'bg-purple-600 hover:bg-purple-700'}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        {user.isArtist && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-purple-600/20 border-purple-500/30">
              <CardContent className="pt-6">
                <p className="text-gray-400 text-sm">Songs Uploaded</p>
                <p className="text-3xl font-bold text-purple-400">{userStats.songsCount}</p>
              </CardContent>
            </Card>
            <Card className="bg-blue-600/20 border-blue-500/30">
              <CardContent className="pt-6">
                <p className="text-gray-400 text-sm">Total Plays</p>
                <p className="text-3xl font-bold text-blue-400">{userStats.totalPlays}</p>
              </CardContent>
            </Card>
            <Card className="bg-pink-600/20 border-pink-500/30">
              <CardContent className="pt-6">
                <p className="text-gray-400 text-sm">Total Likes</p>
                <p className="text-3xl font-bold text-pink-400">{userStats.totalLikes}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
