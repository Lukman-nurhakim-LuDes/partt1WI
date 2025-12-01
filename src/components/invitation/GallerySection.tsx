// src/components/invitation/GallerySection.tsx

import React, { useState } from "react";
import { X, PlusCircle } from "lucide-react";
// Import type-safe hook (menggunakan string ID/UUID)
import useFetchGallery, { PhotoId, Photo } from "@/hooks/useFetchGallery"; 
import { useAdmin } from "@/context/AdminContext"; 
import { useUploadPhoto } from "@/hooks/useUploadPhoto";
import UploadModal from "@/components/UploadModal"; 
import Lightbox from '@/components/Lightbox'; // Asumsi komponen Lightbox ada
import goldBokehOverlay from "@/assets/gold-bokeh-overlay.jpg"; 
import { Button } from '@/components/ui/button'; 
import { PostgrestError } from '@supabase/supabase-js'; // Import error type

// Komponen ini mengasumsikan Photo type dari useFetchGallery sudah benar.

const GallerySection = () => {
    // Ambil refreshPhotos dari hook
    const { photos, isLoading, error, deleteGalleryPhoto, refreshPhotos } = useFetchGallery(); 
    const { uploadAndInsertPhoto } = useUploadPhoto('gallery');
    const { isAdmin } = useAdmin(); 
    
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false); 
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    const handleUploadSuccess = () => {
        setIsUploadModalOpen(false);
        // Data refresh dilakukan di dalam Modal, jadi tidak perlu reload di sini
    };
    
    // FIX KRITIS: Menggunakan PhotoId (string) dan mengganti alert/confirm
    const handleDelete = async (id: PhotoId, src: string) => {
        // Ganti window.confirm dengan logging/custom modal UI
        const confirmed = window.prompt(`Ketik "HAPUS" untuk mengonfirmasi penghapusan foto ID ${id}:`);
        if (confirmed !== "HAPUS") {
            console.log("Penghapusan dibatalkan oleh pengguna.");
            return;
        }

        try {
            await deleteGalleryPhoto(id, src);
            console.log(`[GALLERY] Foto ID ${id} berhasil dihapus!`);
            // Ganti alert dengan logging
        } catch (error) {
            console.error("Gagal menghapus foto galeri. Detail:", (error as PostgrestError).message);
            // Ganti alert dengan logging
        }
    };
    
    if (isLoading) {
        return <section className="relative py-24 text-center text-foreground/70"><p>Memuat galeri foto...</p></section>;
    }
    if (error) {
        return <section className="relative py-24 text-center text-red-500"><p>Error: {error}</p></section>;
    }
    
    const images = photos ? photos.map(p => ({ src: p.src, alt: `Gallery Photo ${p.id}` })) : [];


    return (
        <section className="relative py-24 overflow-hidden z-20">
            
            {/* Backgrounds */}
            <div 
                className="absolute inset-0 bg-cover bg-center opacity-10"
                style={{ backgroundImage: `url(${goldBokehOverlay})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-black/50 to-background" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                
                {/* Title dan Tombol */}
                <div className="flex flex-col items-center justify-center space-y-4 mb-16 animate-slide-up">
                    <h2 className="text-5xl md:text-6xl font-bold text-gold text-center font-['Playfair_Display']">
                        Galeri Momen
                    </h2>
                    <div className="h-1 w-32 bg-gold/50" />
                    <p className="text-lg text-foreground/70 text-center">
                        Koleksi momen berharga kami
                    </p>

                    {/* Tombol Tambah Foto (Hanya Admin) */}
                    {isAdmin && (
                        <Button 
                            onClick={() => setIsUploadModalOpen(true)} 
                            className="bg-gold hover:bg-gold/80 mt-4"
                        >
                            <PlusCircle className="w-5 h-5 mr-2" /> Tambah Foto Galeri
                        </Button>
                    )}
                </div>
                {/* ========================================================================= */}


                {/* Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    
                    {photos && photos.length > 0 ? (
                        photos.map((item, index) => (
                            <div
                                key={item.id} // Menggunakan ID string
                                className="group cursor-pointer animate-fade-in"
                                style={{ animationDelay: `${index * 0.05}s` }}
                                onClick={() => setSelectedImageIndex(index)}
                            >
                                <div className="relative aspect-square overflow-hidden rounded-xl border-2 border-gold/30 group-hover:border-gold/60 transition-all duration-300">
                                    
                                    <img 
                                        src={item.src} 
                                        alt={`Galeri Momen ${index + 1}`} 
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    
                                    {isAdmin && (
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation(); // Mencegah lightbox terbuka
                                                handleDelete(item.id, item.src);
                                            }}
                                            className="absolute top-2 right-2 bg-red-600/90 text-white p-1 rounded-full z-20 hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        /* Pesan jika galeri kosong */
                        <div className="col-span-full text-center text-foreground/70 mt-8">
                            <p>Galeri masih kosong.</p>
                            {isAdmin && <p className="text-sm mt-2">Gunakan tombol 'Tambah Foto Galeri' untuk memulai.</p>}
                        </div>
                    )}
                    
                </div>
                
                {/* MODAL UPLOAD */}
                {isUploadModalOpen && (
                    <UploadModal 
                        onClose={() => setIsUploadModalOpen(false)} 
                        section="gallery" 
                        uploadFunction={uploadAndInsertPhoto} 
                        onUploadSuccess={handleUploadSuccess} 
                        onDataRefresh={refreshPhotos} 
                    />
                )}

                {/* LIGHTBOX */}
                {selectedImageIndex !== null && images.length > 0 && (
                    <Lightbox 
                        images={images}
                        currentIndex={selectedImageIndex}
                        onClose={() => setSelectedImageIndex(null)}
                    />
                )}
            </div>
        </section>
    );
};

export default GallerySection;