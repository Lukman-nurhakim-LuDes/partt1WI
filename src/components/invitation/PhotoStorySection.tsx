// src/components/invitation/PhotoStorySection.tsx (Versi Final dengan Inline Editing)

import React from 'react';
import useFetchStories from '@/hooks/useFetchStories';
import { useAdmin } from '@/context/AdminContext'; // Import useAdmin
import EditableText from '@/components/EditableText'; // Import komponen editing
import { Edit } from 'lucide-react'; // Gunakan icon Edit/Upload jika perlu

const PhotoStorySection = () => {
    // Ambil data dan fungsi update dari hook
    const { stories, isLoading, error, updateStoryText } = useFetchStories();
    const { isAdmin } = useAdmin(); 

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
                
                {/* Judul Bagian (Contoh Edit Judul Section) */}
                <div className="text-center space-y-4 mb-16 animate-slide-up">
                    <h2 className="text-5xl md:text-6xl font-bold text-gold">
                        {/* GANTI Judul Section dengan EditableText */}
                        <EditableText onSave={(val) => console.log('Update Judul Utama: ', val)} tagName="span">
                            Our Story
                        </EditableText>
                    </h2>
                    <div className="h-1 w-32 bg-gold/50 mx-auto" />
                    <p className="text-lg text-foreground/70">
                        <EditableText onSave={(val) => console.log('Update Subjudul: ', val)} tagName="span">
                            Perjalanan Cinta Kami
                        </EditableText>
                    </p>
                </div>

                {/* Grid Foto Storytelling */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stories.map((story, index) => (
                        <div
                            key={story.id}
                            className="text-center animate-fade-in"
                            style={{ animationDelay: `${story.delay}s` }}
                        >
                            <div className="relative overflow-hidden rounded-xl border border-gold/30 p-2 glow-gold elegant-shadow transition-transform duration-500 hover:scale-[1.03] mb-4">
                                <img src={story.src} alt={story.caption} className="w-full h-80 object-cover rounded-lg" />
                                
                                {/* Tombol Edit/Upload Foto (Hanya jika Admin Mode) */}
                                {isAdmin && (
                                    <button className="absolute top-4 right-4 bg-gold text-black p-2 rounded-full z-10">
                                        {/* Di sini akan ada modal atau logic upload foto ke Supabase Storage */}
                                        <Edit className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            
                            {/* GANTI CAPTION DENGAN EDITABLETEXT */}
                            <h3 className="text-2xl font-semibold text-gold mb-1 font-['Playfair_Display']">
                                <EditableText 
                                    onSave={(val) => updateStoryText(story.id, 'caption', val)} 
                                    tagName="span"
                                >
                                    {story.caption}
                                </EditableText>
                            </h3>
                            
                            {/* GANTI DESKRIPSI DENGAN EDITABLETEXT */}
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
                </div>
            </div>
        </section>
    );
};

export default PhotoStorySection;