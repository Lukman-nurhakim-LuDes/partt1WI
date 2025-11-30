// src/hooks/useFetchGallery.ts

import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase'; // Sesuaikan path

interface GalleryItem {
    id: number;
    src: string; // URL Publik foto
    order: number; // Untuk mengurutkan foto
}

// PERBAIKAN: Tambahkan uploadGalleryPhoto ke Interface Hasil Hook
interface UseGalleryResult {
    galleryItems: GalleryItem[];
    isLoading: boolean;
    error: string | null;
    // Definisi tipe fungsi: mengembalikan Promise<void>
    uploadGalleryPhoto: (file: File) => Promise<void>; 
}

// Gunakan export default function dan deklarasikan tipe return
export default function useFetchGallery(): UseGalleryResult { 
    
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState<string | null>(null);

    // --- FUNGSI FETCH DATA ---
    useEffect(() => {
        const fetchGallery = async () => {
            setIsLoading(true);
            try {
                // GANTI 'gallery_photos' dengan NAMA TABEL ANDA di Supabase
                const { data, error } = await supabase
                    .from('gallery_photos')
                    .select('id, src, order') 
                    .order('order', { ascending: true }); 

                if (error) throw error;

                setGalleryItems(data as GalleryItem[]); 
                setError(null);

            } catch (err: any) {
                console.error("Error fetching gallery:", err.message);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGallery();
    }, []);


    // --- FUNGSI UPLOAD GALLERY PHOTO BARU ---
    // Implementasi ini memerlukan Supabase Storage!
    const uploadGalleryPhoto = async (file: File): Promise<void> => {
        // Implementasi sebenarnya untuk mengunggah file ke Supabase Storage
        console.log("Mencoba mengunggah file:", file.name);

        // Contoh: Logika upload ke Supabase Storage dan Insert ke Database
        /* const filePath = `gallery/${Date.now()}_${file.name}`;
        const { data: storageData, error: storageError } = await supabase.storage
            .from('nama_bucket_anda') // GANTI NAMA BUCKET
            .upload(filePath, file);

        if (storageError) throw storageError;

        // Mendapatkan URL publik file
        const publicURL = supabase.storage
            .from('nama_bucket_anda')
            .getPublicUrl(filePath).data.publicUrl;

        // Menyimpan URL ke tabel gallery_photos
        const { data: insertData, error: insertError } = await supabase
            .from('gallery_photos')
            .insert([{ src: publicURL, order: galleryItems.length + 1 }]);

        if (insertError) throw insertError;

        // Memperbarui state lokal
        const newPhoto = { id: insertData[0].id, src: publicURL, order: galleryItems.length + 1 };
        setGalleryItems(prev => [...prev, newPhoto]);
        */

        // Jika Anda belum mengimplementasikan logic Supabase Storage, biarkan saja seperti ini
        alert(`Simulasi upload berhasil untuk: ${file.name}`);
    };


    // PERBAIKAN FINAL: Pastikan fungsi uploadGalleryPhoto dikembalikan
    return { galleryItems, isLoading, error, uploadGalleryPhoto };
}