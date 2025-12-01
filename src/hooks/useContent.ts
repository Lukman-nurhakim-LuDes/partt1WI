// src/hooks/useContent.ts (Versi Final Bebas Error Supabase SDK)

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client'; 
import type { Json, Tables, TablesInsert } from '@/integrations/supabase/types'; 

// --- Type Safety ---
interface ContentData {
    title: string;
    description: string;
    quote: string;
    [key: string]: string; 
}
// Type untuk baris dari tabel editable_content
type EditableContentRow = Tables<'editable_content'>;
type EditableContentInsert = TablesInsert<'editable_content'>;


interface UseContentResult {
    content: ContentData;
    isLoading: boolean;
    updateContent: (fieldName: string, newValue: string) => Promise<void>;
}

const WELCOME_SECTION_ID = 'welcome_section'; 

const DEFAULT_CONTENT: ContentData = {
    title: "Selamat Datang",
    description: "Dengan penuh kebahagiaan dan kehormatan, kami mengundang Anda untuk berbagi momen istimewa bersama kami dalam perayaan yang penuh keajaiban dan keanggunan.",
    quote: "Setiap momen berharga dimulai dengan undangan untuk bersama",
};


export default function useContent(sectionId: string = WELCOME_SECTION_ID): UseContentResult {
    const [content, setContent] = useState<ContentData>(DEFAULT_CONTENT);
    const [isLoading, setIsLoading] = useState(true);
    
    // State untuk menampung ID baris yang ditemukan
    const [recordId, setRecordId] = useState<string | null>(null);

    // 1. FUNGSI FETCH
    const fetchContent = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('editable_content')
                .select('id, content_json')
                .eq('section_name', sectionId)
                .single();

            if (error && error.code !== 'PGRST116') {
                throw error;
            }

            if (data && data.content_json) {
                setRecordId(data.id); 
                setContent({ 
                    ...DEFAULT_CONTENT, 
                    ...(data.content_json as ContentData) 
                });
            } else {
                setRecordId(null);
                setContent(DEFAULT_CONTENT);
            }
        } catch (err: any) {
            console.error("Error fetching content:", err.message);
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
        // 1. Hitung state baru secara lokal
        const newContent = { ...content, [fieldName]: newValue };
        
        // Siapkan payload (untuk UPDATE)
        const payload: Partial<EditableContentInsert> = { 
            content_json: newContent as unknown as Json 
        }; 

        try {
            if (recordId) {
                // UPDATE: Jika baris sudah ada
                const { error } = await supabase
                    .from('editable_content')
                    .update(payload)
                    .eq('id', recordId);

                if (error) throw error;
            } else {
                // INSERT: Jika baris belum ada

                // Payload lengkap untuk INSERT
                const initialInsertPayload: EditableContentInsert = {
                    content_json: newContent as unknown as Json,
                    section_name: sectionId 
                };
                
                // PERBAIKAN: Hapus .returns().single() yang menyebabkan error
                const { data: insertedRows, error: insertError } = await supabase
                    .from('editable_content')
                    .insert([initialInsertPayload])
                    .select('id'); // Supabase mengembalikan array of objects

                if (insertError) throw insertError;

                // Ambil ID dari array hasil (index 0)
                if (insertedRows && insertedRows.length > 0) { 
                    setRecordId(insertedRows[0].id); 
                } else {
                    console.error("Data inserted but no ID returned from database.");
                }
            }

            // Update state lokal setelah sukses
            setContent(newContent);
            console.log(`[SUPABASE] Successfully updated ${fieldName} in ${sectionId}.`);
            
        } catch (err: any) {
            console.error("Gagal menyimpan perubahan ke DB:", err.message);
        }
    }, [content, recordId, sectionId]); 

    return { content, isLoading, updateContent };
}