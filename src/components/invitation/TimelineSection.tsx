// src/components/invitation/TimelineSection.tsx (Versi Final)

import { useState } from "react"; 
import { Clock } from "lucide-react";
import satinEmeraldBg from "@/assets/Bg-4.jpg";
import CountdownTimer from "./CountdownTimer"; 
import EditableText from "@/components/EditableText"; 

const initialTimelineEvents = [
  {
    id: 1,
    time: "18:30 WIB",
    title: "Pendaftaran Tamu",
    description: "Tamu dipersilakan hadir dan melakukan registrasi"
  },
  {
    id: 2,
    time: "19:00 WIB",
    title: "Pembukaan Acara",
    description: "Opening ceremony dan sambutan"
  },
  {
    id: 3,
    time: "19:30 WIB",
    title: "Welcome Dinner",
    description: "Makan malam bersama dengan hidangan premium"
  },
  {
    id: 4,
    time: "20:30 WIB",
    title: "Entertainment",
    description: "Pertunjukan musik live dan hiburan spesial"
  },
  {
    id: 5,
    time: "21:30 WIB",
    title: "Networking Session",
    description: "Kesempatan berjejaring dan bersosialisasi"
  },
  {
    id: 6,
    time: "22:30 WIB",
    title: "Penutupan",
    description: "Closing remarks dan foto bersama"
  }
];

// Interface untuk Timeline
interface TimelineEvent {
    id: number;
    time: string;
    title: string;
    description: string;
}

const TimelineSection = () => {
  const weddingTargetDate = "2026-09-15T19:00:00"; 
  
  // --- STATE UNTUK DATA EDITABLE ---
  const [sectionTitle, setSectionTitle] = useState("Rundown Acara");
  const [sectionSubtitle, setSectionSubtitle] = useState("Timeline malam keajaiban kami");
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(initialTimelineEvents); 

  // Fungsi untuk menyimpan perubahan pada Judul/Subjudul Section
  const handleSectionTextSave = (setter: React.Dispatch<React.SetStateAction<string>>, fieldName: string) => (newContent: string) => {
    setter(newContent);
    console.log(`[TIMELINE] Perubahan pada ${fieldName} disimpan: ${newContent}`);
    // Logic Nyata: updateSupabase('timeline_main', { field: fieldName, content: newContent });
  };
  
  // Fungsi untuk menyimpan perubahan pada item Timeline tertentu
  const handleItemSave = (id: number, field: 'title' | 'description' | 'time') => (newContent: string) => {
    setTimelineEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === id ? { ...event, [field]: newContent } : event
      )
    );
    console.log(`[TIMELINE] Item ID ${id} field ${field} diupdate.`);
    // Logic Nyata: updateSupabase('timeline_events', { id: id, field: field, content: newContent });
  };


  return (
    <section className="relative py-24 overflow-hidden">
      {/* Backgrounds... (Tetap sama) */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${satinEmeraldBg})` }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        
        {/* 2. PENEMPATAN COUNTDOWN TIMER */}
        <CountdownTimer targetDate={weddingTargetDate} />
        
        <div className="text-center space-y-4 mb-16 animate-slide-up">
          <h2 className="text-5xl md:text-6xl font-bold text-gold">
            {/* 1. EDITABLE TEXT: Judul Section */}
            <EditableText onSave={handleSectionTextSave(setSectionTitle, 'title')} tagName="span">
                {sectionTitle}
            </EditableText>
          </h2>
          <div className="h-1 w-32 bg-gold/50 mx-auto" />
          
          {/* PERBAIKAN DOM NESTING: Ganti <p> dengan <div> */}
          <div className="text-lg text-foreground/70">
            {/* 2. EDITABLE TEXT: Subjudul Section */}
            <EditableText onSave={handleSectionTextSave(setSectionSubtitle, 'subtitle')} tagName="span">
                {sectionSubtitle}
            </EditableText>
          </div>
        </div>
        
        {/* Timeline */}
        <div className="space-y-6">
          {timelineEvents.map((event, index) => (
            <div 
              key={event.id} 
              className="flex gap-6 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Time Badge */}
              <div className="flex-shrink-0 w-32 text-right">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/20 rounded-full border border-gold/30">
                  <Clock className="w-4 h-4 text-gold" />
                  <span className="text-gold font-semibold">
                    {/* 3. EDITABLE TEXT: Waktu Event */}
                    <EditableText onSave={handleItemSave(event.id, 'time')} tagName="span">
                        {event.time}
                    </EditableText>
                  </span>
                </div>
              </div>
              
              {/* Timeline Line (Tetap sama) */}
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-gold glow-gold" />
                {index < timelineEvents.length - 1 && (
                  <div className="w-0.5 h-full bg-gradient-to-b from-gold/50 to-transparent" />
                )}
              </div>
              
              {/* Event Details */}
              <div className="flex-1 pb-8">
                <div className="p-6 bg-card/20 backdrop-blur-sm rounded-2xl border border-gold/20 hover:border-gold/40 transition-all duration-300">
                  <h3 className="text-2xl font-semibold text-gold mb-2">
                    {/* 4. EDITABLE TEXT: Judul Event */}
                    <EditableText onSave={handleItemSave(event.id, 'title')} tagName="span">
                        {event.title}
                    </EditableText>
                  </h3>
                  
                  {/* PERBAIKAN DOM NESTING: Ganti <p> dengan <div> */}
                  <div className="text-foreground/70">
                    {/* 5. EDITABLE TEXT: Deskripsi Event */}
                    <EditableText onSave={handleItemSave(event.id, 'description')} tagName="span">
                        {event.description}
                    </EditableText>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;