import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import postcss from 'postcss' 


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(
    tailwindcss()
    
  )],
})
