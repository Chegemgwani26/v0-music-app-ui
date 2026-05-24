'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, Settings, Home, Users, Music } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  isArtist?: boolean;
}

export default function Navbar({ isArtist }: NavbarProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const navItems = isArtist
    ? [
        { label: '🏠 Dashboard', href: '/artist/dashboard' },
        { label: '⚙️ Settings', href: '/settings' },
      ]
    : [
        { label: '🎧 Discover', href: '/listener/discover' },
        { label: '👥 Artists', href: '/listener/artists' },
        { label: '⚙️ Settings', href: '/settings' },
      ];

  return (
    <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Button
          onClick={() => router.push('/')}
          variant="ghost"
          className="text-purple-500 hover:text-purple-400 text-lg font-bold"
        >
          <Music className="w-6 h-6 mr-2" />
          Music App
        </Button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {navItems.map((item) => (
            <Button
              key={item.href}
              onClick={() => router.push(item.href)}
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              {item.label}
            </Button>
          ))}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Button
            onClick={() => setShowMenu(!showMenu)}
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu Items */}
      {showMenu && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700 p-4 space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.href}
              onClick={() => {
                router.push(item.href);
                setShowMenu(false);
              }}
              variant="ghost"
              className="w-full justify-start text-gray-400 hover:text-white"
            >
              {item.label}
            </Button>
          ))}
        </div>
      )}
    </nav>
  );
}
