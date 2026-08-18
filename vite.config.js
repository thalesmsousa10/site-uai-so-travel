import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        quemSomos: resolve(__dirname, 'quem-somos.html'),
        experiencias: resolve(__dirname, 'experiencias.html'),
        destinos: resolve(__dirname, 'destinos.html'),
        contato: resolve(__dirname, 'contato.html'),
      },
    },
  },
});
