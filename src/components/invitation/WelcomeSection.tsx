import satinEmeraldBg from "@/assets/satin-emerald-bg.jpg"; // Path dipertahankan
import goldBokehOverlay from "@/assets/gold-bokeh-overlay.jpg"; // Path dipertahankan
import EditableText from "@/components/EditableText";
import useContent from "@/hooks/useContent"; // Import hook baru

const WelcomeSection = () => {
    // --- MENGAMBIL DATA DARI SUPABASE ---
    const { content, isLoading, updateContent } = useContent();

    // Nilai default jika data belum dimuat atau kosong
    const title = content.title || "Selamat Datang";
    const description = content.description || "Dengan penuh kebahagiaan dan kehormatan, kami mengundang Anda untuk berbagi momen istimewa bersama kami dalam perayaan yang penuh keajaiban dan keanggunan.";
    const quote = content.quote || "Setiap momen berharga dimulai dengan undangan untuk bersama";

    // Fungsi untuk menyimpan perubahan, kini memanggil updateContent
    const handleSave = (fieldName: string) => async (newContent: string) => {
        console.log(`[WELCOME SECTION] Memperbarui field ${fieldName} ke: ${newContent}`);
        await updateContent(fieldName, newContent);
    };
    
    // Tampilkan loading state jika data belum siap
    if (isLoading) {
        return (
            <section className="min-h-screen flex items-center justify-center bg-black">
                <p className="text-gold text-xl animate-pulse">Memuat Konten...</p>
            </section>
        );
    }

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
                        {/* onSave sekarang memanggil handleSave langsung dengan field name */}
                        <EditableText onSave={handleSave('title')} tagName="span">
                            {title}
                        </EditableText>
                    </h2>
                    <div className="h-1 w-32 bg-gold/50 mx-auto" />
                </div>
                
                <div className="text-xl md:text-2xl text-foreground/90 leading-relaxed max-w-2xl mx-auto">
                    {/* 2. EDITABLE TEXT: Deskripsi Sambutan */}
                    <EditableText onSave={handleSave('description')} tagName="span">
                        {description}
                    </EditableText>
                </div>
                
                <div className="text-lg md:text-xl text-gold/80 italic">
                    {/* 3. EDITABLE TEXT: Kutipan */}
                    <EditableText onSave={handleSave('quote')} tagName="span">
                        "{quote}"
                    </EditableText>
                </div>
                
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