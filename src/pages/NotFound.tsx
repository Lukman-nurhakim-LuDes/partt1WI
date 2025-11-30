import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import satinBerryBg from "@/assets/satin-berry-bg.jpg";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Satin Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${satinBerryBg})` }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 space-y-8 animate-fade-in">
        <h1 className="text-9xl font-bold text-gold">404</h1>
        <div className="h-1 w-32 bg-gold/50 mx-auto" />
        <h2 className="text-4xl md:text-5xl font-bold text-foreground">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-xl text-foreground/70 max-w-md mx-auto">
          Maaf, halaman yang Anda cari tidak dapat ditemukan.
        </p>
        <Button
          onClick={() => navigate("/")}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full glow-gold transition-all duration-300"
        >
          <Home className="w-5 h-5 mr-2" />
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
