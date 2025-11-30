// src/lib/supabase.ts (Perbaikan Final)

import { createClient } from '@supabase/supabase-js';

// Pastikan Anda membaca variabel dan menyediakan string kosong jika hilang
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''; 
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLIC_KEY || ''; 

// Cek keamanan dan lemparkan error yang lebih jelas
if (!supabaseUrl || !supabaseAnonKey) {
    // Ini akan menampilkan pesan error yang lebih informatif di konsol
    throw new Error("Supabase URL and/or Public Key are missing. Please check your .env file!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);