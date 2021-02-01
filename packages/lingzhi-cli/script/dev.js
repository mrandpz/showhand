/**
 * webpack 构建
 */

module.exports = async function() {
  // 获取打包的function
  const buildFn = await this.getBuilderFn();
  const { webpackCustom = {} } = this.getConfigs();
  this.console("wait a moment");
  buildFn(
    {
      type: "dev"
    },
    webpackCustom
  );
};
