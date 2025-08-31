import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: 'https://github.com/quinterokevinbusiness/pipe-head-loss-calculator.git', // ¡Importante! Reemplaza esto
})