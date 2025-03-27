import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });


export default defineConfig({
  base: './',
  plugins: [react()],
  define: {
    'process.env': process.env, 
  },
  build: {
    chunkSizeWarningLimit: 1000,
    minify: false,
  },
});
