// src/hooks/useUploadPhoto.ts

import { supabase } from '@/lib/Client';
import { useAdmin } from '@/context/AdminContext';

export const useUploadPhoto = (section: 'story' | 'gallery') => {
    const { isAdmin } = useAdmin();

    const uploadAndInsertPhoto = async (file: File, caption: string = '', description: string = '') => {
        if (!isAdmin) {
            throw new Error("Akses ditolak. Silakan login sebagai administrator.");
        }
        
        // 1. Tentukan path unik di Supabase Storage
        const filePath = `${section}/${Date.now()}_${file.name}`;
        
        // 2. Upload file ke Storage Bucket 'wedding_assets'
        const { data: storageData, error: storageError } = await supabase.storage
            .from('wedding_assets') // Pastikan nama bucket Anda adalah 'wedding_assets'
            .upload(filePath, file);

        if (storageError) {
            throw new Error(`Gagal upload file: ${storageError.message}`);
        }

        // 3. Dapatkan URL publik
        const publicURL = supabase.storage
            .from('wedding_assets')
            .getPublicUrl(filePath).data.publicUrl;

        // 4. Hitung order_index baru (asumsi order_index = count + 1)
        const { count } = await supabase
            .from('dynamic_photos')
            .select('*', { count: 'exact' })
            .eq('section', section);

        const newOrderIndex = (count || 0) + 1;

        // 5. Simpan URL dan metadata ke tabel dynamic_photos
        const { data: insertData, error: insertError } = await supabase
            .from('dynamic_photos')
            .insert([{ 
                src: publicURL, 
                section: section, 
                caption: caption,
                description: description,
                order_index: newOrderIndex
            }])
            .select();

        if (insertError) {
            // Jika insert gagal, coba hapus file dari storage (cleanup)
            await supabase.storage.from('wedding_assets').remove([filePath]);
            throw new Error(`Gagal menyimpan data foto: ${insertError.message}`);
        }

        return insertData[0]; // Mengembalikan objek foto yang baru dibuat
    };

    return { uploadAndInsertPhoto };
};