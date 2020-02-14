const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = {
  mode: "production",
  plugins: [
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, "../public/favicon.ico"),
      to: path.resolve(__dirname, "../dist/favicon.ico"),
    }])
  ]
}