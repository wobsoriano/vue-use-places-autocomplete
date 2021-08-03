import { defineConfig } from 'vite';
import path from 'path';
import typescript from '@rollup/plugin-typescript'

const resolvePath = (str: string) => path.resolve(__dirname, str)

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
      },
      plugins: [
        typescript({
          'target': 'es2020',
          'rootDir': resolvePath('src'),
          'declaration': true,
          'declarationDir': resolvePath('dist'),
          exclude: resolvePath('node_modules/**'),
          allowSyntheticDefaultImports: true
        })
      ]
    }
  },
  optimizeDeps: {
    exclude: ['vue-demi']
  }
});