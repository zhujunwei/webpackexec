## 插件

1. html-webpack-plugin 把打包的 js 自动添加到 html 模板中
2. copy-webpack-plugin 用于拷贝资源文件
3. clean-webpack-plugin 清除打包文件
4. webpack-merge 合并 webpack 配置文件
5. webpack webpack-cli
6. webpack-dev-server 开发环境服务
7. mini-css-extract-plugin 抽离 css 生成 css 文件

## loaders

### 1. babel-loader 解析 js 需要@babel/core @babel/preset-env

生成.babelrc 文件，

```
  {
    "presets": [
      "@babel/preset-env"
    ],
    "plugins": []
  }
```

```
  //配置rules
  {
    test: /(\.js)$/,
    exclude: /node_modules/,
    use: {
      loader: "babel-loader"
    }
  }
```

浏览器兼容: 需要使用 @babel/plugin-transform-runtime transform-runtime,

    ```
      // 修改.babelrc
      {
        "presets": [
          [
            "@babel/preset-env",
            {
              "targets": {
                "browsers": [
                  "last 2 versions",
                  "ie >= 10"
                ]
              },
              "corejs": 2,
              "useBuiltIns": "usage" //usage 会根据配置的浏览器兼容，以及你代码中用到的 API 来进行 polyfill，实现了按需添加。
            }
          ]
        ],
        "plugins": [
          "@babel/plugin-transform-runtime"
        ]
      }

    ```

### 2. eslint-loader

安装 eslint-loader eslint eslint-config-airbnb-base 
生成 eslint --init 生成.eslintrc.js
````/* eslint-disable */ 禁止使用eslint 校验```
<!-- 使用 eslint-import-resolver-webpack 用于识别webpack alias -->

### 3. css-loader style-loader / node-sass sass-loader / less less-loader

解析 css sass less

### 4. postcss-loader autoprefixer 增加样式前缀

创建`postcss`的配置文件`postcss.config.js`

```javascript
module.exports = {
  plugins: [require("autoprefixer")]
};
```

### css 压缩

optimize-css-assets-webpack-plugin terser-webpack-plugin
在`webpack.prod.js`文件中配置压缩

```javascript
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
optimization: {
  minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})];
}
```

### img 解析 file-loader url-loader

  使用`url-loader`将满足条件的图片转化成base64,不满足条件的`url-loader`会自动调用`file-loader`来进行处理
  ```javascript
    {
        test:/\.jpe?g|png|gif/,
        use:{
            loader:'url-loader',
            options:{
                limit:100*1024,
                name:`img/[name].[ext]`
            }
        }
    }
  ```


### tree-shaking 

  package.json 的 "sideEffects" 属性来实现
