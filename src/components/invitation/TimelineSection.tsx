import { Clock } from "lucide-react";
import satinEmeraldBg from "@/assets/satin-emerald-bg.jpg";

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
  return (
    <section className="relative py-16 md:py-24 overflow-hidden"> {/* Sesuaikan padding vertikal */}
      {/* Emerald Satin Background Strip */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${satinEmeraldBg})` }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6"> {/* Padding horizontal lebih kecil untuk mobile */}
        <div className="text-center space-y-4 mb-12 md:mb-16 animate-slide-up">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gold"> {/* Ukuran font disesuaikan */}
            Rundown Acara
          </h2>
          <div className="h-1 w-24 md:w-32 bg-gold/50 mx-auto" />
          <p className="text-base md:text-lg text-foreground/70"> {/* Ukuran font disesuaikan */}
            Timeline malam keajaiban kami
          </p>
        </div>
        
        {/* Timeline */}
        <div className="space-y-8"> {/* Jarak antar event sedikit lebih besar */}
          {timelineEvents.map((event, index) => (
            <div 
              key={index}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 animate-fade-in" /* --- PERUBAHAN UTAMA UNTUK MOBILE: Gunakan flex-col di mobile, flex-row di sm: dan atasnya --- */
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              
              {/* Timeline Line (Mobile Positioned) & Time Badge */}
              <div className="flex sm:flex-col items-start sm:items-center">
                
                {/* Time Badge (Mobile: Kiri, Dekat Garis) */}
                <div className="flex-shrink-0 w-full sm:w-32 sm:text-right order-2 sm:order-1"> {/* order-2 untuk Time Badge di mobile, diletakkan setelah Event Details (secara visual) */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gold/20 rounded-full border border-gold/30">
                    <Clock className="w-4 h-4 text-gold" />
                    <span className="text-gold font-semibold text-sm sm:text-base">{event.time}</span>
                  </div>
                </div>

                {/* Timeline Line (Mobile: Berada di Kiri) */}
                <div className="flex flex-col items-center mr-4 sm:mr-0 order-1 sm:order-2"> {/* order-1 untuk Line di mobile, diletakkan sebelum Time Badge (secara visual) */}
                  <div className="w-3 h-3 rounded-full bg-gold glow-gold sm:w-4 sm:h-4" /> {/* Ukuran dot disesuaikan */}
                  {index < timelineEvents.length - 1 && (
                    <div className="w-0.5 h-full bg-gradient-to-b from-gold/50 to-transparent" />
                  )}
                </div>
                
              </div>
              
              {/* Event Details */}
              <div className="flex-1 pb-4 sm:pb-8 pl-4 sm:pl-0 order-3"> {/* Jarak padding vertikal disesuaikan */}
                <div className="p-4 sm:p-6 bg-card/20 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gold/20 hover:border-gold/40 transition-all duration-300">
                  <h3 className="text-xl sm:text-2xl font-semibold text-gold mb-1 sm:mb-2"> {/* Ukuran font disesuaikan */}
                    {event.title}
                  </h3>
                  <p className="text-sm sm:text-base text-foreground/70"> {/* Ukuran font disesuaikan */}
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