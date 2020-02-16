# Webpack中必须掌握的配置
loader主要用于把模块原内容按照需求转换成新内容，可以加载非 JS 模块！  
通过使用不同的Loader，Webpack可以把不同的文件都转成JS文件,比如CSS、ES6/7、JSX等。  

我们来看看这些我们必须掌握的loader!


## 1.loader的编写
### 1.1 loader的使用
- test：匹配处理文件的扩展名的正则表达式
- use：loader名称，就是你要使用模块的名称
- include/exclude:手动指定必须处理的文件夹或屏蔽不需要处理的文件夹
- options:为loaders提供额外的设置选项

默认`loader`的顺序是**从下到上**、**从右向左**执行，当然执行顺序也可以手动定义的，接下来我们依次介绍常见的loader，来感受`loader`的魅力!

我们基于这个基础配置来继续编写:
```javascript
const path = require("path");
const dev = require("./webpack.dev");
const prod = require("./webpack.prod");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const base = {
  entry:'./src/index.js',
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "../dist")
  },
  plugins: [
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.resolve(__dirname, "../public/template.html"),
        hash: true,
        minify: {
            removeAttributeQuotes: true
        }
    }),
    new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [path.resolve('xxxx/*'),'**/*'],
    }),
  ]
};
module.exports = env => {
  if (env.development) {
    return merge(base, dev);
  } else {
    return merge(base, prod);
  }
};
```


## 2.处理CSS文件

### 2.1 解析css样式
我们在`js`文件中引入css样式！
```javascript
import './index.css';
```

再次执行打包时，会提示css无法解析
```bash
ERROR in ./src/index.css 1:4
Module parse failed: Unexpected token (1:4)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
```

**安装loader**

```bash
npm install style-loader css-loader --save-dev
```

```javascript
module: {
  rules: [
    {
       test: /\.css$/,
       use: ["style-loader", "css-loader"]
    }
  ]
}
```

### 2.2 抽离样式文件
默认只在打包时进行样式抽离
```javascript
module.exports = env => {
  let isDev = env.development;
  const base = {/*source...*/}
  if (isDev) {
    return merge(base, dev);
  } else {
    return merge(base, prod);
  }
};

```

安装抽离插件
```bash
npm install mini-css-extract-plugin --save-dev
```

配置抽离插件
```javascript
{
    test: /\.css$/,
    use: [
        !isDev && MiniCssExtractPlugin.loader,
        isDev && 'style-loader',
        "css-loader"
    ].filter(Boolean)
}
!isDev && new MiniCssExtractPlugin({
    filename: "css/[name].css"
})
```


最终文件配置贴一下:
```javascript
const path = require("path");
const dev = require("./webpack.dev");
const prod = require("./webpack.prod");
const merge = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = env => {
  let isDev = env.development;
  const base = {
    entry: "./src/index.js",
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "../dist")
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            !isDev && MiniCssExtractPlugin.loader,
            isDev && 'style-loader',
            "css-loader"
          ].filter(Boolean)
        }
      ]
    },
    plugins:[
        !isDev && new MiniCssExtractPlugin({
          filename: "css/[name].css"
        }),
        new HtmlWebpackPlugin({
          filename: "index.html",
          template: path.resolve(__dirname, "../public/template.html"),
          hash: true,
          minify: {
            removeAttributeQuotes: true
          }
        }),
      ].filter(Boolean)
  };
  if (isDev) {
    return merge(base, dev);
  } else {
    return merge(base, prod);
  }
};
```

### 2.3 css预处理器
不同的css预处理器要安装不同的loader来进行解析
- sass: sass-loader node-sass
- less: less-loader less
- stylus: stylus-loader stylus

使用`sass`
```javascript
{
    test:/\.scss$/,
    use:[
        !isDev && MiniCssExtractPlugin.loader,
        isDev && 'style-loader',
        "css-loader",
        "sass-loader"
    ].filter(Boolean)
}
```

在css文件中可能会使用`@import`语法引用`css`文件,被引用的`css`文件中可能还会导入`scss`

```javascript
{
    test: /\.css$/,
    use: [
    !isDev && MiniCssExtractPlugin.loader,
    isDev && 'style-loader',
    {
        loader:"css-loader",
        options:{
            importLoaders:1 // 引入的文件需要调用sass-loader来处理 
        }
    },
    "sass-loader"
    ].filter(Boolean)
},
```

### 2.4 处理样式前缀
使用`postcss-loader`增加样式前缀
```bash
npm install postcss-loader autoprefixer
```

