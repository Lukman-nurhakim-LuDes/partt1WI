import { Button } from "@/components/ui/button";
import { ArrowUp, Heart } from "lucide-react";
import satinBerryBg from "@/assets/satin-berry-bg.jpg";
import goldBokehOverlay from "@/assets/gold-bokeh-overlay.jpg";

const ClosingSection = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Berry Satin Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${satinBerryBg})` }}
      />
      
      {/* Gold Bokeh Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen"
        style={{ backgroundImage: `url(${goldBokehOverlay})` }}
      />
      
      {/* Dark Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8 animate-fade-in">
        <Heart className="w-16 h-16 text-gold mx-auto" />
        
        <div className="space-y-4">
          <h2 className="text-5xl md:text-7xl font-bold text-gold">
            Sampai Bertemu
          </h2>
          <div className="h-1 w-32 bg-gold/50 mx-auto" />
        </div>
        
        <p className="text-2xl md:text-3xl text-foreground/90 italic">
          "Di malam penuh keajaiban!"
        </p>
        
        <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
          Kehadiran dan doa restu Anda adalah kebahagiaan terbesar bagi kami. 
          Mari bersama-sama ciptakan malam yang tak terlupakan.
        </p>
        
        {/* Decorative Elements */}
        <div className="flex items-center justify-center gap-4 py-8">
          <div className="h-px w-24 bg-gold/50" />
          <div className="h-3 w-3 rotate-45 bg-gold/50" />
          <div className="h-px w-24 bg-gold/50" />
        </div>
        
        {/* Scroll to Top Button */}
        <Button
          onClick={scrollToTop}
          variant="outline"
          className="border-gold/50 text-gold hover:bg-gold/20 hover:border-gold px-8 py-6 text-lg rounded-full glow-gold transition-all duration-300"
        >
          <ArrowUp className="w-5 h-5 mr-2" />
          Kembali ke Atas
        </Button>
        
        {/* Footer */}
        <div className="pt-12 text-sm text-foreground/50">
          <p>© 2025 Malam Keajaiban. All rights reserved.</p>
        </div>
      </div>
    </section>
  );
};

export default ClosingSection;
