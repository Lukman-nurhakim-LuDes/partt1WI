// src/components/invitation/GlobalMusicControl.tsx (Versi Modifikasi)

import React from 'react';
import useMusicPlayer from '@/hooks/useMusicPlayer'; // Sesuaikan path
import { Play, Pause } from 'lucide-react';
import { useLocation } from 'react-router-dom'; // Untuk mengetahui rute saat ini

const GlobalMusicControl: React.FC = () => {
    const { isPlaying, togglePlay, hasStarted } = useMusicPlayer();
    const location = useLocation(); // Hook untuk mengetahui path saat ini

    // Kontrol hanya muncul jika:
    // 1. Kita berada di halaman /invitation, ATAU
    // 2. Musik sudah pernah distart (hanya untuk jaga-jaga)
    const shouldRenderControl = location.pathname === '/invitation' || hasStarted; 

    if (!shouldRenderControl) {
        return null; 
    }

    return (
        <button
            onClick={togglePlay}
            // Tailwind Styling: Sesuai dengan desain Anda
            className="fixed bottom-8 right-8 p-4 bg-gold/20 backdrop-blur-sm rounded-full border border-gold/30 hover:bg-gold/30 transition-all duration-300 glow-gold z-50"
            aria-label="Toggle music"
        >
            {isPlaying ? (
                <Pause className="w-6 h-6 text-gold" />
            ) : (
                <Play className="w-6 h-6 text-gold" />
            )}
        </button>
    );
};

export default GlobalMusicControl;