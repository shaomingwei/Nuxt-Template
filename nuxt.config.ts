process.env.DEBUG = 'nuxt:*'
const pkg = require('./package')
const NODE_ENV = process.env.NODE_ENV
const API_HOST = process.env.API_HOST
const API_PORT = process.env.API_PORT
const PIXEL_ID = process.env.PIXEL_ID
const VF_HOST = process.env.VF_HOST
const RECAPTCHA_KEY = process.env.RECAPTCHA_KEY
const FRONTEND_NAME = process.env.KEY_FRONTEND_SERVER_NAME
const BACKEND_NAME = process.env.KEY_BACKEND_OAUTH_SERVER_NAME
let plugins = [
	["component", {
  "libraryName": "vant",
  "libraryDirectory": "es",
  style: false
}],
	['import', { libraryName: 'ant-design-vue' }, 'ant-design-vue'],
	["@babel/plugin-proposal-decorators", { legacy: true }],
	["@babel/plugin-proposal-class-properties", { loose: true }]
]
// 如果为正式服则添加去除console
// if (process.env.NODE_ENV === 'production') {
//   plugins.push('transform-remove-console')
// }

module.exports = {
  mode: 'universal',
  buildDir: (NODE_ENV ? `${NODE_ENV}` : '') + '_nuxt',
  debug: true,
  render: {
    http2: {
      push: true
    },

    bundleRenderer: {
      /**
       * nuxt是基于vue的ssr解决方案，可以是使用vue语法完成前后端的同构。
       * 然而在与传统纯字符串拼接的ssr方案相比，性能就没那么好了，
       * nuxt需要在服务端生成虚拟dom，然后再序列化出HTML字符串，
       * 我们常说nodejs的高性能指的是异步IO操作频繁的场景而非CPU操作密集的场景，
       * 毕竟nodejs是运行在单线程下的，在涉及到高并发的场景下，性能就会有所下降，可以考虑采用合理的缓存策略
       * 会引发问题：https://visonsoft.cn/2018/07/05/vue-nuxt-ssr/
       * 不适用：style的module冲突
      */
      // cache: new LRU({
      //     max: 10,
      //     maxAge: 1000 * 60 * 15
      // })
    }
  },
  env: {
    frontendUrl: FRONTEND_NAME ? `https://${FRONTEND_NAME}` : '',//前端域名
    backendUrl: BACKEND_NAME ? `https://${BACKEND_NAME}` : '',//fb登录用的重定向服务端域名
    ga_id: process.env.GA_ID,//谷歌分析ID
    recaptcha_key: RECAPTCHA_KEY,
    NODE_ENV: NODE_ENV,//环境服
    facebookId: process.env.APP_FACEBOOK_ID_KEY,//fb id
    version: pkg.version

  },
  // serverMiddleware: [
  //   '~/server/index.ts'
  // ],
  router: {
    middleware: 'authenticated'
  },
	/*
	** Headers of the page
	*/
  head: {
    title: pkg.name,
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover"
      },
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "format-detection", content: "telephone=no" },
      { name: "apple-mobile-web-app-title", content: "bidogoo" },
      { httpEquiv: "Access-Control-Allow-Origin", content: "*" },
      { httpEquiv: "Pragma", content: "no-cache" },
      { httpEquiv: "Expires", content: "0" },
      { httpEquiv: "Cache-Control", content: "no-cache" }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ]
  },
	/*
	** Customize the progress-bar color
	*/
  loading: { color: '#409EFF' },
  /*
** Global CSS
*/
  css: [
    { src: "~/assets/scss/common.scss", lang: 'scss' },
	  'ant-design-vue/dist/antd.css'
  ],
  styleResources: {
    scss: [
      "~/assets/scss/theme.scss",
      "~/assets/scss/mixin.scss",
    ],
  },
  /*
  ** Build configuration
  */
  build: {
    extractCSS: process.env.NODE_ENV != 'development',
    publicPath: VF_HOST ? '//' + VF_HOST + '/_nuxt/' : '/_nuxt/',
    /*
    ** You can extend webpack config here
    */
    extend(config, { isDev, isServer }) {
      if (isDev && process.client) {
        config.module.rules.push({
			test: /\.ts$/,
			exclude: [/node_modules/, /vendor/, /\.nuxt/],
			loader: 'ts-loader',
			options: {
				fix: true
			}
        })
      }
    },

    babel: {
      "plugins": plugins
    },

    postcss: {
      plugins: {
        'postcss-pxtorem': {
          rootValue: 16,
          unitPrecision: 5,
          propList: ['*'],
          selectorBlackList: [],
          replace: true,
          mediaQuery: false,
          minPixelValue: 1
        }
      }
    }
  },


  transition: {
    name: "page",
    mode: "out-in"
  },
	/*
	** Plugins to load before mounting the App
	*/
  plugins: [
    "~/plugins/i18n.ts",
	  {src: '~/plugins/antd.ts', ssr: true},
  ],

	/*
	** Nuxt.js modules
	*/
  modules: [
    '@nuxtjs/style-resources',
    "@nuxtjs/apollo",
    "@nuxtjs/proxy",
    '@nuxtjs/sentry',
    "nuxt-facebook-pixel",
    [
      'nuxt-i18n',

      {
        locales: [
          {
            code: "th",
            iso: "th-TH",
            file: 'th-TH.js'
          },
          {
            code: "en",
            iso: "en-US",
            file: 'en-US.js'
          },
          {
            code: "zh",
            iso: "zh-CN",
            file: 'zh-CN.js'
          }

        ],
        strategy: 'prefix_except_default',//防止重复的路由名称问题
        lazy: true,
        langDir: 'locales/bidogoo/',
        vueI18nLoader: true,
        defaultLocale: "th",
        detectBrowserLanguage: {
          useCookie: true,
          alwaysRedirect: false,
          cookieKey: "i18n_redirected",
          fallbackLocale: "th",
        },
        seo: false,
        parsePages: false,
        encodePaths: true,
      }]
  ],
  apollo: {
    tokenName: "token",
    tokenExpires: 30,
    includeNodeModules: true,
    authenticationType: "",
    clientConfigs: {
      default: "~/graphql/apollo-config.ts"
    },
    // optional
    errorHandler: '~/plugins/apollo-error-handler.ts',
  },
  proxy: {
    '/zh/api': { target: (API_HOST ? `http://${API_HOST}:${API_PORT}` : 'http://www.baidu.com') + `/zh/api`, pathRewrite: { "^/zh/api": "" } },
  },
  "facebook-pixel": {
    enable: true,
    id: PIXEL_ID + ''
  }

}




