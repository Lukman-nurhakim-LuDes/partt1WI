import React, { useState, useRef, ReactNode, ElementType } from 'react';
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

  const handleBlur = () => {
    // Memastikan ref ada dan pengguna adalah Admin sebelum menyimpan
    if (contentRef.current && isAdmin) {
      const newContent = contentRef.current.innerText.trim();
      onSave(newContent); 
      setIsEditing(false);
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
    // Catatan: Anda dapat menggunakan <Tag as="span" /> jika Anda menggunakan styled-components atau library serupa.
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
        // Menggunakan string "true" atau "false"
        contentEditable={isAdmin && isEditing ? "true" : "false"}
        
        // 3. Properti Event: Menghapus "as any" yang tidak perlu
        // Tipe sudah diinferensi dengan benar melalui ref dan React.KeyboardEvent
        onBlur={handleBlur}
        onKeyDown={handleKeyPress}
        
        // Sintaks ini sudah diperbaiki sebelumnya
        onClick={() => {
            if (isAdmin && !isEditing) setIsEditing(true);
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