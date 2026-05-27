import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['pwa-icon.svg'],
        manifest: {
          name: 'InvoiceLens',
          short_name: 'InvoiceLens',
          description: 'Intelligent Invoice OCR entirely in your browser',
          theme_color: '#0f1117',
          background_color: '#0f1117',
          display: 'standalone',
          icons: [
            {
              src: '/pwa-icon.svg',
              sizes: '192x192 512x512',
              type: 'image/svg+xml',
              purpose: 'any maskable'
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
    },
    optimizeDeps: {
      exclude: ['tesseract.js', 'onnxruntime-web', '@xenova/transformers'],
    },
    build: {
      target: 'es2022',
      sourcemap: false,
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-state': ['zustand', '@tanstack/react-query'],
            'vendor-export': ['papaparse', 'xlsx'],
            'vendor-pdf': ['pdfjs-dist'],
          },
        },
      },
    },
    worker: {
      format: 'es' as const,
    },
  };
});
