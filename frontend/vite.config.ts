// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true, // 브라우저 자동 열림 (선택)
    // ✅ 라우터 문제 방지용 추가
    fs: {
      strict: false,
    },
  },
});
