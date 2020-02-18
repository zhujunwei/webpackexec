const path = require('path');

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
};
