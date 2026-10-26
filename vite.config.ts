import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GitHub Pages 프로토타입은 BASE_PATH=/{리포지터리 이름}/ 으로 빌드 (.github/workflows/deploy.yml)
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  server: { port: 5173 },
});
