import { useState } from "react";
import { X } from "lucide-react";
import goldBokehOverlay from "@/assets/gold-bokeh-overlay.jpg";

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  
  // Placeholder gallery items with gradients
  const galleryItems = [
    { color: "from-primary to-primary/60" },
    { color: "from-secondary to-secondary/60" },
    { color: "from-gold to-gold/60" },
    { color: "from-primary/80 to-secondary/80" },
    { color: "from-secondary/70 to-gold/70" },
    { color: "from-gold/80 to-primary/80" },
    { color: "from-primary/60 to-gold/60" },
    { color: "from-secondary to-primary" },
    { color: "from-gold/70 to-secondary/70" },
    { color: "from-primary/50 to-secondary/50" },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${goldBokehOverlay})` }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-background via-black/50 to-background" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16 animate-slide-up">
          <h2 className="text-5xl md:text-6xl font-bold text-gold">
            Galeri Momen
          </h2>
          <div className="h-1 w-32 bg-gold/50 mx-auto" />
          <p className="text-lg text-foreground/70">
            Koleksi momen berharga kami
          </p>
        </div>
        
        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              className="group cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => setSelectedImage(index)}
            >
              <div className="relative aspect-square overflow-hidden rounded-xl border-2 border-gold/30 group-hover:border-gold/60 transition-all duration-300">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color}`} />
                
                {/* Gold Frame Effect */}
                <div className="absolute inset-0 border-4 border-gold/20 group-hover:border-gold/40 transition-all duration-300" />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-gold text-sm">View</span>
                </div>
                
                {/* Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 glow-gold" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 p-2 bg-gold/20 rounded-full hover:bg-gold/30 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8 text-gold" />
          </button>
          
          <div className="relative max-w-4xl w-full aspect-square">
            <div className={`w-full h-full bg-gradient-to-br ${galleryItems[selectedImage].color} rounded-2xl border-4 border-gold/50 elegant-shadow`} />
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
