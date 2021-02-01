/**
 * 安装 generator 模板
 * 模板仓库前缀 gen-
 */

const execSync = require("child_process").execSync;

module.exports = async function(pkgName) {
  pkgName = pkgName || process.argv[3];
  // 如果有@lingzhi/gen- 前缀的直接安装，没有的话就加上
  pkgName = pkgName.match(/^@lingzhi\/gen\-/)
    ? pkgName
    : `@lingzhi/gen-${pkgName}`;
  const status = this.getInstalledStatus(pkgName, this.dir.tpl);

  if (status === 2) {
    this.console("您已经安装最新版，无需安装");
    return;
  }
  this.console(`正在安装最新版的 ${pkgName} ...`);
  try {
    // 安装到某个目录
    execSync(`yarn add ${pkgName}`, {
      cwd: this.dir.tpl
    });
    this.console(`安装完成`, "green");
  } catch (e) {
    this.console(`安装失败，请检查包名称是否正确 ${pkgName}`, "red");
  }
};
