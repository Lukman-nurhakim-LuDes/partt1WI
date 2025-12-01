// src/components/invitation/PhotoStorySection.tsx

import React, { useState } from 'react'; 
import useFetchStories from '@/hooks/useFetchStories';
import { useAdmin } from '@/context/AdminContext'; 
import EditableText from "@/components/EditableText";
import { PlusCircle, Edit, X } from 'lucide-react';
import { Button } from '@/components/ui/button'; 
import UploadModal from "@/components/UploadModal"; 
import { useUploadPhoto } from '@/hooks/useUploadPhoto'; 

const PhotoStorySection = () => {
    const { stories, isLoading, error, updateStoryText, deleteStoryPhoto, refreshStories } = useFetchStories();
    const { isAdmin } = useAdmin(); 
    
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false); 
    const { uploadAndInsertPhoto } = useUploadPhoto('story'); 

    // Handler untuk menutup modal dan me-refresh data
    const handleUploadSuccess = () => {
        setIsUploadModalOpen(false);
        refreshStories(); 
    };
    
    const handleDelete = async (id: number, src: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus foto cerita ini? Tindakan ini tidak dapat dibatalkan.")) {
            return;
        }
        try {
            await deleteStoryPhoto(id, src);
            console.log("Foto berhasil dihapus!"); 
        } catch (error) {
            console.error("Gagal menghapus foto. Lihat konsol untuk detail.");
        }
    };

    if (isLoading) {
        return <section className="relative py-24 text-center text-foreground/70"><p>Memuat cerita kami...</p></section>;
    }
    if (error) {
        return <section className="relative py-24 text-center text-destructive"><p>Error saat memuat cerita: {error}</p></section>;
    }
    
    // PERBAIKAN KRITIS: Return untuk EMPTY STATE (Mengandung tombol upload)
    if (!stories || stories.length === 0) {
        return (
            <section className="relative py-24 text-center z-20">
                <p className="text-foreground/70 mb-4">Belum ada cerita foto yang tersedia.</p>
                {/* TOMBOL UPLOAD DI EMPTY STATE (Hanya jika Admin Mode) */}
                {isAdmin && (
                    <Button 
                        onClick={() => setIsUploadModalOpen(true)} 
                        className="mt-4 bg-gold hover:bg-gold/80 flex items-center mx-auto"
                    >
                        <PlusCircle className="w-5 h-5 mr-2" /> Tambah Cerita Baru
                    </Button>
                )}
                {isUploadModalOpen && (
                    <UploadModal 
                        onClose={() => setIsUploadModalOpen(false)} 
                        section="story" 
                        uploadFunction={uploadAndInsertPhoto} 
                        onUploadSuccess={handleUploadSuccess} 
                        onDataRefresh={refreshStories}
                    />
                )}
            </section>
        );
    }
    
    // --- Render Grid Foto Storytelling (Jika data ada) ---
    return (
        <section className="relative py-24 z-20">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Judul Section (Rata Tengah) */}
                <div className="flex flex-col items-center justify-center space-y-4 mb-16 animate-slide-up">
                    <h2 className="text-5xl md:text-6xl font-bold text-gold text-center font-['Playfair_Display']">
                        Kisah Perjalanan Kami
                    </h2>
                    <div className="h-1 w-32 bg-gold/50 mx-auto" />
                    {/* Tombol Tambah (Duplikat, untuk akses cepat saat list panjang) */}
                    {isAdmin && (
                        <Button onClick={() => setIsUploadModalOpen(true)} className="bg-gold hover:bg-gold/80 mt-4">
                            <PlusCircle className="w-5 h-5 mr-2" /> Tambah Cerita Baru
                        </Button>
                    )}
                </div>


                {/* Grid Foto Storytelling */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stories.map((story, index) => (
                        <div
                            key={story.id}
                            className="text-center animate-fade-in"
                            style={{ animationDelay: `${story.delay_number * 0.1}s` }}
                        >
                            <div className="relative overflow-hidden rounded-xl border border-gold/30 p-2 glow-gold elegant-shadow transition-transform duration-500 hover:scale-[1.03] mb-4">
                                <img src={story.src} alt={story.caption} className="w-full h-80 object-cover rounded-lg" />
                                
                                {isAdmin && (
                                    <>
                                        <button className="absolute top-4 right-4 bg-gold/90 text-black p-2 rounded-full z-10 hover:bg-gold">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(story.id, story.src)}
                                            className="absolute top-4 right-14 bg-destructive/90 text-white p-2 rounded-full z-10 hover:bg-red-700 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                            
                            {/* FIX DOM NESTING: Gunakan <div> sebagai parent untuk teks yang diedit */}
                            <div className="mb-1"> 
                                <h3 className="text-2xl font-semibold text-gold font-['Playfair_Display']">
                                    <EditableText onSave={(val) => updateStoryText(story.id, 'caption', val)} tagName="span">
                                        {story.caption}
                                    </EditableText>
                                </h3>
                            </div>
                            
                            {/* FIX DOM NESTING: Gunakan <div> sebagai parent untuk teks deskripsi */}
                            <div className="text-foreground/70 text-sm">
                                <EditableText onSave={(val) => updateStoryText(story.id, 'description', val)} tagName="span">
                                    {story.description}
                                </EditableText>
                            </div>
                        </div>
                    ))}
                </div>

                {/* MODAL UPLOAD BARU (Hanya ada di return utama jika sudah ada data) */}
                {isUploadModalOpen && (
                    <UploadModal 
                        onClose={() => setIsUploadModalOpen(false)} 
                        section="story" 
                        uploadFunction={uploadAndInsertPhoto} 
                        onUploadSuccess={handleUploadSuccess} 
                        onDataRefresh={refreshStories} // Meneruskan fungsi refresh
                    />
                )}
            </div>
        </section>
    );
};

export default PhotoStorySection;