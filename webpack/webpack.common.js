/* Base config:
  ========================================================================== */

const defines = require('./webpack-defines')
const pages = require('./webpack-pages')

// `assets/img/*` => `static/img/*`
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const isDev = process.env.NODE_ENV !== 'production'

module.exports = {
  entry: {
    app: `${defines.src}/index.ts`
    // another app example:
    // auth: `${defines.src}/_auth/index.ts`
  },
  output: {
    path: defines.dist,
    filename: `${defines.assets}js/[name].[contenthash].js`
    // filename: `${defines.assets}js/[name].js`
  },
  optimization: {
    chunkIds: 'named',
    mergeDuplicateChunks: true,
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          name: 'vendors', // or comment name to make chunks works
          chunks: 'all',
          // the way to keep kit in the vendors
          test: /[\\/]node_modules[\\/]|[\\/]ui-kit[\\/]/,
          priority: -10,
          reuseExistingChunk: true
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',

          options: {
            // react-refresh example:
            // plugins: [isDev && require.resolve('react-refresh/babel')].filter(Boolean)
          }
        }
      },
      {
        test: /\.(css|styl)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    // add more postcss plugins here
                    // ...
                    // https://www.npmjs.com/package/postcss-preset-env
                    // it's including autoprefixer by default (config is in `package.json`)
                    // pass `autoprefixer: false` to disable autoprefixer
                    'postcss-preset-env'
                  ]
                ],
                postcssOptions: {
                  parser: 'postcss-js'
                },
                execute: true
              }
            }
          },
          {
            loader: 'stylus-loader',
            options: {
              sourceMap: isDev
            }
          }
        ]
      },
      // svg in js(x) & ts(x)
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: [
          // https://react-svgr.com/docs/webpack/
          '@svgr/webpack'
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/i,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   title: 'Home page',
    //   favicon: defines.src + '/shared/misc/favicon.ico',
    //   template: defines.public + '/index.html',
    //   filename: 'index.html' // output file
    // }),
    // new HtmlWebpackPlugin({
    //   title: 'About page',
    //   favicon: defines.src + '/shared/misc/favicon.ico',
    //   template: defines.public + '/about.html',
    //   filename: 'about.html' // output file
    // }),
    ...pages.map(
      page =>
        new HtmlWebpackPlugin({
          title: page.title,
          template: defines.public + '/' + page.template,
          filename: page.filename,
          // default:
          favicon: defines.src + '/shared/misc/favicon.png'
        })
    ),
    // https://webpack.js.org/plugins/mini-css-extract-plugin/
    new MiniCssExtractPlugin({
      filename: `${defines.assets}css/[name].[contenthash].css`,
      // filename: `${defines.assets}css/[name].css`,
      chunkFilename: '[id].css'
    }),
    new CopyWebpackPlugin({
      patterns: [
        // `shared/img` => `dist/static/img`
        {
          from: `${defines.src}/shared/img`,
          to: `${defines.dist}/${defines.static}/img`
        },
        // `shared/fonts` => `dist/static/fonts`
        // {
        //   from: `${defines.src}/shared/fonts`,
        //   to: `${defines.dist}/${defines.static}/fonts`
        // },
        {
          from: `${defines.src}/shared/misc`,
          to: `${defines.dist}`
        }
      ]
    })
  ],
  resolve: {
    alias: {
      // no need since I use `tsconfig` & `jsconfig`
      // '@': defines.src
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  }
}
