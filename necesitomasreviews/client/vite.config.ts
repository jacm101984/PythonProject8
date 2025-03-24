// client/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
 plugins: [react()],
 resolve: {
   alias: {
     '@': path.resolve(__dirname, './src')
   }
 },
 server: {
   port: 5300,
   proxy: {
     '/api': {
       target: 'http://localhost:3300',
       changeOrigin: true,
       secure: false
     }
   }
 },
 optimizeDeps: {
   esbuildOptions: {
     target: 'es2020'
   }
 },
 build: {
   target: 'es2020',
   outDir: 'dist',
   sourcemap: true
 }
});