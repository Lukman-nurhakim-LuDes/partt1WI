// src/components/AdminToggle.tsx

import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext'; // Sesuaikan path
import { Settings, Lock, Unlock, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button'; 
import { Input } from '@/components/ui/input';   

const AdminToggle: React.FC = () => {
  const { isAdmin, loginAdmin, logoutAdmin } = useAdmin();
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const handleLoginAttempt = () => {
    if (loginAdmin(password)) {
      setShowPasswordField(false);
      setPassword('');
      setLoginError(false);
    } else {
      setLoginError(true);
      setPassword(''); 
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setShowPasswordField(false);
    setPassword('');
    setLoginError(false);
  };

  const isDevelopment = import.meta.env.DEV; 
  const alwaysShowToggle = isAdmin || isDevelopment; 

  if (!alwaysShowToggle) {
    return null; 
  }

  const baseClasses = "fixed bottom-6 left-6 z-[999] p-2 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2";
  const activeClasses = "bg-primary glow-gold border border-gold text-primary-foreground";
  const inactiveClasses = "bg-muted/70 border border-muted-foreground/50 text-gold hover:bg-muted";

  return (
    <div className={isAdmin ? `${baseClasses} ${activeClasses}` : `${baseClasses} ${inactiveClasses}`}>
      
      {/* Tombol Utama Toggle / Logout */}
      <button 
        onClick={() => {
          if (isAdmin) {
            handleLogout(); 
          } else {
            setShowPasswordField(prev => !prev);
            setLoginError(false); // Reset error saat membuka input
          }
        }}
        className="w-8 h-8 flex items-center justify-center"
        aria-label={isAdmin ? "Logout Admin" : "Login Admin"}
      >
        {isAdmin ? <LogOut className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
      </button>

      {/* Teks status */}
      <span className="text-sm font-semibold pr-2 hidden md:block">
        {isAdmin ? 'ADMIN MODE' : 'VIEW MODE'}
      </span>
      
      {/* Input Password */}
      {!isAdmin && showPasswordField && (
        <div className="flex items-center gap-2 ml-2">
          <Input 
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setLoginError(false); 
            }}
            onKeyPress={(e) => {
                if (e.key === 'Enter') handleLoginAttempt();
            }}
            className={`w-40 bg-card border ${loginError ? 'border-destructive' : 'border-gold/50'} text-foreground text-sm focus:ring-gold focus:border-gold`}
          />
          <Button onClick={handleLoginAttempt} className="bg-gold text-black hover:bg-gold/90">
            <Unlock className="w-4 h-4" />
          </Button>
          {loginError && <span className="text-destructive text-xs ml-1">Password salah!</span>}
        </div>
      )}
    </div>
  );
};

export default AdminToggle;