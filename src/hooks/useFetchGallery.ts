// src/hooks/useFetchGallery.ts

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Sesuaikan path

interface GalleryItem {
  id: number;
  src: string; // URL Publik foto
  order_index: number; 
}

// PERBAIKAN: Tambahkan uploadGalleryPhoto ke Interface Hasil Hook
interface UseGalleryResult {
  photos: GalleryItem[];
  isLoading: boolean;
  error: string | null;
  // Tambahkan definisi tipe fungsi di sini
  uploadGalleryPhoto: (file: File) => Promise<void>; 
}

export default function useFetchGallery(): UseGalleryResult { 
    
    const [photos, setPhotos] = useState<GalleryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState<string | null>(null);

    // --- FUNGSI FETCH DATA (Tetap sama) ---
    useEffect(() => {
        const fetchGallery = async () => {
            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from('dynamic_photos') 
                    .select('id, src, order_index')
                    .eq('section', 'gallery') 
                    .order('order_index', { ascending: true }); 

                if (error) throw error;

                const formattedData: GalleryItem[] = data.map(item => ({
                    id: item.id,
                    src: item.src,
                    order_index: item.order_index || 0,
                }));
                
                setPhotos(formattedData);
                setError(null);

            } catch (err: any) {
                console.error("Error fetching gallery:", err.message);
                setError("Gagal memuat galeri: " + err.message);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchGallery();
    }, []);


    // --- FUNGSI UPLOAD GALLERY PHOTO (Implementasi) ---
    const uploadGalleryPhoto = async (file: File): Promise<void> => {
        // Implementasi nyata upload ke Supabase Storage (yang kita bahas sebelumnya)
        console.log("Mencoba mengunggah file:", file.name);

        // ... (Logic Supabase Storage dan Insert ke DB di sini) ...
        alert(`Simulasi upload berhasil untuk: ${file.name}`);
    };


    // PERBAIKAN FINAL: Sertakan uploadGalleryPhoto dalam objek return
    return { photos, isLoading, error, uploadGalleryPhoto };
}