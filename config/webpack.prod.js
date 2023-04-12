const path = require("path") // node.js的核心模块，专门用来处理路径问题
const ESLintPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")// 单独打包css文件，优化性能，解决闪屏问题
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin") // css压缩 生产模式HTML js 默认压缩

function getStyleLoader(pre) { // 用来处理获取样式的loader
  return [
    // 执行顺序 从右到左，从下到上
    MiniCssExtractPlugin.loader, // 将js中css通过创建style标签在html文件中生效
    "css-loader",
    { // -----css兼容性解决
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            'postcss-preset-env', // 能解决大多数央视兼容性问题
          ]
        }
      }
    },
    pre
  ].filter(Boolean)
}

module.exports = {
  // 入口
  entry: './src/main.js', // 相对路径
  // 输出
  output: {
    // --所有--文件的输出路径 __dirname node.js的变量，代表当前文件夹的目录
    path: path.resolve(__dirname, '../dist'), // 绝对路径
    // 入口文件打包输出文件名
    filename: "static/pack.js", // 文件名
    clean: true // 自动清空上一次的打包记录  --原理-- 在打包前将path整个目录清空，在进行打包
  },
  // 加载器
  module: {
    rules: [
      {
        oneOf: [
          // 对样式的处理
          // loader的配置，webpack只能处理js,json文件，其他文件需要借助其他处理
          {
            test: /\.css$/i, // 只检测.css文件
            use: getStyleLoader()
            // use: [
            //   // 执行顺序 从右到左，从下到上
            //   MiniCssExtractPlugin.loader, // 将js中css通过创建style标签在html文件中生效
            //   "css-loader",
            //   { // -----css兼容性解决
            //     loader: "postcss-loader",
            //     options: {
            //       postcssOptions: {
            //         plugins: [
            //           'postcss-preset-env', // 能解决大多数央视兼容性问题
            //         ]
            //       }
            //     }
            //   }
            // ] // 将css资源编译成commontjs的模块到js中
          },
          {
            test: /\.less$/i,
            // loader: 只能使用一个loader
            use: getStyleLoader('less-loader')
            // use: [
            //   // 使用多个loader
            //   MiniCssExtractPlugin.loader,
            //   'css-loader',
            //   {
            //     loader: "postcss-loader",
            //     options: {
            //       postcssOptions: {
            //         plugins: [
            //           'postcss-preset-env', // 能解决大多数央视兼容性问题
            //         ]
            //       }
            //     }
            //   },
            //   'less-loader'
            // ]
          },
          {
            test: /\.s[ac]ss$/i,
            use: getStyleLoader('sass-loader')
            // use: [
            //   MiniCssExtractPlugin.loader,
            //   'css-loader',
            //   {
            //     loader: "postcss-loader",
            //     options: {
            //       postcssOptions: {
            //         plugins: [
            //           'postcss-preset-env', // 能解决大多数央视兼容性问题
            //         ]
            //       }
            //     }
            //   },
            //   'sass-loader'
            // ]
          },
          {
            test: /\.styl$/,
            use: getStyleLoader('stylus-loader')
            // use: [
            //   MiniCssExtractPlugin.loader,
            //   'css-loader',
            //   {
            //     loader: "postcss-loader",
            //     options: {
            //       postcssOptions: {
            //         plugins: [
            //           'postcss-preset-env', // 能解决大多数央视兼容性问题
            //         ]
            //       }
            //     }
            //   },
            //   'stylus-loader'
            // ]
          },
          // 对图片的处理
          {
            test: /\.(png|jpe?g|gif|webp|svg)$/,
            type: 'asset',
            parser: {
              dataUrlCondition: {
                // 小于10k的图片转base64  优点： 减少请求次数 缺点：体积会大一点
// 页面性能的一种优化
                maxSize: 10 * 1024 // 4kb
              }
            },
            generator: {
              // 输出图片名称
              // [hash:10] hash名取前十位
              filename: 'static/imgs/[hash:10][ext][query]'
            }
          },
          // 对字体，音频的处理
          {
            test: /\.(ttf|woff2?|mp3|mp4|avi)$/,
            type: 'asset/resource', // 文件原封不动的输出，不转base64
            generator: {
              // 输出字体名称
              filename: 'static/fonts/[hash:10][ext][query]'
            }
          },
          // 对babel的处理
          {
            test: /\.js$/,
            // exclude: /(node_modules)/, // 排除对依赖文件的处理
            include: path.resolve(__dirname, '../src'), // 只处理src下的文件，其他文件不处理 -----------和exclude只能用一种，同时用会报错----------
            use: {
              loader: 'babel-loader',
              //  presets: ['@babel/preset-env']写在这里可以，也可以写在babel.config.js文件中
              options: {
                // presets: ['@babel/preset-env']
                cacheDirectory: true, // 开启Babel缓存
                cacheCompression: false // 关闭缓存文件压缩
              }
            }
          }
        ]
      }
    ]
  },
  // 插件
  plugins: [
    // plugin的配置
    new ESLintPlugin({
      context: path.resolve(__dirname, '../src'),
      exclude: 'node-module', // 默认值
      cacheLocatione: path.resolve(__dirname, '../node_modules/.cache/eslintcache')
    }),
    new HtmlWebpackPlugin({
    // 模块：以public/index.html文件创建新的HTML文件
    // 新的HTML文件特点：1，结构与原来一样，2，自动引入打包输出的资源
      template: path.resolve(__dirname, '../public/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/min.css'
    }),
    new CssMinimizerPlugin()
  ],
  // --生产模式不需要devServer
  // devServer: {
  //   host: 'localhost', // 启动服务器的域名
  //   port: '3000', // 启动服务器的端口号
  //   open: true // 是否自动打开浏览器
  // },
  // 模式
  mode: "production", // 生产模式
  devtool: "source-map" // 行和列的映射
}
