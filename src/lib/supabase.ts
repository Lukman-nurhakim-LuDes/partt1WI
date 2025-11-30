// src/lib/supabase.ts (VERSI KOREKSI AKHIR)

import { createClient } from '@supabase/supabase-js';

// Pastikan Anda membaca variabel dan menemukan string kosong jika hilang
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';

// PERBAIKAN DI SINI: Ubah nama variabel agar sesuai dengan .env Anda
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''; 

// Cek keamanan dan lemparkan error yang lebih jelas
if (!supabaseUrl || !supabaseAnonKey) {
  // Tambahkan logging yang lebih informatif di konsol
  throw new Error("Supabase URL and/or Public key are missing. Please check your .env file!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);