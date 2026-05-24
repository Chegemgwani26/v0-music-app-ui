'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Music } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.isArtist) {
          router.push('/artist/dashboard');
        } else {
          router.push('/listener/discover');
        }
      } catch (error) {
        router.push('/auth');
      }
    } else {
      router.push('/auth');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="text-center">
        <Music className="w-16 h-16 text-purple-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-white mb-2">Music App</h1>
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
