import React, { 
    createContext, 
    useContext, 
    useState, 
    useEffect, 
    ReactNode 
} from 'react';
// Pastikan path ini benar di proyek Anda.
import { supabase } from '@/integrations/supabase/client'; 
// PERBAIKAN: Menggunakan syntax import type yang benar
import type { Session } from '@supabase/supabase-js'; 

// --- Konfigurasi Admin (Dibaca dari .env) ---
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'lukmannrhkm80@gmail.com'; 

// --- Interface ---
interface AdminContextType {
    isAdmin: boolean;
    session: Session | null;
    loginAdmin: (password: string) => Promise<boolean>;
    logoutAdmin: () => Promise<void>;
    // Tambahkan loading state untuk mencegah tampilan berkedip
    isLoading: boolean; 
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// --- Provider Component ---
export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [session, setSession] = useState<Session | null>(null); 
    const [isLoading, setIsLoading] = useState(true);

    // 1. Cek Status Sesi Supabase Saat Aplikasi Dimuat
    useEffect(() => {
        // Dapatkan sesi awal
        supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
            setSession(initialSession);
            // Cek admin status berdasarkan sesi awal
            if (initialSession && initialSession.user.email === ADMIN_EMAIL) {
                setIsAdmin(true);
            }
            setIsLoading(false); // Selesai memuat sesi awal
        });

        // Dengarkan perubahan sesi (saat login/logout terjadi)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setSession(session);
                // Logika penentuan Admin
                const isCurrentUserAdmin = session && session.user.email === ADMIN_EMAIL;
                setIsAdmin(isCurrentUserAdmin);
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

        setIsLoading(true); // Mulai loading saat mencoba login

        // Memanggil Supabase Auth untuk membuat sesi authenticated
        const { error } = await supabase.auth.signInWithPassword({
            email: ADMIN_EMAIL, 
            password: passwordInput,
        });

        setIsLoading(false); // Selesai loading setelah percobaan

        if (error) {
            console.error("Login Supabase Gagal:", error.message);
            setIsAdmin(false);
            return false;
        }

        console.log("Login Admin Sukses. Sesi Supabase Dibuat.");
        return true;
    };


    // 3. Logika Logout Admin
    const logoutAdmin = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Logout Gagal:", error.message);
        } else {
            // onAuthStateChange akan mengurus set isAdmin(false)
            console.log("Logout Sukses.");
        }
    };
    
    // Tampilkan loading state penuh saat sesi sedang dimuat
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <span className="text-xl font-medium text-gold">Memuat sesi...</span>
            </div>
        );
    }

    return (
        <AdminContext.Provider value={{ isAdmin, session, loginAdmin, logoutAdmin, isLoading }}>
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