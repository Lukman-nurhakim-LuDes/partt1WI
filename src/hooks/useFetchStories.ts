import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Sesuaikan path import

// Interface untuk Story Item
interface StoryItem {
  id: number;
  src: string; // URL gambar
  caption: string;
  description: string;
  delay_number: number;
}

// Interface return hook
interface UseStoriesResult {
  stories: StoryItem[];
  isLoading: boolean;
  error: string | null;
}

export default function useFetchStories(): UseStoriesResult {
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // PERBAIKAN: Mengganti 'story_photos' menjadi 'dynamic_photos' dan menambahkan filter
        const { data, error } = await supabase
          .from('dynamic_photos') // <-- NAMA TABEL YANG BENAR
          .select('id, src, caption, description, order_index')
          .eq('section', 'story') // <-- FILTER: Ambil hanya data untuk Storytelling
          .order('order_index', { ascending: true }); // Urutkan berdasarkan indeks urutan

        if (error) throw error;

        // Map data Supabase ke interface StoryItem
        const formattedData: StoryItem[] = data.map(item => ({
            id: item.id,
            src: item.src,
            caption: item.caption || '',
            description: item.description || '',
            delay_number: item.order_index || 0, // Menggunakan order_index
        }));
        
        setStories(formattedData);
        
      } catch (err: any) {
        console.error("Error fetching stories:", err.message);
        // Memberikan pesan error yang jelas jika gagal
        setError("Gagal memuat cerita: " + err.message); 
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStories();
  }, []);

  return { stories, isLoading, error };
}