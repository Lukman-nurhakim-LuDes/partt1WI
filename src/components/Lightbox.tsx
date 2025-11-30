// src/components/Lightbox.tsx

import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageItem {
    src: string;
    alt: string;
}

interface LightboxProps {
    images: ImageItem[]; // Array berisi semua gambar di galeri/story
    currentIndex: number; // Index gambar yang sedang ditampilkan
    onClose: () => void; // Fungsi untuk menutup lightbox
    // Fungsi opsional untuk navigasi (jika Anda ingin mengintegrasikannya)
    onNext?: () => void; 
    onPrev?: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ images, currentIndex, onClose }) => {
    
    // Pastikan images ada dan memiliki konten
    if (!images || images.length === 0 || currentIndex === null) {
        return null;
    }

    const currentImage = images[currentIndex];
    
    // Logic Navigasi
    const canGoNext = currentIndex < images.length - 1;
    const canGoPrev = currentIndex > 0;

    const handleNext = () => {
        if (canGoNext) {
            // Anda perlu mempassing fungsi update state dari parent jika ingin menggunakan ini
            // Untuk saat ini, kita biarkan logicnya di parent component (GallerySection)
            // Namun, di Lightbox standar, kita bisa mengimplementasikannya secara internal
            // Untuk Lightbox sederhana ini, kita hanya akan menampilkan gambarnya.
            console.log("Navigasi Lightbox membutuhkan state update di parent.");
        }
    };
    
    const handlePrev = () => {
        if (canGoPrev) {
             console.log("Navigasi Lightbox membutuhkan state update di parent.");
        }
    };

    // Fungsi untuk menutup Lightbox saat tombol Escape ditekan
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    return (
        // Overlay - Menggunakan z-index tinggi agar tampil di atas segalanya
        <div 
            className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={onClose}
            tabIndex={-1} // Agar bisa menangkap event keyboard
            onKeyDown={handleKeyDown}
        >
            
            {/* Tombol Tutup (X) */}
            <button
                className="absolute top-6 right-6 p-3 bg-gold/20 rounded-full hover:bg-gold/30 transition-colors z-[101]"
                onClick={onClose}
                aria-label="Close Lightbox"
            >
                <X className="w-6 h-6 text-gold" />
            </button>
            
            {/* Container Gambar */}
            <div 
                className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()} // Mencegah klik pada gambar menutup modal
            >
                <img 
                    src={currentImage.src}
                    alt={currentImage.alt}
                    className="max-w-full max-h-full object-contain rounded-lg border-2 border-gold/50 elegant-shadow"
                    loading="eager"
                />
            </div>
            
            {/* Tombol Navigasi (Opsi Tambahan - Anda bisa mengaktifkannya nanti) */}
            {/*
            {canGoPrev && (
                <button 
                    onClick={handlePrev}
                    className="absolute left-4 p-3 bg-black/50 rounded-full text-gold hover:bg-black/70 z-[101]"
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>
            )}
            {canGoNext && (
                <button 
                    onClick={handleNext}
                    className="absolute right-4 p-3 bg-black/50 rounded-full text-gold hover:bg-black/70 z-[101]"
                >
                    <ChevronRight className="w-8 h-8" />
                </button>
            )}
            */}
        </div>
    );
};

export default Lightbox;