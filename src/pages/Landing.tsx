// src/pages/Landing.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import satinBerryBg from "@/assets/Bg-3.jpg";
import goldBokehOverlay from "@/assets/gold-bokeh-overlay.jpg";

// Import custom hooks
import useMusicPlayer from "@/hooks/useMusicPlayer";
import EditableText from "@/components/EditableText"; // Import komponen editing

const Landing = () => {
  const navigate = useNavigate();
  const { startMusic } = useMusicPlayer(); 

  // --- STATE UNTUK DATA EDITABLE ---
  const [mainTitle, setMainTitle] = useState("Lukman // Destry");
  const [subTitle, setSubTitle] = useState("THE MIRACLE MORNING");
  const [dateText, setDateText] = useState("Sabtu, 15 September 2026");
  const [venueText, setVenueText] = useState("Grand Ballroom • Jakarta");

  // Fungsi untuk menyimpan perubahan pada field spesifik
  const handleSave = (setter: React.Dispatch<React.SetStateAction<string>>, fieldName: string) => (newContent: string) => {
    setter(newContent);
    console.log(`[LANDING PAGE] Field ${fieldName} diupdate: ${newContent}`);
    // Logic Nyata: updateSupabase('landing_page', { field: fieldName, content: newContent });
  };
  
  // Fungsi yang dipanggil saat tombol "Masuk" diklik
  const handleEnter = () => {
    startMusic(); 
    navigate("/invitation");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Backgrounds... */}
      <div 
        className="absolute inset-0 bg-cover bg-center animate-parallax"
        style={{ backgroundImage: `url(${satinBerryBg})` }}
      />
      
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen"
        style={{ backgroundImage: `url(${goldBokehOverlay})` }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
      
      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="animate-fade-in space-y-8">
          
          {/* Main Title - PERBAIKAN PERATAAN */}
          <h1 className="text-6xl md:text-8xl font-bold text-gold drop-shadow-2xl tracking-wide w-full"> 
            {/* 1. EDITABLE TEXT: Judul Utama */}
            {/* Class 'block' dan 'w-full' memastikan EditableText memenuhi lebar penuh agar text-center berfungsi */}
            <EditableText onSave={handleSave(setMainTitle, 'mainTitle')} tagName="span" className="w-full block">
              {mainTitle}
            </EditableText>
          </h1>
          
          {/* Subtitle */}
          <p className="text-2xl md:text-3xl text-foreground/90 font-light tracking-widest">
            {/* 2. EDITABLE TEXT: Subjudul */}
            <EditableText onSave={handleSave(setSubTitle, 'subTitle')} tagName="span">
              {subTitle}
            </EditableText>
          </p>
          
          {/* Event Details */}
          <div className="space-y-2 text-lg md:text-xl text-gold/80">
            {/* FIX DOM NESTING: Ganti <p> dengan <div> */}
            <div> 
              {/* 3. EDITABLE TEXT: Tanggal */}
              <EditableText onSave={handleSave(setDateText, 'dateText')} tagName="span">
                {dateText}
              </EditableText>
            </div>
            {/* FIX DOM NESTING: Ganti <p> dengan <div> */}
            <div className="text-foreground/70">
              {/* 4. EDITABLE TEXT: Venue Singkat */}
              <EditableText onSave={handleSave(setVenueText, 'venueText')} tagName="span">
                {venueText}
              </EditableText>
            </div>
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