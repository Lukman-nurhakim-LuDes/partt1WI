import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
// Hapus import Play, Pause, Volume2. Mereka tidak digunakan lagi di sini.
import satinBerryBg from "@/assets/satin-berry-bg.jpg";
import goldBokehOverlay from "@/assets/gold-bokeh-overlay.jpg";

// Import custom hook yang mengelola state musik global
import useMusicPlayer from "@/hooks/useMusicPlayer"; // Sesuaikan path jika perlu

const Landing = () => {
  const navigate = useNavigate();
  // Ambil fungsi startMusic dari hook. Kita tidak butuh isPlaying atau togglePlay di halaman ini.
  const { startMusic } = useMusicPlayer(); 
  
  // Hapus state [isPlaying] dan [audio] yang lama karena sudah dipindahkan ke hook

  // Fungsi yang dipanggil saat tombol "Masuk" diklik
  const handleEnter = () => {
    // 1. Panggil startMusic() dari hook: ini yang menginisiasi musik (dianggap interaksi user)
    startMusic(); 
    // 2. Navigasi ke halaman utama undangan
    navigate("/invitation");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Satin Berry Background with Animation */}
      <div 
        className="absolute inset-0 bg-cover bg-center animate-parallax"
        style={{ backgroundImage: `url(${satinBerryBg})` }}
      />
      
      {/* Gold Bokeh Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen"
        style={{ backgroundImage: `url(${goldBokehOverlay})` }}
      />
      
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
      
      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="animate-fade-in space-y-8">
          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl font-bold text-gold drop-shadow-2xl tracking-wide">
            Malam Keajaiban
          </h1>
          
          {/* Subtitle */}
          <p className="text-2xl md:text-3xl text-foreground/90 font-light tracking-widest">
            THE MIRACLE NIGHT
          </p>
          
          {/* Event Details */}
          <div className="space-y-2 text-lg md:text-xl text-gold/80">
            <p>Sabtu, 15 Februari 2025</p>
            <p className="text-foreground/70">Grand Ballroom • Jakarta</p>
          </div>
          
          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-4 py-6">
            <div className="h-px w-20 bg-gold/50" />
            <div className="h-2 w-2 rotate-45 bg-gold/50" />
            <div className="h-px w-20 bg-gold/50" />
          </div>
          
          {/* CTA Button */}
          <Button
            onClick={handleEnter} // Pemicu musik dan navigasi
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-6 text-xl rounded-full glow-gold transition-all duration-500 hover:scale-105 elegant-shadow"
          >
            Masuk ke Undangan
          </Button>
        </div>
        
        {/* HILANGKAN TOMBOL MUSIC CONTROL DARI SINI */}
        {/* Tombol kontrol musik sekarang hanya ada di GlobalMusicControl.tsx */}
        
      </div>
      
      {/* Sparkle Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gold rounded-full animate-[sparkle_3s_ease-in-out_infinite]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Landing;