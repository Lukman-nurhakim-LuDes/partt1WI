import { createClient } from '@supabase/supabase-js';

// src/lib/supabase.ts

// Memastikan kode membaca variabel dengan nama yang baru: VITE_SUPABASE_PUBLIC_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
// DIGANTI: Menggunakan VITE_SUPABASE_PUBLIC_KEY
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLIC_KEY || ''; 

// Cek keamanan dan lemparkan error yang lebih jelas
if (!supabaseUrl || !supabaseAnonKey) {
  // Tambahkan logging yang lebih informatif di konsol
  console.error("Missing Supabase environment variables.");
  console.error(`URL Found: ${!!supabaseUrl}, Key Found: ${!!supabaseAnonKey}`);
  throw new Error("Supabase URL and/or Public key are missing. Please check your .env file!");
}

// Inisialisasi Klien
export const supabase = createClient(supabaseUrl, supabaseAnonKey);