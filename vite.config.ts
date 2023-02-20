import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from 'vite'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import { presetUno } from 'unocss'
// import VueI18n from '@intlify/vite-plugin-vue-i18n'
import eslint from 'vite-plugin-eslint'
import svgLoader from 'vite-svg-loader'
import viteImagemin from 'vite-plugin-imagemin'
import viteCompression from 'vite-plugin-compression';
const CWD = process.cwd()

export default defineConfig(({ mode }) => {
  const TARGET_ENV_CONFIG = loadEnv(mode, CWD)
  console.log(TARGET_ENV_CONFIG)
  return {
    plugins: [
      vue({ template: { transformAssetUrls } }),
      svgLoader(),
      quasar({ sassVariables: 'src/assets/style/quasar-variables.scss' }),
      Pages({
        nuxtStyle: true,
        dirs: [
          { dir: 'src/pages', baseRoute: '' },
          { dir: 'src/pages/blank', baseRoute: '' },
        ],
        exclude: ['**/components/*.vue'],
      }),
      Layouts(),
      Unocss({
        presets: [presetUno()],
      }),
      // VueI18n({
      //   include: resolve(__dirname, './src/locales/**'),
      // }),
      eslint({
        fix: true
      }),
      viteCompression({
        algorithm: 'brotliCompress',
        filter: /\.(css|js|map)$/i
      }),
      viteImagemin({
        mozjpeg: {
          quality: 50,
        },
        pngquant: {
          quality: [0.8, 0.9],
          speed: 4,
        },
        svgo: {
          plugins: [
            {
              name: 'removeViewBox'
            },
            {
              name: 'removeEmptyAttrs'
            },
            {
              name: 'removeDimensions'
            }
          ],
        },
      })
    ],
    resolve: {
      alias: {
        src: fileURLToPath(new URL("./src", import.meta.url)),
        '~': fileURLToPath(new URL("./src", import.meta.url)),
        '@': fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      https: false,
      port: 3001
    },
    build: {
      // reportCompressedSize: true,
      chunkSizeWarningLimit: 1024,
      sourcemap: true,
      manifest: true,
      rollupOptions: {
        output: {
          entryFileNames: '[name]-[hash].js',
          chunkFileNames: '[name]-[hash].js',
          assetFileNames: '[name]-[hash].[ext]',
          manualChunks(id) {
            if (id.includes('/node_modules/')) {
              const modules = ['quasar', '@quasar', 'vue', '@vue', 'vue3-apexcharts', 'apexcharts', 'vuedraggable']
              const chunk = modules.find((module) => id.includes(`/node_modules/${module}`))
              return chunk ? `vendor-${chunk}` : 'vendor'
            }
          },
        },
      }
    },
  }
})