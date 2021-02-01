const webpack = require("webpack"),
  path = require("path"),
  merge = require("webpack-merge"),
  getPath = require("../scripts/getPath");

const { webpackDll } = require(getPath("/config.js"));

module.exports = merge(
  {
    mode: "production",
    entry: {
      // react: ["react", "react-dom"],
      vendor: [
        "react",
        "react-dom",
        "react-intl",
        "react-router",
        "react-router-dom",
        "redux",
        "react-redux",
        "redux-saga",
        "@rematch/core"
      ], // 打包出来如果太大就再区分
      // rside: ['react-intl', 'redux-saga', '@rematch/core'],
      lodash: ["lodash"]
    },
    output: {
      filename: "[name]-[hash].dll.js",
      path: getPath("dll"),
      library: "_dll_[name]"
      // vendor.dll.js中暴露出的全局变量名。
      // 主要是给DllPlugin中的name使用，
      // 故这里需要和webpack.DllPlugin中的`name: '[name]_library',`保持一致。
    },
    plugins: [
      new webpack.DllPlugin({
        name: "_dll_[name]",
        context: getPath("/"),
        path: getPath("/dll/[name].dll.manifest.json")
      })
    ]
  },
  webpackDll
);
