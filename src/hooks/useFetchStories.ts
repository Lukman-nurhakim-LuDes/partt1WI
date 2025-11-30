// useFetchStories.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase'; 

// --- Interfaces dan Tipe ---
interface Story {
    id: number;
    caption: string;
    description: string;
    src: string;
    // delay_number MENGAMBIL alias dari kolom 'order_index'
    delay_number: number; 
    section: 'story'; 
}

interface UseStoriesResult {
    stories: Story[] | null;
    isLoading: boolean;
    error: string | null;
    updateStoryText: (id: number, field: 'caption' | 'description', value: string) => void;
    deleteStoryPhoto: (id: number, src: string) => Promise<void>; 
    refreshStories: () => void; 
}

// --- Hook Utama ---
export default function useFetchStories(): UseStoriesResult {
    const [stories, setStories] = useState<Story[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // FUNGSI FETCH UTAMA
    const fetchStories = useCallback(async () => {
        setIsLoading(true);
        try {
            // PERUBAHAN KRITIS: Menggunakan nama kolom yang BENAR: order_index
            const { data, error } = await supabase
                .from('dynamic_photos')
                // SELECT kolom order_index (nama yang benar) sebagai delay_number
                .select('id, src, caption, description, order_index as delay_number, section') 
                .eq('section', 'story')
                // ORDER berdasarkan order_index (nama kolom yang benar)
                .order('order_index', { ascending: true }); 

            if (error) throw error;

            if (data) { 
                setStories(data as unknown as Story[]); 
            } else {
                setStories([]); 
            }

            setError(null);
        } catch (err: any) {
            console.error("Error fetching stories:", err.message);
            // Error ini akan tetap muncul jika RLS/cache belum bersih
            setError(`Gagal memuat cerita: ${err.message}`); 
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStories();
    }, [fetchStories]);

    const refreshStories = () => {
        fetchStories();
    };

    // --- FUNGSI HAPUS FOTO STORY BARU ---
    const deleteStoryPhoto = async (id: number, src: string) => {
        try {
            const filePath = src.split('wedding_assets/')[1];
            await supabase.storage.from('wedding_assets').remove([filePath]);
            await supabase.from('dynamic_photos').delete().eq('id', id);
            setStories(prevStories => prevStories ? prevStories.filter(story => story.id !== id) : null);
            
        } catch (err: any) {
            console.error("Gagal menghapus foto story:", err.message);
            throw new Error("Gagal menghapus foto: " + err.message);
        }
    };

    // --- FUNGSI UPDATE TEXT ---
    const updateStoryText = async (id: number, field: 'caption' | 'description', value: string) => {
           try {
             const updatePayload: { [key: string]: string } = { [field]: value };
             
             const { error } = await supabase
                 .from('dynamic_photos')
                 .update(updatePayload)
                 .eq('id', id);

             if (error) throw error;
            
             setStories(prevStories => 
                 prevStories ? prevStories.map(story => 
                     story.id === id ? { ...story, [field]: value } : story
                 ) : null
             );
         } catch (err: any) {
             console.error(`Gagal mengupdate ${field}:`, err.message);
         }
    };


    return { stories, isLoading, error, updateStoryText, deleteStoryPhoto, refreshStories };
}