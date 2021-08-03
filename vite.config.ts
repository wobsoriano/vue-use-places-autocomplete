import { defineConfig } from 'vite';
import path from 'path';

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'VUsePlacesAutocomplete',
      fileName: format => `v-use-places-autocomplete.${format}.js`  
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        },
        exports: 'named'
      }
    }
  },
  optimizeDeps: {
    exclude: ['vue-demi']
  }
});