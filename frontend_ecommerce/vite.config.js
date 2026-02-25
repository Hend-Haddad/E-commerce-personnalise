// frontend_ecommerce/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    // 👇 AJOUTEZ CES LIGNES POUR LE ROUTAGE
    historyApiFallback: true, // Redirige toutes les requêtes vers index.html
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    port: 3000,
    open: true,
    historyApiFallback: true // Important aussi pour la prévisualisation
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})