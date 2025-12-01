// src/hooks/useContent.ts

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client'; // LOKASI YANG BENAR

// Interface untuk data content yang tersimpan dalam format JSON
interface ContentData {
    title: string;
    description: string;
    quote: string;
    [key: string]: string; // Memungkinkan properti lain
}

interface UseContentResult {
    content: ContentData;
    isLoading: boolean;
    updateContent: (fieldName: string, newValue: string) => Promise<void>;
}

// ID BARIS yang menyimpan data Welcome Section di tabel editable_content
// Dalam implementasi nyata, ini harusnya diambil dari DB atau environment variable
const WELCOME_SECTION_ID = 'welcome_section'; 

// Nilai default jika fetch gagal atau data belum ada
const DEFAULT_CONTENT: ContentData = {
    title: "Selamat Datang",
    description: "Dengan penuh kebahagiaan dan kehormatan, kami mengundang Anda untuk berbagi momen istimewa bersama kami dalam perayaan yang penuh keajaiban dan keanggunan.",
    quote: "Setiap momen berharga dimulai dengan undangan untuk bersama",
};


export default function useContent(sectionId: string = WELCOME_SECTION_ID): UseContentResult {
    const [content, setContent] = useState<ContentData>(DEFAULT_CONTENT);
    const [isLoading, setIsLoading] = useState(true);
    
    // Simpan ID baris yang ditemukan
    const [recordId, setRecordId] = useState<string | null>(null);

    // 1. FUNGSI FETCH
    const fetchContent = useCallback(async () => {
        setIsLoading(true);
        try {
            // Fetch baris berdasarkan section_name
            const { data, error } = await supabase
                .from('editable_content')
                .select('id, content_json')
                .eq('section_name', sectionId)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = Not Found (tidak masalah)
                throw error;
            }

            if (data && data.content_json) {
                // Set ID untuk update nanti
                setRecordId(data.id); 
                // Gabungkan default content dengan data dari DB
                setContent({ ...DEFAULT_CONTENT, ...data.content_json as ContentData });
            } else {
                // Jika data tidak ditemukan, kita akan menggunakan DEFAULT_CONTENT
                setRecordId(null);
                setContent(DEFAULT_CONTENT);
            }
        } catch (err) {
            console.error("Error fetching content:", err);
            // Fallback ke default content saat terjadi error
            setContent(DEFAULT_CONTENT); 
        } finally {
            setIsLoading(false);
        }
    }, [sectionId]);

    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    // 2. FUNGSI UPDATE (dipanggil dari EditableText)
    const updateContent = useCallback(async (fieldName: string, newValue: string) => {
        const newContent = { ...content, [fieldName]: newValue };

        // Payload yang akan dikirim ke Supabase
        const payload = { content_json: newContent }; 

        try {
            if (recordId) {
                // UPDATE: Jika baris sudah ada
                const { error } = await supabase
                    .from('editable_content')
                    .update(payload)
                    .eq('id', recordId);

                if (error) throw error;
            } else {
                // INSERT: Jika baris belum ada (hanya terjadi sekali saat pertama kali edit)
                const insertPayload = { ...payload, section_name: sectionId };
                const { data, error } = await supabase
                    .from('editable_content')
                    .insert([insertPayload])
                    .select('id')
                    .single();

                if (error) throw error;
                
                // Simpan ID baris baru
                setRecordId(data.id); 
            }

            // Update state lokal setelah sukses
            setContent(newContent);
            console.log(`[SUPABASE] Successfully updated ${fieldName} in ${sectionId}.`);
            
        } catch (err) {
            console.error("Gagal menyimpan perubahan ke DB:", err);
            // Opsional: Tampilkan toast error di sini
        }
    }, [content, recordId, sectionId]); // Dependency pada content, recordId, dan sectionId

    return { content, isLoading, updateContent };
}