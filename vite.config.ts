import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: 'http://localhost:5000',
            changeOrigin: true,
            secure: false,
          }
        }
      },
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        minify: 'esbuild',
        cssCodeSplit: true,
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom', 'react-router-dom'],
              'ui-vendor': ['lucide-react']
            },
            assetFileNames: 'assets/[name].[hash][extname]',
            chunkFileNames: 'assets/[name].[hash].js',
            entryFileNames: 'assets/[name].[hash].js'
          }
        },
        // Optimize for production
        target: 'es2015',
        cssMinify: true
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      css: {
        postcss: undefined,
        preprocessorOptions: {}
      }
    };
});
