/**
 * webpack 构建
 */

module.exports = async function() {
  const buildFn = await this.getBuilderFn();
  const { webpackCustom = {} } = this.getConfigs();
  this.console("wait a moment");
  buildFn(
    {
      type: "legacy"
    },
    webpackCustom
  );
};
