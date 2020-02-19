let path = require('path');
let webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: "production",
    entry: {
        react: ["react"],
        reactdom: ["react-dom"]
    },
    output: {
        filename: '_dll_[name].js',
        library: '_dll_[name]_[hash]',
        path: path.resolve(__dirname, "../dll")
    },
    plugins: [
        new CleanWebpackPlugin({
            path: path.resolve(__dirname, "../dll")
        }),
        new webpack.DllPlugin({
            name: '_dll_[name]_[hash]',
            path: path.resolve(__dirname, "../dll", "[name].manifest.json")
        })
    ]
};
