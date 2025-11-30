import React, { useState, useEffect } from 'react';
import { useFlipAnimation } from '../../hooks/useFlipAnimation'; // Sesuaikan path jika perlu
// import './CountdownTimer.css'; // Komentar ini bisa dihapus jika Anda tidak menggunakan file CSS terpisah

// --- Interfaces dan Helper Functions ---

interface TimeLeft {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
}

interface CountdownTimerProps {
    targetDate: string; // Tanggal target: 'YYYY-MM-DDTHH:MM:SS'
}

const padToTwoDigits = (num: number): string => {
    return num.toString().padStart(2, '0');
};

// --- Custom Hook untuk Hitungan Mundur ---

const useCountdown = (targetDate: string): TimeLeft => {
    // Inisialisasi state awal
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
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

// --- Komponen Flip Card Unit ---

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
    
    // Perhatikan: getFlipClass tidak digunakan jika Anda mengandalkan isFlipping langsung di JSX
    
    return (
        <div className="flip-card-unit">
            <div className="flip-card-wrapper">
                {digits.map((digit, index) => (
                    <div 
                        key={digit.id} 
                        // Tambahkan glow-gold saat flipping
                        className={`digit-container ${isFlipping ? 'glow-gold' : ''}`}
                    >
                        {/* 1. Angka Statis (Belum Flip/Nilai Lama) */}
                        <span className="digit-top" data-content={digit.current}></span>
                        <span className="digit-bottom" data-content={digit.current}></span>

                        {/* 2. Kartu Flip (Hanya muncul saat isFlipping) */}
                        {isFlipping && (
                            <>
                                {/* Kartu yang melipat ke bawah: Tampilkan nilai lama */}
                                <span 
                                    className="flip-top animate-flip-top-out" 
                                    data-content={digit.prev}
                                ></span>
                                {/* Kartu yang muncul dari bawah: Tampilkan nilai baru */}
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


// --- Komponen Utama CountdownTimer ---

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
    const timeLeft = useCountdown(targetDate);

    const units = [
        { label: 'Hari', value: timeLeft.days, id: 'days' },
        { label: 'Jam', value: timeLeft.hours, id: 'hours' },
        { label: 'Menit', value: timeLeft.minutes, id: 'minutes' },
        { label: 'Detik', value: timeLeft.seconds, id: 'seconds' },
    ];

    return (
        // === PERUBAHAN UTAMA: Tambahkan text-center untuk meratakan teks ===
        <div className="countdown-container py-10 text-center"> 
            <h3 className="countdown-title animate-fade-in">Menghitung Mundur Hari Bahagia</h3>
            
            {/* === PERUBAHAN UTAMA: Tambahkan justify-center untuk meratakan kartu === */}
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