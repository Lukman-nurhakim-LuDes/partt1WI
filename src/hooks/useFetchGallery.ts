// src/hooks/useFetchGallery.ts

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client'; 
import type { Tables } from '@/integrations/supabase/types'; // Import Tables type
import { PostgrestError } from '@supabase/supabase-js';

// --- Interfaces dan Tipe ---

// Definisikan tipe Photo berdasarkan type Tabel dynamic_photos
export type Photo = Tables<'dynamic_photos'>; 
// ID Supabase adalah UUID (string), bukan number
export type PhotoId = string; 

interface UseGalleryResult {
    photos: Photo[] | null;
    isLoading: boolean;
    error: string | null;
    // Menggunakan PhotoId (string) untuk ID
    deleteGalleryPhoto: (id: PhotoId, src: string) => Promise<void>; 
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
            // FIX: Menggunakan select('*') untuk mengambil semua kolom yang diperlukan
            const { data, error } = await supabase
                .from('dynamic_photos')
                .select('*') 
                .eq('section', 'gallery') 
                .order('order_index', { ascending: true }); 

            if (error) {
                // FIX: Menggunakan PostgrestError type
                setError((error as PostgrestError).message);
                setIsLoading(false);
                return;
            }

            // FIX: Hapus 'as unknown as Photo[]' karena kita menggunakan type safety
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
    
    const refreshPhotos = () => {
        fetchPhotos();
    };

    // --- FUNGSI HAPUS FOTO GALERI ---
    const deleteGalleryPhoto = async (id: PhotoId, src: string) => {
        try {
            // FIX: Parsing path yang lebih aman
            const urlParts = src.split('wedding_assets/');
            const filePath = urlParts.length > 1 ? urlParts[1] : null; 

            if (filePath) {
                 // 1. Hapus dari Storage
                 const { error: storageError } = await supabase.storage.from('wedding_assets').remove([filePath]);
                 if (storageError) console.warn("Gagal menghapus file dari storage (mungkin tidak ada):", storageError.message);
            }
           
            // 2. Hapus dari Database
            // FIX: Menggunakan id string
            const { error: dbError } = await supabase.from('dynamic_photos').delete().eq('id', id).single();

            if (dbError) throw dbError as PostgrestError;
            
            // 3. Perbarui state lokal
            setPhotos(prevPhotos => prevPhotos ? prevPhotos.filter(photo => photo.id !== id) : null);
            
        } catch (err: any) {
            console.error("Gagal menghapus foto galeri:", err.message);
            throw new Error("Gagal menghapus foto: " + err.message);
        }
    };


    return { photos, isLoading, error, deleteGalleryPhoto, refreshPhotos };
}