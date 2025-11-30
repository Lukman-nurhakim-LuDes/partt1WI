// src/components/EditableText.tsx (VERSI FINAL BEBAS ERROR DAN BERSIH)

import React, { useState, useRef, ReactNode } from 'react';
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
  
  const contentRef = useRef<HTMLElement | null>(null);

  const Tag = tagName;

  const handleBlur = () => {
    if (contentRef.current && isAdmin) {
      const newContent = contentRef.current.innerText.trim();
      onSave(newContent); 
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' && tagName !== 'div' && tagName !== 'textarea') {
      e.preventDefault(); 
      contentRef.current?.blur(); 
    }
  };
  
  // PERBAIKAN: Objek props diketik secara eksplisit
  const editableProps = {
    contentEditable: (isAdmin && isEditing ? "true" : "false") as "true" | "false",
    suppressContentEditableWarning: true,
    onBlur: handleBlur,
    onKeyDown: handleKeyPress,
    onClick: () => {
        if (isAdmin && !isEditing) setIsEditing(true);
    },
    // Tambahkan properti lain yang dibutuhkan, diketik sebagai any agar TS tidak bingung
    style: {} as any // Menambahkan style kosong agar TS tidak error pada properti style
  };

  // Tampilan dasar saat tidak di mode Admin
  if (!isAdmin) {
    return <Tag className={className}>{children}</Tag>;
  }

  // Tampilan saat di mode Admin
  return (
    <div className={`relative group inline-block ${className}`}>
      <Tag
        // PERBAIKAN: Gunakan contentRef dengan casting sederhana
        ref={contentRef as React.RefObject<HTMLElement>}
        
        // PERBAIKAN: Spread semua properti yang bisa diedit. Gunakan Casting pada Tag.
        {...editableProps}

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