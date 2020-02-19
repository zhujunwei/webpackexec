const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssWebpackPlugin = require('mini-css-extract-plugin');
const Webpack = require('webpack');
const production = require('./webpack.prod');
const development = require('./webpack.dev');

module.exports = (env) => {
  const basicConfig = {
    entry: {
      main: path.resolve(__dirname, '../src/index.js'),
      // a: path.resolve(__dirname, "../src/a.js"), // 多文件打包
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, '../dist'),
    },
    module: {
      rules: [
        {
          test: /(\.js)$/,
          include: path.resolve('src'),
          use: {
            loader: 'eslint-loader',
          },
          enforce: 'pre', // 强制在所有js的loader之前执行
        },
        {
          test: /(\.js)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /(\.woff|ttf|eot|otf)$/,
          exclude: /node_modules/,
          use: {
            loader: 'file-loader',
            options: {
              name: 'files/[name].[contenthash].[ext]',
            },
          },
        },
        {
          test: /(\.jpg|png|gif|svg)$/,
          exclude: /node_modules/,
          use: {
            loader: 'url-loader',
            options: {
              name: 'img/[name].[contenthash].[ext]',
              limit: 40960,
            },
          },
        },
        {
          test: /(\.css|less)$/,
          exclude: /node_modules/,
          use: [
            env.production && MiniCssWebpackPlugin.loader,
            !env.production && 'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2, // import 引入的文件需要调用下面的css来处理来处理
              },
            },
            'postcss-loader',
            'less-loader',
          ].filter(Boolean),
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.json', ".css"],
      alias: {
        image: path.resolve(__dirname, '../src/assets/image'),
      },
    },
    plugins: [
      env.production
      && new MiniCssWebpackPlugin({
        filename: 'css/[name].[contentHash].css',
      }),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '../public/index.html'),
        filename: 'index.html',
        hash: true,
        minify: env.production
          ? {
            // 压缩
            removeAttributeQuotes: true,
            collapseWhitespace: true,
          }
          : false,
        chunksSortMode: 'dependency',
        chunks: ['main'],
      }),
      new Webpack.ProvidePlugin({
        _: 'lodash',
      })
    ].filter(Boolean),
  };

  return env.production
    ? merge(basicConfig, production)
    : merge(basicConfig, development);
};
