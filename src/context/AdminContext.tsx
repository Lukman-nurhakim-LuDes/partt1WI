// src/context/AdminContext.tsx

import React, { 
    createContext, 
    useContext, 
    useState, 
    useEffect, 
    ReactNode 
} from 'react';
import { supabase } from '@/integrations/supabase/client'; // Lokasi klien Supabase yang sudah benar
import type { Session } from '@supabase/supabase-js'; // Menggunakan Session type yang benar

// --- Konfigurasi Admin (Dibaca dari .env) ---
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'lukmannrhkm80@gmail.com'; 
// Asumsi VITE_ADMIN_PASSWORD ada di .env dan dibaca oleh logika loginAdmin
// Kita tidak perlu mendeklarasikannya di sini karena hanya digunakan di fungsi login

// --- Interface ---
interface AdminContextType {
    isAdmin: boolean;
    session: Session | null;
    loginAdmin: (password: string) => Promise<boolean>;
    logoutAdmin: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// --- Provider Component ---
export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [session, setSession] = useState<Session | null>(null); 
    const [loading, setLoading] = useState(true);

    // 1. Cek Status Sesi Supabase Saat Aplikasi Dimuat
    useEffect(() => {
        // Cek sesi yang ada di localStorage
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            // Jika ada sesi, dan emailnya cocok dengan admin, set isAdmin
            if (session && session.user.email === ADMIN_EMAIL) {
                setIsAdmin(true);
            }
            setLoading(false);
        });

        // Dengarkan perubahan sesi (misalnya setelah login/logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setSession(session);
                // Hanya set isAdmin jika sesi ada DAN email cocok
                if (session && session.user.email === ADMIN_EMAIL) {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);


    // 2. Logika Login Admin (Menggunakan Password dari Input User)
    const loginAdmin = async (passwordInput: string): Promise<boolean> => {
        
        if (!ADMIN_EMAIL) {
            console.error("VITE_ADMIN_EMAIL tidak ditemukan. Gagal login.");
            return false;
        }

        // Memanggil Supabase Auth untuk membuat sesi authenticated
        const { error } = await supabase.auth.signInWithPassword({
            email: ADMIN_EMAIL, 
            password: passwordInput,
        });

        if (error) {
            console.error("Login Supabase Gagal:", error.message);
            setIsAdmin(false);
            return false;
        }

        // Jika berhasil, onAuthStateChange akan mengurus setSession dan setIsAdmin(true)
        console.log("Login Admin Sukses. Sesi Supabase Dibuat.");
        return true;
    };


    // 3. Logika Logout Admin
    const logoutAdmin = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Logout Gagal:", error.message);
        } else {
            // onAuthStateChange akan set setIsAdmin(false)
            console.log("Logout Sukses.");
        }
    };
    
    // Tampilkan loading state
    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Memuat sesi...</div>;
    }

    return (
        <AdminContext.Provider value={{ isAdmin, session, loginAdmin, logoutAdmin }}>
            {children}
        </AdminContext.Provider>
    );
};

// Hook untuk menggunakan konteks
export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};