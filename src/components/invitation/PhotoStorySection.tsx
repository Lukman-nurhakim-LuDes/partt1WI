// src/components/invitation/PhotoStorySection.tsx

import React, { useState } from 'react'; 
import useFetchStories from '@/hooks/useFetchStories';
import { useAdmin } from '@/context/AdminContext'; 
import EditableText from "@/components/EditableText";
import { PlusCircle, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button'; 
import UploadModal from "@/components/UploadModal"; // Import modal

// Import hook upload baru
import { useUploadPhoto } from '@/hooks/useUploadPhoto'; 

const PhotoStorySection = () => {
    const { stories, isLoading, error, updateStoryText } = useFetchStories();
    const { isAdmin } = useAdmin(); 
    
    // STATE BARU: Kontrol untuk Modal Upload
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false); 
    
    // Gunakan hook upload untuk Storytelling
    const { uploadAndInsertPhoto } = useUploadPhoto('story'); // SECTION: 'story'

    // FUNGSI UNTUK REFRESH DATA SETELAH UPLOAD
    const handleUploadSuccess = () => {
        setIsUploadModalOpen(false);
        // Solusi sementara: refresh halaman agar data baru terambil
        window.location.reload(); 
    };
    
    // ... (Logika Loading, Error, No Stories check tetap sama) ...
    if (isLoading) {
        return <section className="relative py-24 text-center text-foreground/70"><p>Memuat cerita kami...</p></section>;
    }
    if (error) {
        return <section className="relative py-24 text-center text-destructive"><p>Error saat memuat cerita: {error}</p></section>;
    }
    if (!stories || stories.length === 0) {
        return <section className="relative py-24 text-center text-foreground/70"><p>Belum ada cerita foto yang tersedia.</p></section>;
    }


    return (
        <section className="relative py-24 z-20">
            <div className="max-w-7xl mx-auto px-6">
                
                <div className="text-center space-y-4 mb-16 animate-slide-up">
                    <h2 className="text-5xl md:text-6xl font-bold text-gold">
                        <EditableText onSave={(val) => console.log('Update Judul Utama: ', val)} tagName="span">
                            Our Story
                        </EditableText>
                    </h2>
                    <div className="h-1 w-32 bg-gold/50 mx-auto" />
                    <p className="text-lg text-foreground/70">
                        Perjalanan Cinta Kami
                    </p>
                    
                    {/* TOMBOL TAMBAH CERITA (Hanya jika Admin Mode) */}
                    {isAdmin && (
                        <Button 
                            onClick={() => setIsUploadModalOpen(true)} // Membuka modal
                            className="mt-4 bg-gold text-black hover:bg-gold/90 flex items-center mx-auto"
                        >
                            <PlusCircle className="w-4 h-4 mr-2" /> Tambah Cerita Baru
                        </Button>
                    )}
                </div>

                {/* Grid Foto Storytelling */}
                {/* ... (JSX iterasi foto tetap sama) ... */}
                
                {stories.map((story, index) => (
                    <div
                        key={story.id}
                        className="text-center animate-fade-in"
                        style={{ animationDelay: `${story.delay_number * 0.1}s` }}
                    >
                        <div className="relative overflow-hidden rounded-xl border border-gold/30 p-2 glow-gold elegant-shadow transition-transform duration-500 hover:scale-[1.03] mb-4">
                            <img
                                src={story.src}
                                alt={story.caption}
                                className="w-full h-80 object-cover rounded-lg"
                            />
                            
                            {/* Tombol Edit/Upload Foto (Hanya jika Admin Mode) */}
                            {isAdmin && (
                                <button className="absolute top-4 right-4 bg-gold text-black p-2 rounded-full z-10">
                                    <Edit className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        
                        {/* Caption */}
                        <h3 className="text-2xl font-semibold text-gold mb-1 font-['Playfair_Display']">
                            <EditableText 
                                onSave={(val) => updateStoryText(story.id, 'caption', val)} 
                                tagName="span"
                            >
                                {story.caption}
                            </EditableText>
                        </h3>
                        
                        {/* Deskripsi */}
                        <p className="text-foreground/70 text-sm">
                            <EditableText 
                                onSave={(val) => updateStoryText(story.id, 'description', val)} 
                                tagName="span"
                            >
                                {story.description}
                            </EditableText>
                        </p>
                    </div>
                ))}
                {/* ... (Akhir iterasi) ... */}

                {/* MODAL UPLOAD BARU (Muncul di sini) */}
                {isUploadModalOpen && (
                    <UploadModal 
                        onClose={() => setIsUploadModalOpen(false)} 
                        section="story" 
                        uploadFunction={uploadAndInsertPhoto} 
                        onUploadSuccess={handleUploadSuccess}
                    />
                )}
            </div>
        </section>
    );
};

export default PhotoStorySection;