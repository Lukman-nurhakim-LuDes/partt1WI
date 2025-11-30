// src/hooks/useFetchStories.ts

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Sesuaikan path import

interface StoryItem {
  id: number;
  src: string; // URL gambar
  caption: string;
  description: string;
  delay_number: number;
}

// PERBAIKAN: Tambahkan updateStoryText ke Interface Hasil Hook
interface UseStoriesResult {
  stories: StoryItem[];
  isLoading: boolean;
  error: string | null;
  // Definisi tipe fungsi: mengembalikan Promise<void>
  updateStoryText: (id: number, field: 'caption' | 'description', newValue: string) => Promise<void>;
}

export default function useFetchStories(): UseStoriesResult {
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- FUNGSI FETCH DATA (Tidak Berubah) ---
  useEffect(() => {
    const fetchStories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('dynamic_photos') // NAMA TABEL YANG BENAR
          .select('id, src, caption, description, order_index')
          .eq('section', 'story') 
          .order('order_index', { ascending: true }); 

        if (error) throw error;

        const formattedData: StoryItem[] = data.map(item => ({
            id: item.id,
            src: item.src,
            caption: item.caption || '',
            description: item.description || '',
            delay_number: item.order_index || 0,
        }));
        
        setStories(formattedData);
        setError(null);
        
      } catch (err: any) {
        console.error("Error fetching stories:", err.message);
        setError("Gagal memuat cerita: " + err.message); 
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStories();
  }, []);

  // --- FUNGSI UPDATE DATA (UNTUK INLINE EDITING) ---
  const updateStoryText = async (id: number, field: 'caption' | 'description', newValue: string) => {
    try {
        const { error } = await supabase
            .from('dynamic_photos')
            .update({ [field]: newValue })
            .eq('id', id);

        if (error) throw error;
        
        // Perbarui state lokal secara instan (Optimistic Update)
        setStories(prevStories => 
            prevStories.map(story => 
                story.id === id ? { ...story, [field]: newValue } : story
            )
        );
    } catch (err: any) {
        console.error("Gagal menyimpan perubahan teks:", err.message);
        throw err;
    }
  };

  // PERBAIKAN FINAL: Sertakan updateStoryText dalam objek return
  return { stories, isLoading, error, updateStoryText };
}