// src/components/invitation/VenueSection.tsx

import { useState } from "react"; 
import { MapPin, Calendar, Clock } from "lucide-react";
import satinBerryBg from "@/assets/satin-berry-bg.jpg";
import EditableText from "@/components/EditableText"; 
import { useAdmin } from "@/context/AdminContext"; // Impor yang diperlukan

const initialVenueData = {
    sectionTitle: "Informasi Acara",
    locationTitle: "Lokasi",
    venueName: "Grand Ballroom",
    hotelName: "The Ritz-Carlton Jakarta",
    address: "Pacific Place, Jl. Jenderal Sudirman, Jakarta Selatan",
    dateTitle: "Tanggal",
    dateValue: "Sabtu, 15 Februari 2025",
    timeTitle: "Waktu",
    timeValue: "19:00 WIB - Selesai",
    mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2665474374745!2d106.80854931476907!3d-6.225408695499029!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f150ba15568f%3A0xf5e2e9332e5a38f4!2sThe%20Ritz-Carlton%20Jakarta%2C%20Pacific%20Place!5e0!3m2!1sen!2sid!4v1635000000000!5m2!1sen!2sid",
};

const VenueSection = () => {
    const [data, setData] = useState(initialVenueData);
    const { isAdmin } = useAdmin(); // Asumsi hook admin tersedia

    const handleSave = (fieldName: keyof typeof initialVenueData) => (newContent: string) => {
        setData(prevData => ({
            ...prevData,
            [fieldName]: newContent
        }));
        console.log(`[VENUE SECTION] Field ${fieldName} diupdate: ${newContent}`);
        // Logic Nyata: updateSupabase('venue_details', { [fieldName]: newContent });
    };

    return (
        <section className="relative py-16 md:py-24 overflow-hidden">
            
            {/* Backgrounds... */}
            <div 
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: `url(${satinBerryBg})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
            
            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6"> 
                <div className="text-center space-y-3 md:space-y-4 mb-10 md:mb-16 animate-slide-up"> 
                    {/* Judul Section: Dikecilkan di mobile (text-4xl) */}
                    <h2 className="text-4xl md:text-6xl font-bold text-gold">
                        <EditableText onSave={handleSave('sectionTitle')} tagName="span">
                            {data.sectionTitle}
                        </EditableText>
                    </h2>
                    <div className="h-1 w-24 md:w-32 bg-gold/50 mx-auto" />
                </div>
                
                {/* PERBAIKAN UTAMA: GRID 1 kolom di mobile, 2 kolom di desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start"> 
                    {/* Event Details */}
                    <div className="space-y-6 md:space-y-8 animate-fade-in order-2 md:order-1"> 
                        
                        {/* 1. LOKASI */}
                        <div className="flex items-start gap-4 p-4 md:p-6 bg-card/30 backdrop-blur-sm rounded-2xl border border-gold/20">
                            <MapPin className="w-6 h-6 md:w-8 md:h-8 text-gold mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="text-xl md:text-2xl font-semibold text-gold mb-1"> 
                                    <EditableText onSave={handleSave('locationTitle')} tagName="span">{data.locationTitle}</EditableText>
                                </h3>
                                <div className="text-base md:text-lg text-foreground/80">
                                    <EditableText onSave={handleSave('venueName')} tagName="span">{data.venueName}</EditableText>
                                </div>
                                <div className="text-sm text-foreground/60">
                                    <EditableText onSave={handleSave('hotelName')} tagName="span">{data.hotelName}</EditableText>
                                </div>
                                <div className="text-xs md:text-sm text-foreground/50 mt-2">
                                    <EditableText onSave={handleSave('address')} tagName="span">{data.address}</EditableText>
                                </div>
                            </div>
                        </div>
                        
                        {/* 2. TANGGAL */}
                        <div className="flex items-start gap-4 p-4 md:p-6 bg-card/30 backdrop-blur-sm rounded-2xl border border-gold/20">
                            <Calendar className="w-6 h-6 md:w-8 md:h-8 text-gold mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="text-xl md:text-2xl font-semibold text-gold mb-1">
                                    <EditableText onSave={handleSave('dateTitle')} tagName="span">{data.dateTitle}</EditableText>
                                </h3>
                                <div className="text-base md:text-lg text-foreground/80">
                                    <EditableText onSave={handleSave('dateValue')} tagName="span">{data.dateValue}</EditableText>
                                </div>
                            </div>
                        </div>

                        {/* 3. WAKTU */}
                        <div className="flex items-start gap-4 p-4 md:p-6 bg-card/30 backdrop-blur-sm rounded-2xl border border-gold/20">
                            <Clock className="w-6 h-6 md:w-8 md:h-8 text-gold mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="text-xl md:text-2xl font-semibold text-gold mb-1">
                                    <EditableText onSave={handleSave('timeTitle')} tagName="span">{data.timeTitle}</EditableText>
                                </h3>
                                <div className="text-base md:text-lg text-foreground/80">
                                    <EditableText onSave={handleSave('timeValue')} tagName="span">{data.timeValue}</EditableText>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Google Maps Embed */}
                    <div className="animate-fade-in order-1 md:order-2"> 
                        <div className="rounded-2xl overflow-hidden border-4 border-gold/30 elegant-shadow">
                            <iframe
                                src={data.mapsEmbedUrl}
                                width="100%"
                                height="300" 
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Venue Location"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VenueSection;