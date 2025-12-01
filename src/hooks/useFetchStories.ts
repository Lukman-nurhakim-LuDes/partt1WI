// src/hooks/useFetchStories.ts

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client'; 
import type { Tables } from '@/integrations/supabase/types'; // Import Tables type
import { PostgrestError } from '@supabase/supabase-js'; // Import error type

// --- Interfaces dan Tipe ---
// Definisikan tipe Story berdasarkan type Tabel dynamic_photos
export type Story = Tables<'dynamic_photos'>; 
// ID Supabase adalah UUID (string), bukan number
export type StoryId = string;

interface UseStoriesResult {
    stories: Story[] | null;
    isLoading: boolean;
    error: string | null;
    // Menggunakan StoryId (string) untuk ID dan field dari type Story
    updateStoryText: (id: StoryId, field: 'caption' | 'description', value: string) => void;
    deleteStoryPhoto: (id: StoryId, src: string) => Promise<void>; 
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
            // FIX: Menggunakan select('*') dan order berdasarkan 'order_index' atau kolom urutan
            const { data, error } = await supabase
                .from('dynamic_photos')
                .select('*') // Pilih semua kolom karena Anda perlu semua data
                .eq('section', 'story') 
                .order('order_index', { ascending: true }); // Order berdasarkan order_index (asumsi kolom urutan)

            if (error) throw error as PostgrestError;

            // FIX: Hapus 'as unknown as Story[]' karena kita menggunakan type safety
            setStories(data as Story[]); 
            setError(null);
        } catch (err: any) {
            console.error("Error fetching stories:", err.message);
            setError(`Gagal memuat cerita: ${err.message}.`);
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

    // --- FUNGSI UPDATE TEXT ---
    const updateStoryText = async (id: StoryId, field: 'caption' | 'description', value: string) => {
        try {
            const updatePayload = { [field]: value };
            const { error } = await supabase.from('dynamic_photos').update(updatePayload).eq('id', id).single(); 

            if (error) throw error as PostgrestError;
            
            // Perbarui state lokal
            setStories(prevStories => 
                prevStories ? prevStories.map(story => 
                    story.id === id ? { ...story, [field]: value } : story
                ) : null
            );
        } catch (err: any) {
            console.error(`Gagal mengupdate ${field}:`, err.message);
        }
    };
    
    // --- FUNGSI HAPUS FOTO STORY ---
    const deleteStoryPhoto = async (id: StoryId, src: string) => {
        try {
            // Parsing path yang lebih aman
            const urlParts = src.split('wedding_assets/');
            const filePath = urlParts.length > 1 ? urlParts[1] : null; 

            if (filePath) {
                 // 1. Hapus dari Storage
                 const { error: storageError } = await supabase.storage.from('wedding_assets').remove([filePath]);
                 if (storageError) console.warn("Gagal menghapus file dari storage (mungkin tidak ada):", storageError.message);
            }
           
            // 2. Hapus dari Database
            const { error: dbError } = await supabase.from('dynamic_photos').delete().eq('id', id).single();
            if (dbError) throw dbError as PostgrestError;
            
            // 3. Perbarui state lokal
            setStories(prevStories => prevStories ? prevStories.filter(story => story.id !== id) : null);

        } catch (err: any) {
            console.error("Gagal menghapus foto story:", err.message);
            throw new Error("Gagal menghapus foto: " + err.message);
        }
    };

    return { stories, isLoading, error, updateStoryText, deleteStoryPhoto, refreshStories };
}