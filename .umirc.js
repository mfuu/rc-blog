
import { defineConfig } from 'umi'
import routes from './src/router'

export default defineConfig({
  antd: {},
  dva: {},
  nodeModulesTransform: {
    type: 'none',
    exclude: []
  },
  routes: routes,
  fastRefresh: {},
  // history: {
  //   type: 'hash'
  // },
  // hash: true,
  // base: './',
  // publicPath: './'
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true
    }
  }
})
