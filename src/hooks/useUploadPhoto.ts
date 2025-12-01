// src/hooks/useUploadPhoto.ts

import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/context/AdminContext';

// Import type yang diperlukan
// KOREKSI UTAMA: Kita memerlukan Tables dan TablesInsert
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

// Definisikan tipe untuk data row dan data insert yang sesuai
type DynamicPhotoRow = Tables<'dynamic_photos'>;
// FIX: DynamicPhotoInsert harus menggunakan TablesInsert untuk payload writeable
type DynamicPhotoInsert = TablesInsert<'dynamic_photos'>; 


export const useUploadPhoto = (section: 'story' | 'gallery') => {
    const { isAdmin } = useAdmin();

    const uploadAndInsertPhoto = async (file: File, caption: string = '', description: string = '') => {
        if (!isAdmin) {
            // Error ini akan diatasi jika admin sudah login (RLS)
            throw new Error("Akses ditolak. Silakan login sebagai administrator.");
        }
        
        // 1. Tentukan path unik di Supabase Storage
        const filePath = `${section}/${Date.now()}_${file.name}`;
        
        // 2. Upload file ke Storage Bucket 'wedding_assets'
        const { error: storageError } = await supabase.storage
            .from('wedding_assets')
            .upload(filePath, file);

        if (storageError) {
            throw new Error(`Gagal upload file ke Storage: ${storageError.message}`);
        }

        // 3. Dapatkan URL publik
        const { data: publicUrlData } = supabase.storage
            .from('wedding_assets')
            .getPublicUrl(filePath);
            
        const publicURL = publicUrlData.publicUrl;

        // 4. Hitung order_index baru (asumsi order_index = count + 1)
        const { count, error: countError } = await supabase
            .from('dynamic_photos')
            .select(null, { count: 'exact', head: true }) 
            .eq('section', section);
            
        if (countError) {
             await supabase.storage.from('wedding_assets').remove([filePath]);
             throw new Error(`Gagal menghitung urutan foto: ${countError.message}`);
        }

        const newOrderIndex = (count || 0) + 1;

        // 5. Siapkan payload untuk Insert
        // Garis merah hilang karena type DynamicPhotoInsert kini menggunakan TablesInsert
        const insertPayload: DynamicPhotoInsert = {
            src: publicURL, 
            section: section, 
            caption: caption,
            description: description,
            order_index: newOrderIndex
        };
        
        // 6. Simpan URL dan metadata ke tabel dynamic_photos
        const { data: insertData, error: insertError } = await supabase
            .from('dynamic_photos')
            .insert([insertPayload])
            .select()
            .returns<DynamicPhotoRow>() // Gunakan returns untuk Type Safety
            .single(); 

        if (insertError) {
            // Jika insert gagal, hapus file dari storage (cleanup)
            await supabase.storage.from('wedding_assets').remove([filePath]);
            throw new Error(`Gagal menyimpan data foto ke database: ${insertError.message}`);
        }

        // Mengembalikan objek foto yang baru dibuat
        return insertData; 
    };

    return { uploadAndInsertPhoto };
};