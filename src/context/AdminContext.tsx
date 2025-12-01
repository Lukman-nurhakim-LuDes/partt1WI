import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// --- Interfaces ---
interface AdminContextType {
  isAdmin: boolean;
  loginAdmin: (password: string) => Promise<boolean>; 
  logoutAdmin: () => void;
}

// --- Context ---
const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Ambil variables dari ENV
// Catatan: Pastikan key VITE_ADMIN_EMAIL dan VITE_ADMIN_PASSWORD ada di file .env Anda.
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
      } else if (saved === 'true') {
         // Jika localStorage aktif tetapi sesi Supabase hilang, matikan mode Admin
         setIsAdmin(false);
         localStorage.removeItem('isAdminMode');
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
      console.warn("Login attempt failed: Local password mismatch.");
      return false;
    }
    
    // 2. Login ke Supabase Auth
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: ADMIN_EMAIL, 
            password: password,
        });

        if (error) {
           console.error("Supabase Login Error:", error.message);
           throw error; // Lemparkan error agar ditangkap di block catch
        }

        // 3. Jika Sukses
        if (data.session) {
            setIsAdmin(true);
            return true;
        }

        return false;

    } catch (error: any) {
        console.error("Login failed:", error.message || "Unknown error during Supabase sign-in.");
        return false;
    }
    
  }, [ADMIN_EMAIL, ADMIN_PASSWORD_LOCAL]);

  const logoutAdmin = useCallback(async () => {
    try {
        await supabase.auth.signOut();
        setIsAdmin(false);
        console.log("Logged out successfully.");
    } catch (error) {
        console.error("Logout error:", error);
    }
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