// src/App.tsx 

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Invitation from "./pages/Invitation";
import NotFound from "./pages/NotFound";

// Component Global (Tersedia di /components/invitation/)
import GlobalMusicControl from "./components/invitation/GlobalMusicControl"; 

// Component Global (Tersedia di /components/ - ASUMSI PATH INI)
import AdminToggle from "./components/AdminToggle"; 

// Context Global (Tersedia di /context/)
import { AdminProvider } from "./context/AdminContext"; 


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* WRAP DENGAN ADMIN PROVIDER */}
      <AdminProvider> 
        <BrowserRouter>
          {/* Global Music Control diletakkan di luar Routes */}
          <GlobalMusicControl /> 
          
          {/* RENDER ADMIN TOGGLE - Harus di dalam AdminProvider & BrowserRouter */}
          <AdminToggle /> 
          
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/invitation" element={<Invitation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AdminProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;