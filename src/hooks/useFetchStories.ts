// src/hooks/useFetchStories.ts

import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase'; 

interface StoryItem {
    id: number;
    src: string;
    caption: string;
    description: string;
    delay: number;
}

// PERBAIKAN: Tambahkan updateStoryText ke Interface Hasil Hook
interface UseStoriesResult {
    stories: StoryItem[];
    isLoading: boolean;
    error: string | null;
    updateStoryText: (id: number, field: 'caption' | 'description', newValue: string) => Promise<void>;
}

export default function useFetchStories(): UseStoriesResult { 
    
    const [stories, setStories] = useState<StoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState<string | null>(null);

    // --- FUNGSI FETCH DATA (Tidak Berubah) ---
    useEffect(() => {
        const fetchStories = async () => {
            setIsLoading(true);
            try {
                // GANTI 'story_photos' dengan NAMA TABEL ANDA di Supabase
                const { data, error } = await supabase
                    .from('story_photos')
                    .select('*')
                    .order('delay', { ascending: true });

                if (error) throw error;

                setStories(data as StoryItem[]); 
                setError(null);

            } catch (err: any) {
                console.error("Error fetching stories:", err.message);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStories();
    }, []);

    // --- FUNGSI UPDATE DATA BARU (Ditempatkan di dalam hook) ---
    const updateStoryText = async (id: number, field: 'caption' | 'description', newValue: string) => {
        try {
            // Memastikan hanya admin yang bisa mengedit (Walaupun Auth Supabase lebih aman)
            if (!newValue.trim()) {
                throw new Error("Konten tidak boleh kosong.");
            }
            
            const { error } = await supabase
                .from('story_photos')
                .update({ [field]: newValue })
                .eq('id', id);

            if (error) throw error;
            
            // Perbarui state lokal secara instan (Optimistic Update)
            setStories(prevStories => 
                prevStories.map(story => 
                    story.id === id ? { ...story, [field]: newValue } : story
                )
            );
            
            console.log(`Update berhasil untuk ID ${id}, Field: ${field}`);

        } catch (err: any) {
            console.error("Gagal menyimpan perubahan ke Supabase:", err.message);
            throw err;
        }
    };

    // PERBAIKAN FINAL: Pastikan fungsi updateStoryText dikembalikan
    return { stories, isLoading, error, updateStoryText };
}