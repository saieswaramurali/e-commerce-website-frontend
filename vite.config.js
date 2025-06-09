import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || "/e-commerce-website-frontend" ,
  define : {
    'process.env': {
        VITE_CLIENT_ID: JSON.stringify(process.env.VITE_CLIENT_ID),
        VITE_CLIENT_SECRET: JSON.stringify(process.env.VITE_CLIENT_SECRET),
      },
  }
})
