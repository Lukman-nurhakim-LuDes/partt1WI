// src/components/invitation/CountdownTimer.tsx

import React, { useState, useEffect } from 'react';
import { useFlipAnimation } from '../../hooks/useFlipAnimation'; 
import { useAdmin } from '@/context/AdminContext'; // Import AdminContext
import { Input } from '@/components/ui/input'; 
import { Button } from '@/components/ui/button';
import { Clock, Check } from 'lucide-react';

// --- Interfaces dan Helper Functions (TIDAK BERUBAH) ---

interface TimeLeft {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
}

interface CountdownTimerProps {
    // Target date bisa saja tidak disalurkan jika kita ambil dari state/DB
    // Namun kita tetap pertahankan untuk fleksibilitas
    targetDate?: string; 
}

const padToTwoDigits = (num: number): string => {
    return num.toString().padStart(2, '0');
};

// --- Custom Hook untuk Hitungan Mundur (TIDAK BERUBAH) ---
// ... (useCountdown sama seperti sebelumnya)

const useCountdown = (targetDate: string): TimeLeft => {
    // ... (logic useCountdown sama seperti sebelumnya)
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        days: '00', hours: '00', minutes: '00', seconds: '00',
    });
    
    const targetTime = new Date(targetDate).getTime();

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetTime - now;

            if (distance <= 0) {
                clearInterval(interval);
                setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft({
                days: padToTwoDigits(days),
                hours: padToTwoDigits(hours),
                minutes: padToTwoDigits(minutes),
                seconds: padToTwoDigits(seconds),
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate, targetTime]);

    return timeLeft;
};


// --- Komponen Flip Card Unit (TIDAK BERUBAH) ---
// ... (FlipCardUnit sama seperti sebelumnya)

interface FlipCardUnitProps {
    label: string;
    currentValue: string;
}

const FlipCardUnit: React.FC<FlipCardUnitProps> = ({ label, currentValue }) => {
    const { previousValue, isFlipping } = useFlipAnimation(currentValue);

    const [currentD1, currentD2] = currentValue.split('');
    const [prevD1, prevD2] = previousValue.split('');
    
    const digits = [
        { current: currentD1, prev: prevD1, id: 1 },
        { current: currentD2, prev: prevD2, id: 2 },
    ];
    
    return (
        <div className="flip-card-unit">
            <div className="flip-card-wrapper">
                {digits.map((digit) => (
                    <div 
                        key={digit.id} 
                        className={`digit-container ${isFlipping ? 'glow-gold' : ''}`}
                    >
                        {/* 1. Angka Statis (Nilai Saat Ini) */}
                        <span className="digit-top" data-content={digit.current}></span>
                        <span className="digit-bottom" data-content={digit.current}></span>

                        {/* 2. Kartu Flip (Hanya muncul saat isFlipping) */}
                        {isFlipping && (
                            <>
                                <span 
                                    className="flip-top animate-flip-top-out" 
                                    data-content={digit.prev}
                                ></span>
                                <span 
                                    className="flip-bottom animate-flip-bottom-in" 
                                    data-content={digit.current}
                                ></span>
                            </>
                        )}
                    </div>
                ))}
            </div>
            <span className="flip-card-label">{label}</span>
        </div>
    );
};


// --- Komponen Utama CountdownTimer (DIPERBARUI) ---

const DEFAULT_TARGET = "2026-06-25T10:00:00"; // Ganti dengan tanggal default yang masuk akal

const CountdownTimer: React.FC<CountdownTimerProps> = () => {
    const { isAdmin } = useAdmin();
    const [currentDate, setCurrentDate] = useState(DEFAULT_TARGET);
    const [editMode, setEditMode] = useState(false);
    const [tempDate, setTempDate] = useState(''); // State untuk input saat edit

    // Inisialisasi tanggal dari localStorage atau nilai default
    useEffect(() => {
        const storedDate = localStorage.getItem('weddingTargetDate');
        if (storedDate) {
            setCurrentDate(storedDate);
        }
    }, []);

    // Set tempDate saat mode edit diaktifkan
    useEffect(() => {
        if (editMode) {
            // Format tanggal untuk input type="datetime-local" (YYYY-MM-DDTHH:MM)
            const formattedDate = new Date(currentDate).toISOString().substring(0, 16);
            setTempDate(formattedDate);
        }
    }, [editMode, currentDate]);

    const handleSaveDate = () => {
        if (tempDate) {
            // Simpan format TANGGAL + WAKTU standar untuk perhitungan useCountdown
            const newDate = new Date(tempDate).toISOString().substring(0, 19); 
            setCurrentDate(newDate);
            localStorage.setItem('weddingTargetDate', newDate);
            setEditMode(false);
        }
    };
    
    const timeLeft = useCountdown(currentDate);

    const units = [
        { label: 'Hari', value: timeLeft.days, id: 'days' },
        { label: 'Jam', value: timeLeft.hours, id: 'hours' },
        { label: 'Menit', value: timeLeft.minutes, id: 'minutes' },
        { label: 'Detik', value: timeLeft.seconds, id: 'seconds' },
    ];

    return (
        <div className="countdown-container py-10 text-center relative"> 
            <h3 className="countdown-title animate-fade-in">Menghitung Mundur Hari Bahagia</h3>
            
            {/* === KONTROL EDIT ADMIN === */}
            {isAdmin && (
                <div className="absolute top-4 right-4 flex items-center gap-2 p-2 bg-gray-900/50 rounded-lg">
                    {editMode ? (
                        <>
                            <Input
                                type="datetime-local" // Input khusus untuk tanggal dan waktu
                                value={tempDate}
                                onChange={(e) => setTempDate(e.target.value)}
                                className="w-56 bg-white/10 border-gold text-white focus:ring-gold"
                            />
                            <Button onClick={handleSaveDate} className="bg-green-600 hover:bg-green-700 p-2 h-auto">
                                <Check className="w-5 h-5" />
                            </Button>
                        </>
                    ) : (
                        <Button onClick={() => setEditMode(true)} className="bg-gold hover:bg-gold/90 text-black p-2 h-auto">
                            <Clock className="w-5 h-5 mr-1" /> Edit Tanggal
                        </Button>
                    )}
                </div>
            )}
            
            {/* === TAMPILAN TIMER === */}
            <div className="timer-wrapper flex justify-center mt-5"> 
                {units.map((unit) => (
                    <FlipCardUnit
                        key={unit.id}
                        label={unit.label}
                        currentValue={unit.value}
                    />
                ))}
            </div>
        </div>
    );
};

export default CountdownTimer;