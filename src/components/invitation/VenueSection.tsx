import { MapPin, Calendar, Clock } from "lucide-react";
import satinBerryBg from "@/assets/satin-berry-bg.jpg";

const VenueSection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Berry Satin Strip Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${satinBerryBg})` }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16 animate-slide-up">
          <h2 className="text-5xl md:text-6xl font-bold text-gold">
            Informasi Acara
          </h2>
          <div className="h-1 w-32 bg-gold/50 mx-auto" />
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Event Details */}
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-start gap-4 p-6 bg-card/30 backdrop-blur-sm rounded-2xl border border-gold/20">
              <MapPin className="w-8 h-8 text-gold mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-semibold text-gold mb-2">Lokasi</h3>
                <p className="text-lg text-foreground/80">Grand Ballroom</p>
                <p className="text-foreground/60">The Ritz-Carlton Jakarta</p>
                <p className="text-sm text-foreground/50 mt-2">
                  Pacific Place, Jl. Jenderal Sudirman, Jakarta Selatan
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-6 bg-card/30 backdrop-blur-sm rounded-2xl border border-gold/20">
              <Calendar className="w-8 h-8 text-gold mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-semibold text-gold mb-2">Tanggal</h3>
                <p className="text-lg text-foreground/80">Sabtu, 15 Februari 2025</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-6 bg-card/30 backdrop-blur-sm rounded-2xl border border-gold/20">
              <Clock className="w-8 h-8 text-gold mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-semibold text-gold mb-2">Waktu</h3>
                <p className="text-lg text-foreground/80">19:00 WIB - Selesai</p>
              </div>
            </div>
          </div>
          
          {/* Google Maps Embed */}
          <div className="animate-fade-in">
            <div className="rounded-2xl overflow-hidden border-4 border-gold/30 elegant-shadow">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2665474374745!2d106.80854931476907!3d-6.225408695499029!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f150ba15568f%3A0xf5e2e9332e5a38f4!2sThe%20Ritz-Carlton%20Jakarta%2C%20Pacific%20Place!5e0!3m2!1sen!2sid!4v1635000000000!5m2!1sen!2sid"
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
