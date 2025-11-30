// src/components/invitation/MusicPlayer.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Loader } from 'lucide-react'; // Ikon untuk kontrol volume

// GANTI DENGAN PATH FILE MUSIK ANDA!
// Contoh: tempatkan file .mp3 Anda di folder public, misalnya: /public/music/wedding-song.mp3
const MUSIC_FILE_PATH = "/music/aku memilihmu.mp3"; 

const MusicPlayer: React.FC = () => {
    // State untuk mengontrol pemutaran dan status loading
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [userInteracted, setUserInteracted] = useState(false); // Untuk memicu autoplay setelah interaksi

    // Ref untuk mengakses elemen audio di DOM
    const audioRef = useRef<HTMLAudioElement>(null);

    // Efek untuk menandai musik sudah dimuat
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.onloadeddata = () => {
                setIsLoaded(true);
            };
            // Pastikan audio selalu loop
            audio.loop = true; 
        }
    }, []);

    // Fungsi untuk memutar/menghentikan musik
    const togglePlay = () => {
        if (!isLoaded || !audioRef.current) return;

        const audio = audioRef.current;
        
        if (!userInteracted) {
             // Jika ini adalah interaksi pertama, coba play
            setUserInteracted(true);
        }

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            // Coba putar musik, tangani jika gagal karena batasan browser
            audio.play().then(() => {
                setIsPlaying(true);
            }).catch(error => {
                console.error("Autoplay failed:", error);
                // Biarkan isPlaying tetap false jika gagal play
            });
        }
    };
    
    // Icon yang ditampilkan
    const Icon = isPlaying ? Volume2 : VolumeX;

    return (
        <>
            {/* Elemen audio tersembunyi */}
            <audio ref={audioRef} src={MUSIC_FILE_PATH} preload="auto" loop />

            {/* Tombol floating di sudut kanan bawah */}
            <div className="fixed bottom-6 right-6 z-50 animate-fade-in" style={{ animationDelay: '1.5s' }}>
                <button
                    onClick={togglePlay}
                    // Styling tombol menggunakan design system (gold accent)
                    className={`
                        w-12 h-12 rounded-full elegant-shadow 
                        transition-all duration-300 flex items-center justify-center 
                        ${isPlaying ? 'bg-gold glow-gold' : 'bg-muted/70 hover:bg-muted'}
                        border-2 border-solid ${isPlaying ? 'border-gold' : 'border-gold/30'}
                    `}
                    disabled={!isLoaded}
                    aria-label={isPlaying ? "Pause Music" : "Play Music"}
                >
                    {!isLoaded ? (
                        <Loader className="w-5 h-5 animate-spin text-gold" />
                    ) : (
                        <Icon className={`w-5 h-5 ${isPlaying ? 'text-black-deep' : 'text-gold'}`} />
                    )}
                </button>
                
                {/* Text pop-up instruksi untuk interaksi pertama */}
                {!isPlaying && isLoaded && !userInteracted && (
                    <div className="absolute right-14 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-card border border-gold/30 text-xs text-foreground elegant-shadow whitespace-nowrap">
                        Ketuk untuk memulai musik
                    </div>
                )}
            </div>
        </>
    );
};

export default MusicPlayer;