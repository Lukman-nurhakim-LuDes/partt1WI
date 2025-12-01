import React, { useState, useRef, ReactNode, ElementType, useEffect } from 'react';
// IMPORT ASLI DIKEMBALIKAN karena path di seluruh proyek sudah diperbaiki
import { useAdmin } from '@/context/AdminContext'; 
import { Edit } from 'lucide-react';


interface EditableTextProps {
  /** Konten yang akan ditampilkan (string atau elemen) */
  children: ReactNode; 
  /** Handler yang dipanggil saat konten disimpan (saat blur) */
  onSave: (newContent: string) => void; 
  /** Elemen HTML yang digunakan (misalnya 'span', 'p', 'h1', 'div') */
  tagName?: keyof JSX.IntrinsicElements; 
  /** Kelas CSS tambahan dari Tailwind untuk styling konten */
  className?: string; 
}

/**
 * Komponen pembungkus yang memungkinkan konten teks diedit langsung
 * hanya jika pengguna berada dalam mode Admin.
 */
const EditableText: React.FC<EditableTextProps> = ({ children, onSave, tagName = 'span', className = '' }) => {
  // Menggunakan hook yang sesungguhnya
  const { isAdmin } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  
  // Ref untuk menampung elemen HTML generik.
  const contentRef = useRef<HTMLElement | null>(null);

  // Menggunakan type casting untuk memastikan Tag dikenali sebagai komponen React yang valid
  const Tag = tagName as ElementType;

  // LOGIKA: Otomatis fokus ke elemen saat mode edit aktif
  useEffect(() => {
    if (isEditing && contentRef.current) {
      // Set fokus dan pilih seluruh teks di dalamnya
      contentRef.current.focus();
      // Untuk memastikan teks terpilih
      document.execCommand('selectAll', false, undefined); 
    }
  }, [isEditing]);

  const handleBlur = () => {
    // Memastikan ref ada dan pengguna adalah Admin sebelum menyimpan
    if (contentRef.current && isAdmin) {
      const newContent = contentRef.current.innerText.trim();
      // Hanya panggil onSave jika konten tidak kosong
      if (newContent !== '') {
        onSave(newContent); 
      }
      setIsEditing(false); // Keluar dari mode editing setelah blur
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLElement>) => {
    // Mencegah baris baru saat Enter ditekan kecuali untuk div atau textarea
    if (e.key === 'Enter' && tagName !== 'div' && tagName !== 'textarea') {
      e.preventDefault(); 
      contentRef.current?.blur(); // Panggil blur untuk menyimpan dan keluar dari mode edit
    }
  };

  // Tampilan dasar saat tidak di mode Admin
  if (!isAdmin) {
    return <Tag className={className}>{children}</Tag>;
  }

  // Tampilan saat di mode Admin
  return (
    // Gunakan inline-block agar lebar div hanya selebar kontennya. 
    <div className={`relative group inline-block`}> 
      <Tag
        // Ref menggunakan as any (solusi paling stabil untuk ref dinamis di React)
        ref={contentRef as any}
        
        // Hanya contentEditable="true" saat isEditing.
        contentEditable={isAdmin && isEditing ? "true" : "false"}
        
        onBlur={handleBlur}
        onKeyDown={handleKeyPress}
        
        // Masuk mode edit saat klik pada Tag (useEffect akan menangani fokus)
        onClick={() => setIsEditing(true)}
        
        suppressContentEditableWarning={true}
        
        // Styling diterapkan di sini, termasuk className dari prop
        className={`focus:outline-none focus:ring-2 focus:ring-gold focus:bg-muted/30 p-1 rounded transition-all duration-200 cursor-text ${className}`}
      >
        {children}
      </Tag>

      {/* Tombol/Indikator Edit - Muncul saat hover (group-hover:opacity-100) atau saat editing (opacity-100) */}
      <Edit 
        className={`absolute top-0 right-[-20px] w-4 h-4 text-gold/70 cursor-pointer 
                    ${isEditing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        onClick={() => setIsEditing(true)}
      />
    </div>
  );
};

export default EditableText;