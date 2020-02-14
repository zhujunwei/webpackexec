## 插件

1. html-webpack-plugin 把打包的js自动添加到html模板中
2. copy-webpack-plugin 用于拷贝资源文件
3. clean-webpack-plugin 清除打包文件
4. webpack-merge 合并webpack 配置文件
5. webpack webpack-cli
6. webpack-dev-server 开发环境服务


## loaders 

### 1. babel-loader 解析 js 需要@babel/core @babel/preset-env
  生成.babelrc文件，
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
    修改.babelrc
    ```
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




