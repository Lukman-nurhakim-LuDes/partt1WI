import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

// Tipe untuk struktur data yang kita harapkan
interface ContentMap {
    [key: string]: string;
}

interface UseContentResult {
    content: ContentMap;
    isLoading: boolean;
    updateContent: (fieldName: string, newValue: string) => Promise<void>;
}

// Nama baris (record) di tabel editable_content yang akan kita gunakan
const CONTENT_RECORD_ID = 'welcome_section'; 

export default function useContent(): UseContentResult {
    // State untuk menyimpan semua konten (title, description, quote)
    const [content, setContent] = useState<ContentMap>({});
    const [isLoading, setIsLoading] = useState(true);

    // 1. FUNGSI FETCH: Mengambil data dari Supabase
    const fetchContent = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('editable_content')
                // Kolom yang diambil: id dan content_json
                .select('id, content_json')
                .eq('section_name', CONTENT_RECORD_ID)
                .single(); // Mengambil hanya satu baris

            if (error && error.code !== 'PGRST116') { // PGRST116 = Baris tidak ditemukan
                throw error;
            }

            if (data && data.content_json) {
                // Supabase menyimpan JSONB, kita parse isinya
                setContent(data.content_json as ContentMap);
            } else {
                // Jika baris tidak ditemukan, inisialisasi dengan nilai default (opsional)
                setContent({}); 
            }
        } catch (err: any) {
            console.error("Error fetching editable content:", err.message);
            // Tetap set state ke default agar aplikasi tidak macet
            setContent({}); 
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 2. FUNGSI UPDATE: Menyimpan perubahan ke Supabase
    const updateContent = async (fieldName: string, newValue: string) => {
        // Optimistic UI Update: Update state lokal terlebih dahulu
        const newContent = { ...content, [fieldName]: newValue };
        setContent(newContent); 

        try {
            // Cek apakah baris konten sudah ada (diasumsikan kita selalu punya satu record)
            const { data: existingData } = await supabase
                .from('editable_content')
                .select('id, content_json')
                .eq('section_name', CONTENT_RECORD_ID)
                .single();

            // Payload baru menggabungkan konten lama dan baru
            const updatedJson = { 
                ...(existingData?.content_json as ContentMap || {}),
                [fieldName]: newValue 
            };
            
            if (existingData) {
                // Jika sudah ada: UPDATE record yang ada
                await supabase
                    .from('editable_content')
                    .update({ content_json: updatedJson, updated_at: new Date().toISOString() })
                    .eq('id', existingData.id);
            } else {
                // Jika belum ada: INSERT record baru
                await supabase
                    .from('editable_content')
                    .insert([{ section_name: CONTENT_RECORD_ID, content_json: updatedJson }]);
            }

            console.log(`[Supabase] Field '${fieldName}' updated successfully.`);

        } catch (err: any) {
            console.error("Error updating editable content:", err.message);
            // Rollback UI (opsional, untuk kesederhanaan kita abaikan)
            alert(`Gagal menyimpan perubahan untuk ${fieldName}. Cek konsol.`);
        }
    };

    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    return { content, isLoading, updateContent };
}