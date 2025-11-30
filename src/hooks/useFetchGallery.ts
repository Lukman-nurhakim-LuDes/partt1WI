// src/hooks/useFetchGallery.ts

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase'; 

// --- Interfaces dan Tipe ---
interface Photo {
    id: number;
    src: string;
    order_index: number; 
    section: 'gallery';
}

interface UseGalleryResult {
    photos: Photo[] | null;
    isLoading: boolean;
    error: string | null;
    deleteGalleryPhoto: (id: number, src: string) => Promise<void>; 
    refreshPhotos: () => void; // Fungsi baru untuk refresh tanpa reload
}

// --- Hook Utama ---
export default function useFetchGallery(): UseGalleryResult {
    const [photos, setPhotos] = useState<Photo[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // FUNGSI FETCH UTAMA
    const fetchPhotos = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('dynamic_photos')
                .select('id, src, order_index, section') 
                .eq('section', 'gallery') 
                .order('order_index', { ascending: true }); 

            if (error) throw error;

            setPhotos(data as Photo[]);
            setError(null);
        } catch (err: any) {
             console.error("Gagal memuat galeri:", err.message);
             setError(`Gagal memuat galeri: ${err.message}.`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPhotos();
    }, [fetchPhotos]);
    
    // FUNGSI REFRESH: Hanya memanggil ulang fetchPhotos
    const refreshPhotos = () => {
        fetchPhotos();
    };

    // --- FUNGSI HAPUS FOTO GALERI (dipertahankan agar lengkap) ---
    const deleteGalleryPhoto = async (id: number, src: string) => {
        try {
            const filePath = src.split('wedding_assets/')[1];
            await supabase.storage.from('wedding_assets').remove([filePath]);
            await supabase.from('dynamic_photos').delete().eq('id', id);
            setPhotos(prevPhotos => prevPhotos ? prevPhotos.filter(photo => photo.id !== id) : null);
            
        } catch (err: any) {
            console.error("Gagal menghapus foto galeri:", err.message);
            throw new Error("Gagal menghapus foto: " + err.message);
        }
    };


    return { photos, isLoading, error, deleteGalleryPhoto, refreshPhotos };
}