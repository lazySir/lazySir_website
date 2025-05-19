import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { VantResolver } from 'unplugin-vue-components/resolvers'; // 自动安装vant
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { createHtmlPlugin } from 'vite-plugin-html'
import vueDevTools from 'vite-plugin-vue-devtools'
// https://vitejs.dev/config/
export default defineConfig({
  base: '/', //配置根目录
  plugins: [
    vue(),
    vueDevTools(),
    createHtmlPlugin({}),
    Icons({       // 自动安装图标
      autoInstall: true
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver(), IconsResolver(), VantResolver()],
    }),],
  resolve: {
    //配置别名
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    //配置文件扩展名
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  //配置代理
  server: {

    //是否开启https
    hmr: true,
    host: '0.0.0.0',

    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
