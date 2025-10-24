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
            '@radix-ui/react-switch'
          ],
          'form-libs': [
            'react-hook-form',
            '@hookform/resolvers',
            'zod'
          ],
          'table-lib': ['@tanstack/react-table'],
          'phone-lib': ['react-phone-number-input'],
          'dnd-libs': [
            '@dnd-kit/core',
            '@dnd-kit/sortable',
            '@dnd-kit/utilities'
          ],
          'animation': ['framer-motion'],
          'utils': ['axios', 'moment', 'moment-timezone']
        }
      }
    }
  }
})
