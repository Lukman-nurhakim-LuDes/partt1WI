import React, { useState } from 'react'; 
import useFetchStories from '@/hooks/useFetchStories';
import { useAdmin } from '@/context/AdminContext'; 
import EditableText from "@/components/EditableText";
import { PlusCircle, Edit, X } from 'lucide-react'; // Import X
import { Button } from '@/components/ui/button'; 
import UploadModal from "@/components/UploadModal"; 
import { useUploadPhoto } from '@/hooks/useUploadPhoto'; 

const PhotoStorySection = () => {
    // PERBAIKAN: Tambahkan refreshStories dari hook
    const { stories, isLoading, error, updateStoryText, deleteStoryPhoto, refreshStories } = useFetchStories();
    const { isAdmin } = useAdmin(); 
    
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false); 
    const { uploadAndInsertPhoto } = useUploadPhoto('story'); 

    // PERBAIKAN: handleUploadSuccess hanya menutup modal dan MENGANDALKAN refreshStories (yang dipanggil di UploadModal)
    const handleUploadSuccess = () => {
        setIsUploadModalOpen(false);
    };
    
    const handleDelete = async (id: number, src: string) => {
        // PERBAIKAN: Mengganti window.confirm dan alert()
        if (!confirm("Apakah Anda yakin ingin menghapus foto cerita ini?")) {
            console.log("Penghapusan dibatalkan.");
            return;
        }
        try {
            await deleteStoryPhoto(id, src);
            refreshStories(); // Pastikan data di-refresh setelah penghapusan
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
    if (!stories || stories.length === 0) {
        return <section className="relative py-24 text-center text-foreground/70"><p>Belum ada cerita foto yang tersedia.</p></section>;
    }


    return (
        <section className="relative py-24 z-20">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* ... (Judul dan Tombol Tambah Cerita) ... */}

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
                                
                                {/* Tombol Edit/Upload Foto (Hanya jika Admin Mode) */}
                                {isAdmin && (
                                    <>
                                        <button className="absolute top-4 right-4 bg-gold text-black p-2 rounded-full z-10">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        {/* TOMBOL HAPUS BARU */}
                                        <button 
                                            onClick={() => handleDelete(story.id, story.src)}
                                            className="absolute top-4 right-14 bg-destructive text-white p-2 rounded-full z-10 hover:bg-red-700"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                            
                            {/* PERBAIKAN: Gunakan <div> untuk membungkus teks yang dapat diedit */}
                            <div className="mb-1"> 
                                <h3 className="text-2xl font-semibold text-gold font-['Playfair_Display']">
                                    <EditableText onSave={(val) => updateStoryText(story.id, 'caption', val)} tagName="span">
                                        {story.caption}
                                    </EditableText>
                                </h3>
                            </div>
                            
                            {/* PERBAIKAN: Gunakan <div> untuk membungkus teks deskripsi */}
                            <div className="text-foreground/70 text-sm">
                                <EditableText onSave={(val) => updateStoryText(story.id, 'description', val)} tagName="span">
                                    {story.description}
                                </EditableText>
                            </div>
                        </div>
                    ))}
                </div>

                {/* MODAL UPLOAD BARU */}
                {isUploadModalOpen && (
                    // PERBAIKAN: Meneruskan prop onDataRefresh ke UploadModal
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