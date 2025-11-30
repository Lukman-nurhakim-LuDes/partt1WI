import React, { useState, useRef, ReactNode, ElementType, useEffect } from 'react'; // Import useEffect
import { useAdmin } from '@/context/AdminContext'; 
import { Edit } from 'lucide-react';

interface EditableTextProps {
  children: ReactNode; 
  onSave: (newContent: string) => void; 
  tagName?: keyof JSX.IntrinsicElements; 
  className?: string; 
}

const EditableText: React.FC<EditableTextProps> = ({ children, onSave, tagName = 'span', className = '' }) => {
  const { isAdmin } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  
  // Ref untuk menampung elemen HTML generik
  // Kita harus menggunakan tipe HTMLElement, karena elemen yang dirender (Tag) bersifat dinamis.
  const contentRef = useRef<HTMLElement | null>(null);

  // Perubahan di sini: Menggunakan type casting untuk memastikan Tag dikenali sebagai komponen React yang valid
  const Tag = tagName as ElementType;

  // --- LOGIKA BARU: OTOMATIS FOCUS SAAT MODE EDIT AKTIF ---
  useEffect(() => {
    if (isEditing && contentRef.current) {
      // Pindahkan focus ke elemen agar pengguna dapat langsung mengetik
      contentRef.current.focus();
    }
  }, [isEditing]);
  // --------------------------------------------------------

  const handleBlur = () => {
    // Memastikan ref ada dan pengguna adalah Admin sebelum menyimpan
    // Panggil onSave hanya jika isAdmin benar
    if (contentRef.current && isAdmin) {
      const newContent = contentRef.current.innerText.trim();
      onSave(newContent); 
      setIsEditing(false); // Keluar dari mode editing setelah blur
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLElement>) => {
    // Mencegah baris baru saat Enter ditekan jika bukan div atau textarea
    if (e.key === 'Enter' && tagName !== 'div' && tagName !== 'textarea') {
      e.preventDefault(); 
      contentRef.current?.blur(); 
    }
  };

  // Tampilan dasar saat tidak di mode Admin
  // Di sini Tag akan berfungsi sebagai elemen HTML biasa (span, p, h1, dsb.)
  if (!isAdmin) {
    // Karena ini menggunakan dynamic JSX element, syntax ini sudah benar.
    return <Tag className={className}>{children}</Tag>;
  }

  // Tampilan saat di mode Admin
  return (
    <div className={`relative group inline-block ${className}`}>
      <Tag
        // 1. Ref menggunakan as any (solusi paling stabil untuk ref dinamis)
        // Ini diperlukan karena Tag adalah variabel dinamis, bukan string literal
        ref={contentRef as any}
        
        // 2. contentEditable diketik secara eksplisit
        // Menggunakan string "true" atau "false". Hanya true saat isEditing.
        contentEditable={isAdmin && isEditing ? "true" : "false"}
        
        // 3. Properti Event: Panggil handleBlur dan handleKeyPress
        onBlur={handleBlur}
        onKeyDown={handleKeyPress}
        
        // Mengaktifkan mode edit saat klik, hanya jika belum dalam mode edit
        onClick={() => {
            // Kita tidak perlu kondisi !isEditing di sini, karena focus akan otomatis
            // dipindahkan oleh useEffect di atas.
            setIsEditing(true);
        }}
        
        // 4. Properti Lain
        suppressContentEditableWarning={true}
        
        // Styling diterapkan di sini
        className={`focus:outline-none focus:ring-2 focus:ring-gold focus:bg-muted/30 p-1 rounded transition-all duration-200 cursor-text ${className}`}
      >
        {children}
      </Tag>

      {/* Tombol/Indikator Edit */}
      <Edit 
        className={`absolute top-0 right-[-20px] w-4 h-4 text-gold/70 cursor-pointer 
                   ${isEditing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        onClick={() => setIsEditing(true)}
      />
    </div>
  );
};

export default EditableText;