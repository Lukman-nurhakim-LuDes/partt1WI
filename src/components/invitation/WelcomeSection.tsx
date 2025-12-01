// src/components/invitation/WelcomeSection.tsx

import { useState, useEffect } from "react"; 
import satinEmeraldBg from "@/assets/satin-emerald-bg.jpg"; 
import goldBokehOverlay from "@/assets/gold-bokeh-overlay.jpg"; 
import EditableText from "@/components/EditableText";
import useContent from "@/hooks/useContent";

// Nilai default... (sama)

const DEFAULT_TITLE = "Selamat Datang";
const DEFAULT_DESCRIPTION = "Dengan penuh kebahagiaan dan kehormatan, kami mengundang Anda untuk berbagi momen istimewa bersama kami dalam perayaan yang penuh keajaiban dan keanggunan.";
const DEFAULT_QUOTE = "Setiap momen berharga dimulai dengan undangan untuk bersama";


const WelcomeSection = () => {
    // --- MENGAMBIL DATA DARI SUPABASE ---
    const { content, isLoading, updateContent } = useContent('welcome');

    const title = content.title || DEFAULT_TITLE;
    const description = content.description || DEFAULT_DESCRIPTION;
    const quote = content.quote || DEFAULT_QUOTE;

    const handleSave = (fieldName: string) => async (newContent: string) => {
        await updateContent(fieldName, newContent);
    };
    
    if (isLoading) {
        return (
            <section className="min-h-screen flex items-center justify-center bg-black">
                <p className="text-gold text-xl animate-pulse">Memuat Konten...</p>
            </section>
        );
    }

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Backgrounds... (Sama) */}
            <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${satinEmeraldBg})` }}
            />
            
            <div 
                className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen"
                style={{ backgroundImage: `url(${goldBokehOverlay})` }}
            />
            
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
            
            {/* Content (DIPERBAIKI) */}
            {/* Ganti px-6 dengan px-4 di mobile. Jarak atas/bawah (py) juga disesuaikan. */}
            <div className="relative z-10 max-w-4xl mx-auto px-4 py-10 md:px-6 text-center space-y-6 md:space-y-8 animate-fade-in">
                <div className="space-y-3 md:space-y-4">
                    {/* Judul Utama: Dikecilkan di mobile (text-4xl) */}
                    <h2 className="text-4xl md:text-7xl font-bold text-gold">
                        <EditableText onSave={handleSave('title')} tagName="span">
                            {title}
                        </EditableText>
                    </h2>
                    <div className="h-1 w-24 md:w-32 bg-gold/50 mx-auto" />
                </div>
                
                {/* Deskripsi Sambutan: Dikecilkan di mobile (text-base/lg) */}
                <div className="text-base md:text-2xl text-foreground/90 leading-relaxed max-w-2xl mx-auto">
                    <EditableText onSave={handleSave('description')} tagName="span">
                        {description}
                    </EditableText>
                </div>
                
                {/* Kutipan: Dikecilkan di mobile (text-sm) */}
                <div className="text-sm md:text-xl text-gold/80 italic">
                    <EditableText onSave={handleSave('quote')} tagName="span">
                        "{quote}"
                    </EditableText>
                </div>
                
                {/* Decorative Elements: Padding atas dikecilkan */}
                <div className="flex items-center justify-center gap-4 pt-4 md:pt-8">
                    <div className="h-px w-16 md:w-24 bg-gold/50" />
                    <div className="h-3 w-3 rotate-45 bg-gold/50" />
                    <div className="h-px w-16 md:w-24 bg-gold/50" />
                </div>
            </div>
        </section>
    );
};

export default WelcomeSection;