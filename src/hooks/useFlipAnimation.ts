import { useState, useEffect } from 'react';

// Hook untuk mengelola state nilai sebelumnya dan status flipping
export const useFlipAnimation = (currentValue: string) => {
    const [previousValue, setPreviousValue] = useState(currentValue);
    const [isFlipping, setIsFlipping] = useState(false);

    useEffect(() => {
        // Hanya membandingkan jika nilai saat ini sudah terinisialisasi
        if (currentValue === '00') {
            setPreviousValue(currentValue);
            return;
        }

        if (currentValue !== previousValue) {
            // Nilai berubah, picu animasi
            setIsFlipping(true);
            
            // Atur nilai sebelumnya ke nilai saat ini sebelum animasi berakhir
            // agar transisi berikutnya berjalan lancar
            setTimeout(() => {
                setPreviousValue(currentValue);
                // Matikan status flipping setelah durasi animasi (0.6 detik)
                setIsFlipping(false); 
            }, 600); // Harus sesuai dengan durasi animasi CSS (0.6s)
        }
        
        // Cleanup function jika komponen dilepas
        // Jangan reset state previousValue di sini, karena akan menyebabkan flicker
        return () => {};

    }, [currentValue, previousValue]);

    return { previousValue, isFlipping };
};