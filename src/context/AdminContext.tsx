// src/context/AdminContext.tsx

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase'; 

// --- Interfaces ---
interface AdminContextType {
  isAdmin: boolean;
  loginAdmin: (password: string) => Promise<boolean>; 
  logoutAdmin: () => void;
}

// --- Context ---
const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Ambil variables dari ENV
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'lukmannrhkm80@gmail.com'; 
const ADMIN_PASSWORD_LOCAL = import.meta.env.VITE_ADMIN_PASSWORD || 'Lukmannr24'; 

// --- Provider Component ---
interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false); 

  // Load state dan Periksa sesi Supabase
  useEffect(() => {
    // 1. Load dari Local Storage
    const saved = localStorage.getItem('isAdminMode');
    if (saved === 'true') {
        setIsAdmin(true); 
    }
    
    // 2. Verifikasi sesi Supabase saat start
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAdmin(true);
      }
    });
  }, []);

  // Simpan state ke Local Storage
  useEffect(() => {
    localStorage.setItem('isAdminMode', isAdmin.toString());
  }, [isAdmin]);

  // --- FUNGSI LOGIN ADMIN ASINKRONUS ---
  const loginAdmin = useCallback(async (password: string): Promise<boolean> => {
    
    // 1. Cek Password Lokal (Gate Cepat)
    if (password !== ADMIN_PASSWORD_LOCAL) {
      return false;
    }
    
    // 2. Login ke Supabase Auth
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: ADMIN_EMAIL, 
            password: password,
        });

        if (error) throw error;

        // 3. Jika Sukses
        if (data.session) {
            setIsAdmin(true);
            return true;
        }

        return false;

    } catch (error: any) {
        console.error("Supabase Login Error:", error.message);
        return false;
    }
    
  }, [ADMIN_EMAIL, ADMIN_PASSWORD_LOCAL]);

  const logoutAdmin = useCallback(async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, loginAdmin, logoutAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

// --- Custom Hook ---
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};