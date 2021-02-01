const webpack = require("webpack"),
  merge = require("webpack-merge"),
  babelMerge = require("babel-merge"),
  path = require("path"),
  os = require("os"),
  fs = require("fs"),
  getPath = require("../scripts/getPath"),
  MiniCssExtractPlugin = require("mini-css-extract-plugin"),
  CopyWebpackPlugin = require("copy-webpack-plugin");

const pathPrefixArg =
  process.argv.find(item => item.indexOf("--path-prefix=") === 0) || "";
const publicPathPrefix = pathPrefixArg
  ? pathPrefixArg.split("--path-prefix=")[1]
  : "";

const productionBuildConfig = require("./webpack.prod");
const developmentBuildConfig = require("./webpack.dev");

const isNotWindows = ["linux", "darwin"].includes(os.platform());
// isNotWindows
//   ? /node_modules\/@lingzhi-aeon\//
//   : /node_modules\\@lingzhi-aeon/;
const antdPackagesPath = getPath("node_modules/antd");
// isNotWindows
//   ? /node_modules\/antd\//
//   : /node_modules\\antd/;
const lessPackagesPath = getPath("src/assets/less");
// isNotWindows
//   ? /src\/assets\/less\//
//   : /src\\assets\\less/;

const {
  webpackDev,
  webpackProd,
  webpackCommon,
  extendsPkgs,
  babelrc
} = require(getPath("/config.js"));

const customPort = { port: webpackDev.port };
if (webpackDev.port) {
  delete webpackDev.port;
}

module.exports = merge(
  {
    mode: process.env.NODE_ENV,
    module: {
      // 加载器
      rules: [
        {
          loader: "webpack-ant-icon-loader",
          enforce: "pre",
          options: {
            chunkName: "antd-icons"
          },
          include: [getPath("node_modules/@ant-design/icons/lib/dist")]
        },
        {
          test: /\.(scss|css)$/,
          include: [/src/, ...extendsPkgs],
          use: [
            process.env.NODE_ENV === "production"
              ? undefined
              : "css-hot-loader",
            process.env.NODE_ENV === "production"
              ? MiniCssExtractPlugin.loader
              : "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: true,
                camelCase: true,
                localIdentName: "[local]_[name]_[hash:base64:6]"
              }
            },
            {
              loader: "fast-sass-loader",
              options: {
                data: `
                  @import "~scssinc";
                  $publicPathPrefix: "${publicPathPrefix}";
                  $ENV: ${process.env.NODE_ENV};
                `
              }
            }
          ].filter(item => item)
        },
        {
          test: /\.less$/,
          include: [/src/, ...extendsPkgs],
          exclude: [lessPackagesPath],
          use: [
            process.env.NODE_ENV === "production"
              ? undefined
              : "css-hot-loader",
            process.env.NODE_ENV === "production"
              ? MiniCssExtractPlugin.loader
              : "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: true,
                camelCase: true,
                localIdentName: "[local]_[name]_[hash:base64:6]"
              }
            },
            {
              loader: "less-loader",
              options: {
                javascriptEnabled: true
              }
            }
          ].filter(item => item)
        },
        {
          test: /\.less$/,
          include: [lessPackagesPath, antdPackagesPath],
          use: [
            process.env.NODE_ENV === "production"
              ? undefined
              : "css-hot-loader",
            process.env.NODE_ENV === "production"
              ? MiniCssExtractPlugin.loader
              : "style-loader",
            {
              loader: "css-loader"
            },
            {
              loader: "less-loader",
              options: {
                javascriptEnabled: true
              }
            }
          ].filter(item => item)
        },
        {
          test: /\.(css)$/,
          include: [/node_modules/],
          exclude: [...extendsPkgs],
          use: [
            process.env.NODE_ENV === "production"
              ? MiniCssExtractPlugin.loader
              : "style-loader",
            "css-loader"
          ].filter(item => item)
        },
        {
          test: /\.(js|jsx)$/,
          include: [/src/, ...extendsPkgs],
          use: [
            {
              loader: "babel-loader",
              options: babelMerge(
                {
                  ...JSON.parse(
                    fs.readFileSync(path.resolve(__dirname, "../.babelrc"))
                  )
                },
                babelrc
              )
            },
            "eslint-loader"
          ]
        },
        {
          test: /\.(png|jpg|svg)$/,
          include: [/src/, ...extendsPkgs],
          use: [
            {
              loader: "url-loader",
              options: {
                limit: false,
                name: "images/[name].[ext]"
              }
            }
          ]
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          include: [/src/, ...extendsPkgs],
          use: [
            {
              loader: "url-loader",
              options: {
                limit: false,
                name: "[name].[ext]",
                publicPath: getPath("./")
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new CopyWebpackPlugin([{ from: getPath("static"), to: "static" }])
    ],
    resolve: {
      modules: [getPath("src"), "node_modules"],
      alias: {
        "antd/dist/antd.css": getPath("src/assets/css/void.css"),
        react: getPath("node_modules/react"),
        scssinc: getPath("src/assets/scss/_inc.scss")
      },
      extensions: [".js", ".jsx", ".json"]
    }
  },
  webpackCommon,
  process.env.NODE_ENV === "production"
    ? productionBuildConfig({ publicPathPrefix })
    : developmentBuildConfig(customPort),
  process.env.NODE_ENV === "production" ? webpackProd : webpackDev
);
