// src/components/invitation/GallerySection.tsx

import { useState } from "react";
import { X, PlusCircle } from "lucide-react";
import goldBokehOverlay from "@/assets/gold-bokeh-overlay.jpg";

// Import komponen baru
import UploadModal from "@/components/UploadModal"; 

// Import Hooks & Context
import useFetchGallery from "@/hooks/useFetchGallery"; 
import { useAdmin } from "@/context/AdminContext"; 

// Interface dasar untuk Gallery Item (sesuai hook)
interface GalleryItem {
  id: number;
  src: string; // URL gambar
  order_index: number;
}


const GallerySection = () => {
  // Destructure hook, sekarang dengan uploadGalleryPhoto
  const { photos, isLoading, error, uploadGalleryPhoto } = useFetchGallery(); 
  const { isAdmin } = useAdmin(); 
  
  // STATE BARU: Kontrol untuk Modal Upload
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  // STATE LAMA: Kontrol untuk Lightbox
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  
  const selectedImage = selectedImageIndex !== null ? photos[selectedImageIndex] : null;

  // --- Handling Loading/Error States ---
  if (isLoading) {
    return (
        <section className="relative py-24 text-center text-foreground/70">
            <p>Memuat Galeri Momen...</p>
        </section>
    );
  }

  if (error) {
    return (
        <section className="relative py-24 text-center text-destructive">
            <p>Gagal memuat Galeri: {error}</p>
        </section>
    );
  }

  // --- Handling Tombol Upload ---
  const handleUploadClick = () => {
      if (isAdmin) {
          // GANTI: Membuka modal
          setIsUploadModalOpen(true);
      }
  };


  return (
    <section className="relative py-24 overflow-hidden">
      {/* Backgrounds... (Tetap sama) */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${goldBokehOverlay})` }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-background via-black/50 to-background" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16 animate-slide-up">
          <h2 className="text-5xl md:text-6xl font-bold text-gold">
            Galeri Momen
          </h2>
          <div className="h-1 w-32 bg-gold/50 mx-auto" />
          <p className="text-lg text-foreground/70">
            Koleksi momen berharga kami
          </p>
        </div>
        
        {/* Tombol Tambah Foto (Hanya Admin) */}
        {isAdmin && (
            <div className="flex justify-center mb-8">
                <button 
                    onClick={handleUploadClick} 
                    className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-primary-foreground px-6 py-2 rounded-full transition-all glow-gold"
                >
                    <PlusCircle className="w-4 h-4" /> Tambah Foto Galeri
                </button>
            </div>
        )}
        
        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          
          {/* PEMERIKSAAN KONDISIONAL photos && */}
          {photos && photos.map((item, index) => (
            <div
              key={item.id} 
              className="group cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => setSelectedImageIndex(index)}
            >
              <div className="relative aspect-square overflow-hidden rounded-xl border-2 border-gold/30 group-hover:border-gold/60 transition-all duration-300">
                
                {/* Gambar LIVE dari Supabase */}
                <img 
                    src={item.src} 
                    alt={`Galeri Momen ${index + 1}`} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
                
                {/* Gold Frame Effect & Overlay on Hover */}
                <div className="absolute inset-0 border-4 border-gold/20 group-hover:border-gold/40 transition-all duration-300" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-gold text-sm">View</span>
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 glow-gold" />
              </div>
            </div>
          ))}
          
          {/* Pesan jika tidak ada foto dan tidak loading */}
          {!isLoading && photos.length === 0 && (
             <p className="text-foreground/50 col-span-full text-center">Belum ada foto di galeri. Tambahkan di Mode Admin.</p>
          )}

        </div>
      </div>
      
      {/* MODAL UPLOAD BARU */}
      {isUploadModalOpen && (
        <UploadModal 
            onClose={() => setIsUploadModalOpen(false)} 
            // Ketika upload sukses, modal ditutup dan galeri akan auto-refresh
            onUploadSuccess={() => setIsUploadModalOpen(false)} 
        />
      )}

      {/* Lightbox Modal (Tetap Sama) */}
      {selectedImage !== null && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedImageIndex(null)}
        >
          <button
            className="absolute top-6 right-6 p-2 bg-gold/20 rounded-full hover:bg-gold/30 transition-colors"
            onClick={() => setSelectedImageIndex(null)}
          >
            <X className="w-8 h-8 text-gold" />
          </button>
          
          <div 
            className="relative max-w-4xl w-full h-full md:h-auto" 
            onClick={(e) => e.stopPropagation()}
          >
            <img 
                src={selectedImage.src} 
                alt={`Galeri Momen ${selectedImageIndex + 1}`} 
                className="max-w-full max-h-full object-contain rounded-2xl border-4 border-gold/50 elegant-shadow mx-auto"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;