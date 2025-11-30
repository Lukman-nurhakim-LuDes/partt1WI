import WelcomeSection from "@/components/invitation/WelcomeSection";
import VenueSection from "@/components/invitation/VenueSection";
import TimelineSection from "@/components/invitation/TimelineSection";
import DressCodeSection from "@/components/invitation/DressCodeSection";
import GallerySection from "@/components/invitation/GallerySection";
import RsvpSection from "@/components/invitation/RsvpSection";
import ClosingSection from "@/components/invitation/ClosingSection";

// --- IMPORT KOMPONEN BARU ---
import PhotoStorySection from "@/components/invitation/PhotoStorySection"; 

const Invitation = () => {
  return (
    <div className="w-full overflow-x-hidden">
      {/* 1. Halaman Selamat Datang / Intro */}
      <WelcomeSection />

      {/* 2. BAGIAN PHOTO STORYTELLING (CERITA CINTA) */}
      <PhotoStorySection /> 
      
      {/* 3. Informasi Acara (Lokasi dan Tanggal) */}
      <VenueSection />
      
      {/* 4. Rundown Acara / Timeline */}
      <TimelineSection />
      
      {/* 5. Detail Tambahan */}
      <DressCodeSection />
      
      {/* 6. Galeri Foto */}
      <GallerySection />
      
      {/* 7. Konfirmasi Kehadiran */}
      <RsvpSection />
      
      {/* 8. Penutup */}
      <ClosingSection />
    </div>
  );
};

export default Invitation;