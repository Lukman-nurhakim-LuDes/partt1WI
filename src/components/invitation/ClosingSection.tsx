// src/components/invitation/ClosingSection.tsx (Versi Diperbarui)

import { useState } from "react"; // Tambahkan useState
import { Button } from "@/components/ui/button";
import { ArrowUp, Heart } from "lucide-react";
import satinBerryBg from "@/assets/satin-berry-bg.jpg";
import goldBokehOverlay from "@/assets/gold-bokeh-overlay.jpg";
import EditableText from "@/components/EditableText"; // Import komponen editing

const ClosingSection = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  // --- Data yang akan diedit (Gunakan state lokal sebagai placeholder) ---
  const [title, setTitle] = useState("Sampai Bertemu");
  const [quote, setQuote] = useState("Di malam penuh keajaiban!");
  const [closingText, setClosingText] = useState("Kehadiran dan doa restu Anda adalah kebahagiaan terbesar bagi kami. Mari bersama-sama ciptakan malam yang tak terlupakan.");
  const [footerText, setFooterText] = useState("© 2025 Malam Keajaiban. All rights reserved.");
  
  // Fungsi placeholder untuk menyimpan ke database (Ganti dengan logic Supabase Anda)
  const handleSave = (setter: React.Dispatch<React.SetStateAction<string>>, fieldName: string) => (newContent: string) => {
      // 1. Update state lokal
      setter(newContent);
      
      // 2. Logic Nyata: Panggil fungsi Supabase Update di sini
      console.log(`[CLOSING SECTION] Perubahan pada ${fieldName} disimpan: ${newContent}`);
      // Contoh: updateSupabase('closing_section', { field: fieldName, content: newContent });
  };


  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Backgrounds... (Tetap sama) */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${satinBerryBg})` }}
      />
      
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen"
        style={{ backgroundImage: `url(${goldBokehOverlay})` }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8 animate-fade-in">
        <Heart className="w-16 h-16 text-gold mx-auto" />
        
        <div className="space-y-4">
          <h2 className="text-5xl md:text-7xl font-bold text-gold">
            {/* 1. EDITABLE TEXT: Judul Utama */}
            <EditableText onSave={handleSave(setTitle, 'title')} tagName="span">
                {title}
            </EditableText>
          </h2>
          <div className="h-1 w-32 bg-gold/50 mx-auto" />
        </div>
        
        <p className="text-2xl md:text-3xl text-foreground/90 italic">
            {/* 2. EDITABLE TEXT: Kutipan */}
            <EditableText onSave={handleSave(setQuote, 'quote')} tagName="span">
                "{quote}"
            </EditableText>
        </p>
        
        <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            {/* 3. EDITABLE TEXT: Deskripsi Penutup */}
            <EditableText onSave={handleSave(setClosingText, 'closingText')} tagName="span">
                {closingText}
            </EditableText>
        </p>
        
        {/* Decorative Elements */}
        <div className="flex items-center justify-center gap-4 py-8">
          <div className="h-px w-24 bg-gold/50" />
          <div className="h-3 w-3 rotate-45 bg-gold/50" />
          <div className="h-px w-24 bg-gold/50" />
        </div>
        
        {/* Scroll to Top Button (Tetap statis) */}
        <Button
          onClick={scrollToTop}
          variant="outline"
          className="border-gold/50 text-gold hover:bg-gold/20 hover:border-gold px-8 py-6 text-lg rounded-full glow-gold transition-all duration-300"
        >
          <ArrowUp className="w-5 h-5 mr-2" />
          Kembali ke Atas
        </Button>
        
        {/* Footer */}
        <div className="pt-12 text-sm text-foreground/50">
            {/* 4. EDITABLE TEXT: Footer */}
            <EditableText onSave={handleSave(setFooterText, 'footerText')} tagName="p">
                {footerText}
            </EditableText>
        </div>
      </div>
    </section>
  );
};

export default ClosingSection;