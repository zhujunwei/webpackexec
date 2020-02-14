const path = require("path");
const development = require("./webpack.dev");
const production = require("./webpack.prod");
const merge = require('webpack-merge');
const htmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

module.exports = (env) => {
  const basicConfig = {
    entry: {
      main: path.resolve(__dirname, "../src/index.js"),
      // a: path.resolve(__dirname, "../src/a.js"), // 多文件打包
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, "../dist")
    },
    module: {
      rules: [{
        test: /(\.js)$/,
        exclude: /node_modules/,
        use: {
          loader: "eslint-loader"
        },
        enforce: "pre" // 强制在所有js的loader之前执行
      },
      {
        test: /(\.js)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new htmlWebpackPlugin({
        template: path.resolve(__dirname, "../public/index.html"),
        filename: "index.html",
        hash: true,
        minify: env.production ? { //压缩
          removeAttributeQuotes: true,
          collapseWhitespace: true
        } : false,
        chunksSortMode: "dependency",
        chunks: ["main"]
      }),
      // new htmlWebpackPlugin({ //多个html 生成多个html文件
      //   template: path.resolve(__dirname, "../public/index.html"),
      //   filename: "index_a.html",
      //   hash: true,
      //   minify: env.production ? { //压缩
      //     removeAttributeQuotes: true,
      //     collapseWhitespace: true
      //   } : false,
      //   chunksSortMode: "dependency",
      //   chunks: ["a"]
      // }),
    ]
  }

  return env.production ? merge(basicConfig, production) : merge(basicConfig, development)

}