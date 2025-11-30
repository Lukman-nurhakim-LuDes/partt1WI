// src/components/invitation/WelcomeSection.tsx (Versi Diperbarui)

import { useState } from "react"; // Tambahkan useState
import satinEmeraldBg from "@/assets/satin-emerald-bg.jpg";
import goldBokehOverlay from "@/assets/gold-bokeh-overlay.jpg";
import EditableText from "@/components/EditableText"; // Import komponen editing

const WelcomeSection = () => {
    // --- STATE UNTUK DATA EDITABLE ---
    const [title, setTitle] = useState("Selamat Datang");
    const [description, setDescription] = useState("Dengan penuh kebahagiaan dan kehormatan, kami mengundang Anda untuk berbagi momen istimewa bersama kami dalam perayaan yang penuh keajaiban dan keanggunan.");
    const [quote, setQuote] = useState("Setiap momen berharga dimulai dengan undangan untuk bersama");

    // Fungsi untuk menyimpan perubahan pada field spesifik
    const handleSave = (setter: React.Dispatch<React.SetStateAction<string>>, fieldName: string) => (newContent: string) => {
        setter(newContent);
        console.log(`[WELCOME SECTION] Field ${fieldName} diupdate: ${newContent}`);
        // Logic Nyata: updateSupabase('welcome_section', { field: fieldName, content: newContent });
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Backgrounds... (Tetap sama) */}
            <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${satinEmeraldBg})` }}
            />
            
            <div 
                className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen"
                style={{ backgroundImage: `url(${goldBokehOverlay})` }}
            />
            
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
            
            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8 animate-fade-in">
                <div className="space-y-4">
                    <h2 className="text-5xl md:text-7xl font-bold text-gold">
                        {/* 1. EDITABLE TEXT: Judul Utama */}
                        <EditableText onSave={handleSave(setTitle, 'title')} tagName="span">
                            {title}
                        </EditableText>
                    </h2>
                    <div className="h-1 w-32 bg-gold/50 mx-auto" />
                </div>
                
                <p className="text-xl md:text-2xl text-foreground/90 leading-relaxed max-w-2xl mx-auto">
                    {/* 2. EDITABLE TEXT: Deskripsi Sambutan */}
                    <EditableText onSave={handleSave(setDescription, 'description')} tagName="span">
                        {description}
                    </EditableText>
                </p>
                
                <p className="text-lg md:text-xl text-gold/80 italic">
                    {/* 3. EDITABLE TEXT: Kutipan */}
                    <EditableText onSave={handleSave(setQuote, 'quote')} tagName="span">
                        "{quote}"
                    </EditableText>
                </p>
                
                {/* Decorative Elements */}
                <div className="flex items-center justify-center gap-4 pt-8">
                    <div className="h-px w-24 bg-gold/50" />
                    <div className="h-3 w-3 rotate-45 bg-gold/50" />
                    <div className="h-px w-24 bg-gold/50" />
                </div>
            </div>
        </section>
    );
};

export default WelcomeSection;