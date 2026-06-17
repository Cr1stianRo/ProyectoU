import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// En desarrollo la base es "/" para entrar directo a localhost:5173.
// En el build de produccion se usa "/ProyectoU/" para GitHub Pages.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/ProyectoU/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
}))
