import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          'query-vendor': ['@tanstack/react-query'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          
          // Feature chunks
          'calendar': [
            './src/pages/CalendarDashboard',
            './src/components/calendar/CalendarGrid',
            './src/components/calendar/EventCreationForm'
          ],
          'admin': [
            './src/pages/AdminDashboard',
            './src/pages/BlogCMS',
            './src/pages/APIKeysManagement'
          ],
          'ai-features': [
            './src/pages/AIDashboard',
            './src/components/AISmartScheduling',
            './src/components/AISentimentAnalysis'
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: mode === 'development',
    minify: 'esbuild', // Use esbuild (built-in, faster than terser)
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
}));
