import React, { useState } from 'react';
import { X, UploadCloud } from 'lucide-react';
// Asumsi: Anda menggunakan komponen Button dari direktori ini
// Jika error tetap ada, pastikan path './ui/button' sudah benar.
import { Button } from '@/components/ui/button'; 

interface UploadModalProps {
    onClose: () => void;
    // Fungsi upload yang menerima File dan data teks
    uploadFunction: (file: File, caption?: string, description?: string) => Promise<any>; 
    onUploadSuccess: () => void;
    section: 'story' | 'gallery';
    onDataRefresh: () => void; // <-- PROP KRITIS UNTUK REFRESH INSTAN
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, uploadFunction, onUploadSuccess, section, onDataRefresh }) => {
    
    const [file, setFile] = useState<File | null>(null);
    const [caption, setCaption] = useState('');
    const [description, setDescription] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError("Harap pilih file gambar terlebih dahulu.");
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            await uploadFunction(file, caption, description);
            
            // --- PERBAIKAN KRITIS: Panggil fungsi refresh di sini ---
            onDataRefresh(); // Memperbarui data di hook parent
            // -----------------------------------------------------

            onUploadSuccess(); // Menutup modal
            
        } catch (err: any) {
            console.error("Upload failed:", err);
            setError(`Gagal mengupload: ${err.message || "Terjadi kesalahan server."}`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-background rounded-lg p-6 w-full max-w-md shadow-2xl relative"
                onClick={(e) => e.stopPropagation()} // Mencegah klik di modal menutupnya
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-foreground/50 hover:text-foreground"
                >
                    <X className="w-6 h-6" />
                </button>
                
                <h2 className="text-2xl font-bold text-gold mb-6 font-['Playfair_Display']">
                    {section === 'story' ? "Tambah Foto Cerita" : "Tambah Foto Galeri"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Input File */}
                    <label className="block text-foreground/70 mb-2">Pilih Foto:</label>
                    <div className="border border-gold/30 p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gold/60 transition-colors">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                            disabled={isUploading}
                        />
                        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                            <UploadCloud className="w-8 h-8 text-gold mb-2" />
                            <span className="text-sm text-foreground/80">
                                {file ? file.name : "Klik untuk memilih file"}
                            </span>
                        </label>
                    </div>

                    {/* Input Caption (Hanya untuk Story) */}
                    {section === 'story' && (
                        <>
                            <div>
                                <label htmlFor="caption" className="block text-foreground/70 mb-1">Caption/Judul (Opsional):</label>
                                <input
                                    type="text"
                                    id="caption"
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    className="w-full p-2 border border-foreground/20 rounded bg-transparent text-foreground"
                                    disabled={isUploading}
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-foreground/70 mb-1">Deskripsi (Opsional):</label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full p-2 border border-foreground/20 rounded bg-transparent text-foreground"
                                    rows={3}
                                    disabled={isUploading}
                                />
                            </div>
                        </>
                    )}

                    {error && (
                        <p className="text-sm text-destructive mt-2">{error}</p>
                    )}

                    <Button 
                        type="submit" 
                        className="w-full bg-gold hover:bg-gold/80 text-black font-semibold"
                        disabled={isUploading || !file}
                    >
                        {isUploading ? 'Mengunggah...' : `Upload ke ${section === 'story' ? 'Cerita' : 'Galeri'}`}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default UploadModal;