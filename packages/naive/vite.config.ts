/// <reference types="vitest" />

import { resolve } from 'node:path'
import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import ViteDts from 'vite-plugin-dts'
import VueMacros from 'unplugin-vue-macros/vite'
import CssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  plugins: [
    VueMacros({
      defineOptions: false,
      defineModels: false,
      plugins: {
        vue: Vue({
          script: {
            propsDestructure: true,
            defineModel: true,
          },
        }),
      },
    }),
    // https://github.com/antfu/unocss
    // see uno.config.ts for config
    UnoCSS({}),
    ViteDts(),
    // https://github.com/Marco-Prontera/vite-plugin-css-injected-by-js
    CssInjectedByJsPlugin(),
  ],
  build: {
    target: 'modules',
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs', 'umd'],
      name: 'BasicUiNaive',
      // the proper extensions will be added
      fileName: 'index',
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: [
        'vue',
        'naive-ui',
        '@own-basic-component/buried',
        '@own-basic-component/util',
        '@own-basic-component/util',
        '@own-basic-component/vue',
      ],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          '@own-basic-component/buried': 'ComponentBuried',
          '@own-basic-component/config': 'ComponentConfig',
          '@own-basic-component/util': 'ComponentUtil',
          '@own-basic-component/vue': 'ComponentVue',
          'naive-ui': 'NaiveUi',
          'vue': 'Vue',
        },
      },
    },
  },
})
