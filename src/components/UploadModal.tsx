// src/components/UploadModal.tsx

import React, { useState } from 'react';
import { X, Upload, Image } from 'lucide-react';
import { useUploadPhoto } from '@/hooks/useUploadPhoto'; // Tidak digunakan di sini, tapi di PhotoStorySection

// Props untuk komponen modal
interface UploadModalProps {
    onClose: () => void;
    // Menerima fungsi upload dari hook yang memanggil
    uploadFunction: (file: File, caption?: string, description?: string) => Promise<any>; 
    onUploadSuccess: () => void;
    section: 'story' | 'gallery'; // Prop untuk label/konteks
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, uploadFunction, onUploadSuccess, section }) => {
    
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [caption, setCaption] = useState(''); // State untuk caption (metadata)
    

    // --- Handling Input File ---
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUploadError(null);
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (!file.type.startsWith('image/')) {
                setUploadError("Format file tidak didukung. Harap unggah file gambar.");
                setFileToUpload(null);
                return;
            }
            setFileToUpload(file);
        } else {
            setFileToUpload(null);
        }
    };

    // --- Handling Submission ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fileToUpload) {
            setUploadError("Silakan pilih file untuk diunggah.");
            return;
        }

        setIsUploading(true);
        setUploadError(null);

        try {
            // Panggil fungsi upload yang dilewatkan dari parent
            await uploadFunction(fileToUpload, caption); // Melewatkan caption
            onUploadSuccess();
        } catch (err: any) {
            console.error("Upload failed:", err);
            setUploadError(err.message || "Gagal mengunggah foto. Cek konsol.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        // Modal Overlay
        <div 
            className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 transition-opacity duration-300"
            onClick={onClose}
        >
            {/* Modal Content */}
            <div 
                className="bg-background border border-gold/30 rounded-xl max-w-lg w-full p-8 shadow-2xl relative animate-zoom-in"
                onClick={(e) => e.stopPropagation()} 
            >
                <button
                    className="absolute top-4 right-4 text-gold hover:text-white transition-colors"
                    onClick={onClose}
                    disabled={isUploading}
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center space-y-2 mb-6">
                    <Image className="w-10 h-10 text-gold mx-auto" />
                    <h3 className="text-2xl font-bold text-gold">Unggah Foto {section === 'story' ? 'Cerita' : 'Galeri'}</h3>
                    <p className="text-sm text-foreground/70">Tambahkan gambar baru ke bagian {section}.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Input File */}
                    <label className="block">
                        <span className="text-sm text-gold block mb-1">Pilih File Gambar *</span>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleFileChange} 
                            className="block w-full text-sm text-foreground/80
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-gold/20 file:text-gold
                                hover:file:bg-gold/30 transition-colors"
                            disabled={isUploading}
                        />
                    </label>
                    
                    {/* Input Caption (Berguna untuk Storytelling) */}
                    <label className="block">
                        <span className="text-sm text-gold block mb-1">Caption / Judul Singkat</span>
                        <input 
                            type="text" 
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Contoh: Saat Lamaran"
                            className="w-full p-2 bg-background border border-gold/30 rounded-md text-foreground"
                            disabled={isUploading}
                        />
                    </label>


                    {/* Pratinjau File yang Dipilih */}
                    {fileToUpload && (
                        <div className="text-sm text-foreground/90 flex items-center gap-2 p-3 bg-gold/10 rounded-lg">
                            <Image className="w-4 h-4 text-gold" />
                            File siap unggah: <span className="font-medium truncate">{fileToUpload.name}</span>
                        </div>
                    )}
                    
                    {/* Pesan Error */}
                    {uploadError && (
                        <p className="text-sm text-destructive bg-destructive/10 p-2 rounded-lg">{uploadError}</p>
                    )}
                    
                    {/* Tombol Unggah */}
                    <button
                        type="submit"
                        disabled={!fileToUpload || isUploading}
                        className="w-full flex items-center justify-center gap-2 bg-gold text-black px-4 py-2 rounded-lg font-semibold hover:bg-gold/80 transition-colors disabled:opacity-50"
                    >
                        {isUploading ? (
                            <>
                                <span className="animate-spin h-5 w-5 border-t-2 border-b-2 border-black rounded-full"></span>
                                Mengunggah...
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5" /> Unggah Foto
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadModal;