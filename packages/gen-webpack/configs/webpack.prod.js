const webpack = require("webpack"),
  path = require("path"),
  merge = require("webpack-merge"),
  BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin,
  AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin"),
  MiniCssExtractPlugin = require("mini-css-extract-plugin"),
  OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin"),
  getPath = require("../scripts/getPath"),
  HtmlWebpackPlugin = require("html-webpack-plugin");

const analyzeEnabled = process.argv.splice(2).indexOf("--analyze") !== -1;
const { webpackDll } = require(getPath("/config.js"));
const keys = webpackDll.entry ? Object.keys(webpackDll.entry) : [];

function dlls() {
  if (process.env.NODE_ENV === "production") {
    return keys.map(item => {
      return new webpack.DllReferencePlugin({
        context: getPath("/"),
        manifest: require(getPath(`dll/${item}.dll.manifest.json`))
      });
    });
  }
  return [];
}

module.exports = webpackCustomConifg => {
  return {
    mode: "production",
    context: getPath("src"),
    entry: {
      index: "./index.jsx"
    },
    output: {
      path: getPath("dist"),
      filename: "common.[contenthash:8].js",
      chunkFilename: "module.[name].[contenthash:8].js",
      publicPath: `${webpackCustomConifg.publicPathPrefix}/`,
      libraryTarget: "umd"
    },
    stats: {
      children: false,
      assets: false,
      warnings: false
    },
    optimization: {
      minimize: true,
      runtimeChunk: "single", // 将多入口的webpack运行时文件打包成一个 runtime文件
      namedChunks: true, // 打包后的代码更有意义，比如 索引 [1,2] 变成 ['run-app','b']
      splitChunks: {
        automaticNameDelimiter: "_", // 文件名称分隔符
        cacheGroups: {
          styles: {
            test: /\.(css|scss|less)$/,
            enforce: true // force css in new chunks (ignores all other options)
          },
          npm: {
            test: /node_modules\/(?!@ant-design|antd)/,
            chunks: "all",
            reuseExistingChunk: true,
            name: "npm"
          },
          antd: {
            test: /node_modules\/(@ant-design|antd)/,
            chunks: "all",
            reuseExistingChunk: true,
            name: "antd"
          }
        }
      }
    },
    plugins: [
      // webpack 打包momentjs时会把所有语言包都打包，这样会使打包文件很大。
      // 此插件可以帮助我们只打包需要的语言包，大大减小打包文件大小。
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn|en-us/),
      new BundleAnalyzerPlugin({
        analyzerMode: analyzeEnabled ? "server" : "disabled"
      }),
      new webpack.DllReferencePlugin({
        context: getPath("/"),
        manifest: require(getPath("dll/vendor.dll.manifest.json"))
      }),
      // new webpack.DllReferencePlugin({
      //   context: getPath("/"),
      //   manifest: require(getPath("dll/react.dll.manifest.json"))
      // }),
      new webpack.DllReferencePlugin({
        context: getPath("/"),
        manifest: require(getPath("dll/lodash.dll.manifest.json"))
      }),
      ...dlls(),
      new AddAssetHtmlPlugin({
        publicPath: `${webpackCustomConifg.publicPathPrefix}/dll`, // 注入到html中的路径
        outputPath: "/dll", // 将项/dll目录中的js文件复制/dist/dll目录中
        filepath: getPath("dll/*.dll.js"),
        includeSourcemap: false
      }),
      new MiniCssExtractPlugin({
        filename: "[contenthash:8].css",
        chunkFilename: "[contenthash:8].css"
      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /.css$/,
        cssProcessor: require("cssnano"),
        sourceMap: false,
        cssProcessorOptions: {
          discardComments: {
            removeAll: true
          },
          zindex: false, // 转换源码的时候防止z-indx被修改
          safe: true // 同理
        }
      }),
      new HtmlWebpackPlugin({
        minify: {},
        chunks: ["lib", "index"],
        pathPrefix: webpackCustomConifg.publicPathPrefix,
        template: getPath("src/index.ejs")
      })
    ]
  };
};
