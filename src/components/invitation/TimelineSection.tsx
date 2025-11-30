import { Clock } from "lucide-react";
import satinEmeraldBg from "@/assets/satin-emerald-bg.jpg";
// 1. IMPORT KOMPONEN COUNTDOWN TIMER
import CountdownTimer from "./CountdownTimer"; // Sesuaikan path jika berbeda

const timelineEvents = [
  {
    time: "18:30 WIB",
    title: "Pendaftaran Tamu",
    description: "Tamu dipersilakan hadir dan melakukan registrasi"
  },
  {
    time: "19:00 WIB",
    title: "Pembukaan Acara",
    description: "Opening ceremony dan sambutan"
  },
  {
    time: "19:30 WIB",
    title: "Welcome Dinner",
    description: "Makan malam bersama dengan hidangan premium"
  },
  {
    time: "20:30 WIB",
    title: "Entertainment",
    description: "Pertunjukan musik live dan hiburan spesial"
  },
  {
    time: "21:30 WIB",
    title: "Networking Session",
    description: "Kesempatan berjejaring dan bersosialisasi"
  },
  {
    time: "22:30 WIB",
    title: "Penutupan",
    description: "Closing remarks dan foto bersama"
  }
];

const TimelineSection = () => {
  // TENTUKAN TANGGAL DAN WAKTU PERNIKAHAN ANDA DI SINI!
  // Format: 'YYYY-MM-DDTTHH:MM:SS'
  const weddingTargetDate = "2026-06-15T19:00:00"; // GANTI DENGAN TANGGAL ACARA SEBENARNYA

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Emerald Satin Background Strip */}
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
            Rundown Acara
          </h2>
          <div className="h-1 w-32 bg-gold/50 mx-auto" />
          <p className="text-lg text-foreground/70">
            Timeline malam keajaiban kami
          </p>
        </div>
        
        {/* Timeline */}
        <div className="space-y-6">
          {timelineEvents.map((event, index) => (
            <div 
              key={index}
              className="flex gap-6 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Time Badge */}
              <div className="flex-shrink-0 w-32 text-right">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/20 rounded-full border border-gold/30">
                  <Clock className="w-4 h-4 text-gold" />
                  <span className="text-gold font-semibold">{event.time}</span>
                </div>
              </div>
              
              {/* Timeline Line */}
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
                    {event.title}
                  </h3>
                  <p className="text-foreground/70">
                    {event.description}
                  </p>
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