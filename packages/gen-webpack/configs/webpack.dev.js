const webpack = require("webpack"),
  path = require("path"),
  merge = require("webpack-merge"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  DashboardPlugin = require("webpack-dashboard/plugin"),
  RouteWatchPlugin = require("../scripts/routeWatchPlugin"),
  getPath = require("../scripts/getPath"),
  AsyncAPIConf = require("../scripts/asyncAPIConf"),
  escape = require("escape-string-regexp");

function ignoredFiles() {
  return new RegExp(
    `^(?!${escape(
      path.normalize(getPath("src") + "/").replace(/[\\]+/g, "/")
    )}).+/node_modules/`,
    "g"
  );
}

module.exports = webpackCustomConifg => {
  const devServerPort = webpackCustomConifg.port || 5555;

  return {
    mode: "development",
    devtool: "inline-source-map", // 生产环境省略，eval-source-map
    entry: [
      `webpack-dev-server/client?http://localhost:${devServerPort}`,
      "webpack/hot/dev-server",
      getPath("src/index.jsx")
    ],
    output: {
      path: getPath("dist"),
      publicPath: "/", // 当前启动的访问路径
      filename: "[name].js"
    },
    plugins: [
      new RouteWatchPlugin(),
      new AsyncAPIConf(),
      new HtmlWebpackPlugin({
        template: getPath("src/index.ejs")
      }),
      new webpack.NamedModulesPlugin(),
      new DashboardPlugin()
    ],
    resolve: {
      alias: {
        "react-dom": "@hot-loader/react-dom"
      }
    },
    devServer: {
      public: `http://localhost:${devServerPort}`,
      publicPath: "/",
      open: false,
      openPage: "../",
      stats: { chunks: false },
      contentBase: getPath("dist"),
      port: devServerPort,
      host: "0.0.0.0",
      hot: true,
      disableHostCheck: true,
      http2: false,
      compress: true,
      clientLogLevel: "none",
      quiet: true,
      headers: {
        "access-control-allow-origin": "*"
      },
      watchOptions: {
        ignored: [getPath("node_modules"), ignoredFiles()],
        aggregateTimeout: 600 // 以防更新子模块太快导致的崩溃
      },
      overlay: false,
      proxy: {
        // "/api": {
        //   target: "http://xxx.com/",
        //   changeOrigin: true,
        //   secure: false
        // }
      }
    }
  };
};
