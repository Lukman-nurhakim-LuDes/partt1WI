// src/components/invitation/VenueSection.tsx (Versi Diperbarui)

import { useState } from "react"; // Tambahkan useState
import { MapPin, Calendar, Clock } from "lucide-react";
import satinBerryBg from "@/assets/satin-berry-bg.jpg";
import EditableText from "@/components/EditableText"; // Import komponen editing

const initialVenueData = {
    sectionTitle: "Informasi Acara",
    
    // Lokasi
    locationTitle: "Lokasi",
    venueName: "Grand Ballroom",
    hotelName: "The Ritz-Carlton Jakarta",
    address: "Pacific Place, Jl. Jenderal Sudirman, Jakarta Selatan",
    
    // Tanggal
    dateTitle: "Tanggal",
    dateValue: "Sabtu, 15 Februari 2025",
    
    // Waktu
    timeTitle: "Waktu",
    timeValue: "19:00 WIB - Selesai",
    
    // Maps
    mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2665474374745!2d106.80854931476907!3d-6.225408695499029!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f150ba15568f%3A0xf5e2e9332e5a38f4!2sThe%20Ritz-Carlton%20Jakarta%2C%20Pacific%20Place!5e0!3m2!1sen!2sid!4v1635000000000!5m2!1sen!2sid",
};

const VenueSection = () => {
    // Gunakan state untuk menampung semua data yang dapat diedit
    const [data, setData] = useState(initialVenueData);
    
    // Fungsi untuk menyimpan perubahan pada field spesifik
    const handleSave = (fieldName: keyof typeof initialVenueData) => (newContent: string) => {
        setData(prevData => ({
            ...prevData,
            [fieldName]: newContent
        }));
        
        console.log(`[VENUE SECTION] Field ${fieldName} diupdate: ${newContent}`);
        // Logic Nyata: updateSupabase('venue_details', { [fieldName]: newContent });
    };

    return (
        <section className="relative py-24 overflow-hidden">
            {/* Backgrounds... (Tetap sama) */}
            <div 
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: `url(${satinBerryBg})` }}
            />
            
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
            
            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-6">
                <div className="text-center space-y-4 mb-16 animate-slide-up">
                    <h2 className="text-5xl md:text-6xl font-bold text-gold">
                        {/* 1. EDITABLE TEXT: Judul Section */}
                        <EditableText onSave={handleSave('sectionTitle')} tagName="span">
                            {data.sectionTitle}
                        </EditableText>
                    </h2>
                    <div className="h-1 w-32 bg-gold/50 mx-auto" />
                </div>
                
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Event Details */}
                    <div className="space-y-8 animate-fade-in">
                        
                        {/* 1. LOKASI */}
                        <div className="flex items-start gap-4 p-6 bg-card/30 backdrop-blur-sm rounded-2xl border border-gold/20">
                            <MapPin className="w-8 h-8 text-gold mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="text-2xl font-semibold text-gold mb-2">
                                    <EditableText onSave={handleSave('locationTitle')} tagName="span">
                                        {data.locationTitle}
                                    </EditableText>
                                </h3>
                                <p className="text-lg text-foreground/80">
                                    <EditableText onSave={handleSave('venueName')} tagName="span">
                                        {data.venueName}
                                    </EditableText>
                                </p>
                                <p className="text-foreground/60">
                                    <EditableText onSave={handleSave('hotelName')} tagName="span">
                                        {data.hotelName}
                                    </EditableText>
                                </p>
                                <p className="text-sm text-foreground/50 mt-2">
                                    <EditableText onSave={handleSave('address')} tagName="span">
                                        {data.address}
                                    </EditableText>
                                </p>
                            </div>
                        </div>
                        
                        {/* 2. TANGGAL */}
                        <div className="flex items-start gap-4 p-6 bg-card/30 backdrop-blur-sm rounded-2xl border border-gold/20">
                            <Calendar className="w-8 h-8 text-gold mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="text-2xl font-semibold text-gold mb-2">
                                    <EditableText onSave={handleSave('dateTitle')} tagName="span">
                                        {data.dateTitle}
                                    </EditableText>
                                </h3>
                                <p className="text-lg text-foreground/80">
                                    <EditableText onSave={handleSave('dateValue')} tagName="span">
                                        {data.dateValue}
                                    </EditableText>
                                </p>
                            </div>
                        </div>
                        
                        {/* 3. WAKTU */}
                        <div className="flex items-start gap-4 p-6 bg-card/30 backdrop-blur-sm rounded-2xl border border-gold/20">
                            <Clock className="w-8 h-8 text-gold mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="text-2xl font-semibold text-gold mb-2">
                                    <EditableText onSave={handleSave('timeTitle')} tagName="span">
                                        {data.timeTitle}
                                    </EditableText>
                                </h3>
                                <p className="text-lg text-foreground/80">
                                    <EditableText onSave={handleSave('timeValue')} tagName="span">
                                        {data.timeValue}
                                    </EditableText>
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Google Maps Embed */}
                    <div className="animate-fade-in">
                        <div className="rounded-2xl overflow-hidden border-4 border-gold/30 elegant-shadow">
                            {/* NOTE: Maps URL harus diedit manual (tidak inline) atau melalui form terpisah */}
                            <iframe
                                src={data.mapsEmbedUrl}
                                width="100%"
                                height="450"
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