/**
 * 工程配置文件
 */
const path = require('path')

function getPath(relative) {
  const cwd = process.cwd()
  return path.join(cwd, relative)
}

module.exports = {
  builder: '@lingzhi/gen-webpack', // 指明构建插件
  title: 'scrm', // 其他配置
  webpackDev: {
    // 个性化 webpack 配置，覆盖默认
    // port:5555
  },
  webpackProd: {},
  webpackCommon: {
    // 个性化 webpack 配置，覆盖默认
  },
  webpackDll: {},
  babelrc: {
    // plugins: [
    //   [
    //     'import',
    //     {
    //       libraryName: '@lingzhi/calcium-react-components',
    //       libraryDirectory: 'components',
    //       camel2DashComponentName: false,
    //     },
    //     'lz-react-components',
    //   ],
    // ],
  },
  // 额外配置的解析文件 => 绝对路径
  extendsPkgs: [getPath('node_modules/@lingzhi/calcium-react-components')],
}