在处理css前先增加前缀
```javascript
 {
    test: /\.css$/,
    use: [
    !isDev && MiniCssExtractPlugin.loader,
    isDev && 'style-loader',
    {
        loader:"postcss-loader",
        options:{
            plugins:[require('autoprefixer')]
        }
    },
    "postcss-loader",
    "sass-loader"
    ].filter(Boolean)
},
```

或者也可以创建`postcss`的配置文件`postcss.config.js`
```javascript
module.exports = {
    plugins:[
        require('autoprefixer')
    ]
}
```

可以配置浏览器的兼容性范围  [.browserslistrc](https://github.com/browserslist/browserslist)

```
cover 99.5%
```

### 2.5 css压缩
在生产环境下我们需要压缩`css`文件,配置`minimizer`选项,安装压缩插件

```bash
npm i optimize-css-assets-webpack-plugin terser-webpack-plugin --save-dev
```

在`webpack.prod.js`文件中配置压缩
```javascript
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
optimization:{
    minimizer:[new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
}
```

### 2.6 文件指纹
- Hash整个项目的hash值
- chunkhash 根据入口产生hash值
- contentHash 根据每个文件的内容产生的hash值

我们可以合理的使用`hash`戳，进行文件的缓存

```javascript
!isDev && new MiniCssExtractPlugin({
    filename: "css/[name].[contentHash].css"
})
```

## 3.处理文件类型
### 3.1 处理引用的图片
```javascript
import logo from './webpack.png';
let img = document.createElement('img');
img.src = logo;
document.body.appendChild(img);
```

使用`file-loader`,会将图片进行打包，并将打包后的路径返回
```javascript
{
    test:/\.jpe?g|png|gif/,
    use:{
        loader:'file-loader',
        options:{
            name:`img/[name].[ext]`
        }
    }
}
```

### 3.2 处理icon
二进制文件也是使用`file-loader`来打包
```javascript
{
    test:/woff|ttf|eot|svg|otf/,
    use:{
        loader:'file-loader'
    }
}
```

### 3.3 转化成base64
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

## 4.处理JS模块
### 4.1 将`es6`代码编译成`es5`代码
代码的转化工作要交给`babel`来处理

```bash
npm install @babel/core @babel/preset-env babel-loader --save-dev
```

`@babel/core`是babel中的核心模块，`@babel/preset-env` 的作用是es6转化es5插件的插件集合，`babel-loader`是`webpack`和`loader`的桥梁。

```javascript
const sum = (a, b) => {
  return a + b;
};
```

增加`babel`的配置文件 `.babelrc`

```json
{
    "presets": [
       ["@babel/preset-env"]
    ]
}
```

**配置loader**

```javascript
module: {
	rules: [{ test: /\.js$/, use: "babel-loader" }]
},
```

现在打包已经可以成功的将es6语法转化成es5语法！



### 4.2 解析装饰器

```bash
npm i @babel/plugin-proposal-class-properties @babel/plugin-proposal-decorators --save-dev
```

```json
"plugins": [
  ["@babel/plugin-proposal-decorators", { "legacy": true }],
  ["@babel/plugin-proposal-class-properties",{"loose":true}]
]
```

`legacy:true`表示继续使用装饰器装饰器，loose为false时会采用`Object.defineProperty`定义属性


- Plugin会运行在Preset之前
- Plugin 会从第一个开始顺序执行，Preset则是相反的


### 4.3 polyfill
根据`.browserslistrc`文件，转化使用到的浏览器api
```javascript
"presets": [
    ["@babel/preset-env",{
        "useBuiltIns":"usage", // 按需加载
        "corejs":2 // corejs 替代了以前的pollyfill
    }]
]
```

安装corejs

```bash
npm install core-js@2 --save
```

> **使用`transform-runtime`**
A plugin that enables the re-use of Babel's injected helper code to save on codesize.可以帮我们节省代码

```bash
npm install --save-dev @babel/plugin-transform-runtime @babel/runtime
```

在`.babelrc`中配置插件

```json
"plugins": [
    "@babel/plugin-transform-runtime"
]
```


### 4.4 添加eslint
安装`eslint`
```bash
npm install eslint
npx eslint --init # 初始化配置文件
```

```
{
    test:/\.js/,
    enforce:'pre',
    use:'eslint-loader'
},
```

> 配置`eslint-loader`可以实时校验js文件的正确性,`pre`表示在所有`loader`执行前执行


