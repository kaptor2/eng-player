import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import renderer from 'vite-plugin-electron-renderer';

export default defineConfig({
  root: 'src/renderer',
  base: '',
  plugins: [
    react({
      babel: {
        plugins: [
          [
            '@stylexjs/babel-plugin',
            {
              dev: true,
              test: false,
              runtimeInjection: true,
              treeshakeCompensation: true,
              unstable_moduleResolution: {
                type: 'commonJS',
                rootDir: __dirname,
              },
            },
          ],
        ],
      },
    }),
    renderer(),
  ],
  build: {
    outDir: '../../dist/renderer',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@renderer': path.resolve(__dirname, 'src/renderer'),
      '@main': path.resolve(__dirname, 'src/main'),
      '@shared': path.resolve(__dirname, 'src/shared'),
    },
  },
});
