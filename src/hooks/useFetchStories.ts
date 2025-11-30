// src/hooks/useFetchStories.ts

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

// --- Interfaces dan Tipe ---
interface Story {
    id: number;
    caption: string;
    description: string;
    src: string;
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

    const fetchStories = useCallback(async () => {
        setIsLoading(true);
        try {
            // Menggunakan SQL Alias untuk mencocokkan properti 'delay_number'
            const { data, error } = await supabase
                .from('dynamic_photos')
                .select('id, src, caption, description, order_index as delay_number, section') 
                .eq('section', 'story') 
                .order('order_index', { ascending: true }); 

            if (error) throw error;

            // PERBAIKAN KRITIS: Menggunakan as unknown as Story[]
            setStories(data as unknown as Story[]); 
            
            setError(null);
        } catch (err: any) {
            console.error("Error fetching stories:", err.message);
            setError(`Gagal memuat cerita: ${err.message}. Cek koneksi API dan kolom DB.`);
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

    // ... (Fungsi updateStoryText dan deleteStoryPhoto dipertahankan agar lengkap) ...

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


    return { stories, isLoading, error, updateStoryText, deleteStoryPhoto, refreshStories };
}