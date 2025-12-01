import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // --- START: MODIFIKASI UNTUK CODE SPLITTING ---
  build: {
    // 1. Meningkatkan batas warning (opsional, tetapi membantu menghilangkan pesan)
    chunkSizeWarningLimit: 1000, 
    
    rollupOptions: {
      output: {
        // 2. Menerapkan Code Splitting Manual
        manualChunks(id) {
          // Jika modul berasal dari node_modules (dependency pihak ketiga)
          if (id.includes("node_modules")) {
            // Pisahkan semuanya ke dalam chunk 'vendor'
            return "vendor"; 
          }
          // Biarkan Rollup menangani modul aplikasi lainnya
        },
      },
    },
  },
  // --- END: MODIFIKASI UNTUK CODE SPLITTING ---
}));