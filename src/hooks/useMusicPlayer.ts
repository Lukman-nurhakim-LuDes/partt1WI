// src/hooks/useMusicPlayer.ts (Versi Modifikasi)

import { useState, useEffect, useRef } from "react";

const MUSIC_PATH = "/music/aku memilihmu.mp3"; 

const useMusicPlayer = () => {
    const audioRef = useRef(new Audio(MUSIC_PATH));
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        audio.loop = true;
        
        const handlePause = () => setIsPlaying(false);
        audio.addEventListener('pause', handlePause);

        // Penting: Hapus audio.play() default di sini
        
        return () => {
            audio.pause();
            audio.removeEventListener('pause', handlePause);
        };
    }, []);

    const togglePlay = () => {
        const audio = audioRef.current;
        
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(error => {
                 console.error("Play failed:", error);
            });
        }
        setIsPlaying(prev => !prev);
    };

    // Fungsi ini akan dipanggil oleh komponen yang ingin MEMULAI musik (yaitu, Landing)
    const startMusic = () => {
        const audio = audioRef.current;
        if (!isPlaying) {
            audio.play().then(() => {
                setIsPlaying(true);
            }).catch(error => {
                console.error("Play failed:", error);
            });
        }
    };
    
    // Kita juga tambahkan status apakah musik sudah pernah distart (penting untuk GlobalMusicControl)
    const [hasStarted, setHasStarted] = useState(false);

    const startMusicAndTrack = () => {
        startMusic();
        setHasStarted(true);
    }
    
    return { 
        isPlaying, 
        togglePlay, 
        startMusic: startMusicAndTrack, // Gunakan fungsi baru
        hasStarted // Export status
    };
};

export default useMusicPlayer;