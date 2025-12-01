// src/components/invitation/DressCodeSection.tsx (Versi Final Bebas Warning DOM)

import { useState } from "react";
import { Sparkles } from "lucide-react";
import satinBerryBg from "@/assets/satin-berry-bg.jpg";
import satinEmeraldBg from "@/assets/satin-emerald-bg.jpg";
import EditableText from "@/components/EditableText"; 
// ... (imports lainnya) ...

const initialDressCodes = [
    // ... (data dress code awal) ...
];

const DressCodeSection = () => {
    // --- STATE LOKAL (PLACEHOLDER DATA) ---
    const [sectionTitle, setSectionTitle] = useState("Dress Code");
    const [sectionSubtitle, setSectionSubtitle] = useState("Black Tie / Formal Evening Attire");
    const [additionalInfo, setAdditionalInfo] = useState("Kami mengundang Anda untuk tampil menawan dalam balutan busana formal terbaik Anda. Mari bersama-sama ciptakan suasana malam yang penuh keanggunan dan kemewahan.");
    const [dressCodeItems, setDressCodeItems] = useState(initialDressCodes);


    // Fungsi placeholder untuk menyimpan perubahan pada Judul/Subjudul Section
    const handleSectionTextSave = (setter: React.Dispatch<React.SetStateAction<string>>, fieldName: string) => (newContent: string) => {
        setter(newContent);
        console.log(`[DRESS CODE] Perubahan pada ${fieldName} disimpan: ${newContent}`);
        // Logic Nyata: updateSupabase('dress_code_main', { field: fieldName, content: newContent });
    };
    
    // Fungsi untuk menyimpan perubahan pada item dress code tertentu
    const handleItemSave = (index: number, field: 'title' | 'description') => (newContent: string) => {
        setDressCodeItems(prevItems => 
            prevItems.map((item, i) => 
                i === index ? { ...item, [field]: newContent } : item
            )
        );
        console.log(`[DRESS CODE] Item ${index} field ${field} diupdate.`);
        // Logic Nyata: updateSupabase('dress_code_items', { id: itemId, field: field, content: newContent });
    };


    return (
        <section className="relative py-24 overflow-hidden">
            {/* Backgrounds... */}
            <div className="absolute inset-0 flex">
                <div 
                    className="w-1/2 bg-cover bg-center opacity-20"
                    style={{ backgroundImage: `url(${satinBerryBg})` }}
                />
                <div 
                    className="w-1/2 bg-cover bg-center opacity-20"
                    style={{ backgroundImage: `url(${satinEmeraldBg})` }}
                />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
            
            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="text-center space-y-4 mb-16 animate-slide-up">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Sparkles className="w-8 h-8 text-gold" />
                        <h2 className="text-5xl md:text-6xl font-bold text-gold">
                            {/* 1. EDITABLE TEXT: Judul Utama */}
                            <EditableText onSave={handleSectionTextSave(setSectionTitle, 'title')} tagName="span">
                                {sectionTitle}
                            </EditableText>
                        </h2>
                        <Sparkles className="w-8 h-8 text-gold" />
                    </div>
                    <div className="h-1 w-32 bg-gold/50 mx-auto" />
                    
                    {/* PERBAIKAN DOM NESTING: Ganti <p> dengan <div> di Subjudul */}
                    <div className="text-xl text-foreground/70">
                        {/* 2. EDITABLE TEXT: Subjudul */}
                        <EditableText onSave={handleSectionTextSave(setSectionSubtitle, 'subtitle')} tagName="span">
                            {sectionSubtitle}
                        </EditableText>
                    </div>
                </div>
                
                {/* Dress Code Cards */}
                <div className="grid md:grid-cols-3 gap-8">
                    {dressCodeItems.map((item, index) => (
                        <div 
                            key={index}
                            className="group animate-fade-in"
                            style={{ animationDelay: `${index * 0.15}s` }}
                        >
                            <div className="relative overflow-hidden rounded-2xl border-4 border-gold/30 elegant-shadow group-hover:border-gold/60 transition-all duration-500">
                                {/* Placeholder Image with Gradient */}
                                <div className={`aspect-[3/4] ${item.bgClass} relative overflow-hidden`}>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Sparkles className="w-24 h-24 text-gold/30" />
                                    </div>
                                </div>
                                
                                {/* Card Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                                    <h3 className="text-2xl font-bold text-gold mb-2">
                                        {/* 3. EDITABLE TEXT: Judul Item */}
                                        <EditableText onSave={handleItemSave(index, 'title')} tagName="span">
                                            {item.title}
                                        </EditableText>
                                    </h3>
                                    
                                    {/* PERBAIKAN DOM NESTING: Ganti <p> dengan <div> di Deskripsi Item */}
                                    <div className="text-foreground/80">
                                        {/* 4. EDITABLE TEXT: Deskripsi Item */}
                                        <EditableText onSave={handleItemSave(index, 'description')} tagName="span">
                                            {item.description}
                                        </EditableText>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Additional Info */}
                <div className="mt-12 text-center">
                    {/* PERBAIKAN DOM NESTING: Ganti <p> dengan <div> di Informasi Tambahan */}
                    <div className="text-lg text-foreground/60 max-w-3xl mx-auto">
                        {/* 5. EDITABLE TEXT: Informasi Tambahan */}
                        <EditableText onSave={handleSectionTextSave(setAdditionalInfo, 'additionalInfo')} tagName="span">
                            {additionalInfo}
                        </EditableText>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DressCodeSection;