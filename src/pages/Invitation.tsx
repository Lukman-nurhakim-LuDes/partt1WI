// src/pages/Invitation.tsx atau src/components/pages/Invitation.tsx

import WelcomeSection from "@/components/invitation/WelcomeSection";
import VenueSection from "@/components/invitation/VenueSection";
import TimelineSection from "@/components/invitation/TimelineSection";
import DressCodeSection from "@/components/invitation/DressCodeSection";
import GallerySection from "@/components/invitation/GallerySection";
import RsvpSection from "@/components/invitation/RsvpSection";
import ClosingSection from "@/components/invitation/ClosingSection";
import PhotoStorySection from "@/components/invitation/PhotoStorySection"; 

// --- IMPOR TAMBAHAN ---
// Impor Kontrol Musik Global (dilihat dari struktur folder Anda)
import GlobalMusicControl from "@/components/invitation/GlobalMusicControl"; 

import AdminToggle from "@/components/AdminToggle"; // Tombol Admin yang sudah diperbaiki

const Invitation = () => {
  return (
    <div className="w-full overflow-x-hidden">
      {/* Tambahkan Kontrol Musik Global agar tersedia di semua halaman */}
      <GlobalMusicControl /> 
      
      {/* Tambahkan Tombol Admin yang sudah diperbaiki */}
      <AdminToggle /> 
      
      {/* 1. Halaman Selamat Datang / Intro */}
      <WelcomeSection />

       
      {/* 3. BAGIAN PHOTO STORYTELLING (CERITA CINTA) */}
      <PhotoStorySection /> 
      
      {/* 4. Informasi Acara (Lokasi dan Tanggal) */}
      <VenueSection />
      
      {/* 5. Rundown Acara / Timeline */}
      <TimelineSection />
      
      {/* 6. Detail Tambahan */}
      <DressCodeSection />
      
      {/* 7. Galeri Foto */}
      <GallerySection />
      
      {/* 8. Konfirmasi Kehadiran */}
      <RsvpSection />
      
      {/* 9. Penutup */}
      <ClosingSection />
    </div>
  );
};

export default Invitation;