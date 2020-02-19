const path = require('path');
const AddAssetHtmlWebpackPlugin = require("add-asset-html-webpack-plugin");
const Webpack = require('webpack');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    compress: true, // 开启gzip压缩,
    port: 3030,
    open: true, // 自动打开
    overlay: true, // 弹出错误提示层
    hot: true,
  },
  plugins: [
    new AddAssetHtmlWebpackPlugin({
      filepath: path.resolve(__dirname, '../dll/_dll_react.js')
    }),
    new AddAssetHtmlWebpackPlugin({
      filepath: path.resolve(__dirname, '../dll/_dll_reactdom.js')
    }),
    new Webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, "../dll", "react.manifest.json")
    }),
    new Webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, "../dll", "reactdom.manifest.json")
    })
  ]
};
