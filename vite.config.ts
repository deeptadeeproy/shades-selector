import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html', // Will be saved in dist/stats.html
      open: true, // Automatically open the report in browser
      gzipSize: true, // Show gzipped sizes
      brotliSize: true, // Show brotli sizes
    }),
  ],
  build: {
    // Enable tree shaking and minification
    minify: 'terser',
    // Split chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor libraries
          vendor: ['react', 'react-dom'],
        },
      },
    },
    // Enable source maps for debugging (disable in production if needed)
    sourcemap: false,
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
})
