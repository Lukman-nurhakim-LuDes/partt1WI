import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Invitation from "./pages/Invitation";
import NotFound from "./pages/NotFound";

// 1. IMPORT KOMPONEN KONTROL MUSIK GLOBAL
import GlobalMusicControl from "./components/invitation/GlobalMusicControl"; 

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* Kontrol Musik DITEMPATKAN di sini, di dalam BrowserRouter */}
        {/* Ini memastikan kontrol selalu ada dan tidak di-unmount saat navigasi */}
        <GlobalMusicControl /> 
        
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/invitation" element={<Invitation />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;