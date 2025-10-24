import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separa bibliotecas pesadas em chunks específicos
          'ui-components': [
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-dialog',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-switch',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-label',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-tooltip'
          ],
          'form-libs': [
            'react-hook-form',
            '@hookform/resolvers',
            'zod',
            'use-mask-input'
          ],
          'table-lib': ['@tanstack/react-table'],
          'phone-lib': ['react-phone-number-input'],
          'dnd-libs': [
            '@dnd-kit/core',
            '@dnd-kit/sortable',
            '@dnd-kit/utilities'
          ],
          'animation': ['framer-motion'],
          'routing': ['react-router-dom'],
          'charts': ['recharts'],
          'icons': ['lucide-react'],
          'utils': [
            'axios', 
            'moment', 
            'moment-timezone',
            'date-fns',
            'clsx',
            'tailwind-merge',
            'class-variance-authority',
            'jwt-decode',
            'cmdk',
            'next-themes',
            'sonner',
            'zustand'
          ]
        }
      }
    },
    // Otimizações adicionais
    target: 'es2015',
    minify: 'terser',
    // Ajusta o limite de aviso para 600KB
    chunkSizeWarningLimit: 600
  }
})
