import satinEmeraldBg from "@/assets/satin-emerald-bg.jpg";
import goldBokehOverlay from "@/assets/gold-bokeh-overlay.jpg";

const WelcomeSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Emerald Satin Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${satinEmeraldBg})` }}
      />
      
      {/* Gold Bokeh Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen"
        style={{ backgroundImage: `url(${goldBokehOverlay})` }}
      />
      
      {/* Dark Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8 animate-fade-in">
        <div className="space-y-4">
          <h2 className="text-5xl md:text-7xl font-bold text-gold">
            Selamat Datang
          </h2>
          <div className="h-1 w-32 bg-gold/50 mx-auto" />
        </div>
        
        <p className="text-xl md:text-2xl text-foreground/90 leading-relaxed max-w-2xl mx-auto">
          Dengan penuh kebahagiaan dan kehormatan, kami mengundang Anda untuk berbagi momen istimewa bersama kami dalam perayaan yang penuh keajaiban dan keanggunan.
        </p>
        
        <p className="text-lg md:text-xl text-gold/80 italic">
          "Setiap momen berharga dimulai dengan undangan untuk bersama"
        </p>
        
        {/* Decorative Elements */}
        <div className="flex items-center justify-center gap-4 pt-8">
          <div className="h-px w-24 bg-gold/50" />
          <div className="h-3 w-3 rotate-45 bg-gold/50" />
          <div className="h-px w-24 bg-gold/50" />
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
