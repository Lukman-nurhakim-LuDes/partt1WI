// src/hooks/useFetchGallery.ts

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase'; 

// --- Interfaces dan Tipe ---

interface Photo {
    id: number;
    src: string;
    order_index: number; // Kolom yang dicari oleh Gallery
    section: 'gallery'; 
}

interface UseGalleryResult {
    photos: Photo[] | null;
    isLoading: boolean;
    error: string | null;
    deleteGalleryPhoto: (id: number, src: string) => Promise<void>; 
    refreshPhotos: () => void;
}

// --- Hook Utama ---
export default function useFetchGallery(): UseGalleryResult {
    const [photos, setPhotos] = useState<Photo[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPhotos = useCallback(async () => {
        setIsLoading(true);
        try {
            // FINAL FIX: Menggunakan kolom order_index secara langsung
            const { data, error } = await supabase
                .from('dynamic_photos')
                .select('id, src, order_index, section') 
                .eq('section', 'gallery') 
                .order('order_index', { ascending: true }); // Order berdasarkan order_index

            if (error) {
                setError(error.message);
                setIsLoading(false);
                return;
            }

            setPhotos(data as unknown as Photo[]);
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
    
    const refreshPhotos = () => {
        fetchPhotos();
    };

    // --- FUNGSI HAPUS FOTO GALERI (Dipertahankan agar lengkap) ---
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