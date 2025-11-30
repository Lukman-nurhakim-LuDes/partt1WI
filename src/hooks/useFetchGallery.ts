import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Sesuaikan path import

// Interface untuk Gallery Item
interface GalleryItem {
  id: number;
  src: string; // URL gambar
  order_index: number; 
}

// Interface return hook
interface UseGalleryResult {
  photos: GalleryItem[];
  isLoading: boolean;
  error: string | null;
}

export default function useFetchGallery(): UseGalleryResult {
  const [photos, setPhotos] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // PERBAIKAN: Mengganti 'gallery_photos' menjadi 'dynamic_photos' dan menambahkan filter
        const { data, error } = await supabase
          .from('dynamic_photos') // <-- NAMA TABEL YANG BENAR
          .select('id, src, order_index')
          .eq('section', 'gallery') // <-- FILTER: Ambil hanya data untuk Galeri
          .order('order_index', { ascending: true }); // Urutkan berdasarkan indeks urutan

        if (error) throw error;

        // Map data Supabase ke interface GalleryItem
        const formattedData: GalleryItem[] = data.map(item => ({
            id: item.id,
            src: item.src,
            order_index: item.order_index || 0,
        }));
        
        setPhotos(formattedData);
        
      } catch (err: any) {
        console.error("Error fetching gallery:", err.message);
        // Memberikan pesan error yang jelas jika gagal
        setError("Gagal memuat galeri: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGallery();
  }, []);

  return { photos, isLoading, error };
}