import path from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const resolvePath = (str: string) => path.resolve(__dirname, str)

module.exports = defineConfig({
  build: {
    lib: {
      entry: resolvePath('src/index.ts'),
      name: 'VUsePlacesAutocomplete',
      fileName: format => `v-use-places-autocomplete.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
        exports: 'named',
      },
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      compilerOptions: {
        noEmit: false,
        declaration: true,
      },
    }),
  ],
  optimizeDeps: {
    exclude: ['vue-demi'],
  },
})
