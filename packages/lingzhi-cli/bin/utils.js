const fs = require("fs"),
  path = require("path"),
  execSync = require("child_process").execSync, // 同步输入shell
  inquirer = require("inquirer");
const INSTALLSTATUS = {
  unInstall: 0,
  notLast: 1,
  lasted: 2
};

class Utils {
  constructor() {}
  /**
   * 获取某个包的安装情况
   * @param {*} pkgName
   * @param {*} targetDir
   *
   * @return 0 表示未安装， 1标识号安装并非最近 2表示安装最新
   */
  getInstalledStatus(pkgName, targetDir, source) {
    // 检测在项目中是不是已经安装了build工具 // 当前我们是gen-webpack
    const genObj =
      source === "build"
        ? this.getInstalledPkgs(targetDir)
        : this.getInstalledPkgs(targetDir, "template");

    if (!genObj[pkgName]) return INSTALLSTATUS.unInstall;
    const lts = execSync(`npm view ${pkgName} version --json`) + ""; // buffer to string
    // @lingzhi/gen-webpack/package.json 获取安装包下的版本号
    const current = this.requireFrom(
      targetDir,
      path.join(pkgName, "package.json")
    ).version;

    if (current === lts.trim().replace(/"/g, "")) return INSTALLSTATUS.lasted;
    return INSTALLSTATUS.notLast;
  }

  /**
   * 获取路径下已经安装的包
   */
  getInstalledPkgs(targetDir, source) {
    const pkgJsonFile = path.resolve(targetDir, "package.json");
    const nodeModules = path.resolve(targetDir, "node_modules");
    if (!fs.existsSync(pkgJsonFile) || !fs.existsSync(nodeModules)) return {};
    const pkgJson = require(pkgJsonFile);
    if (source) {
      return pkgJson.dependencies || {};
    }
    return pkgJson.devDependencies || {};
  }

  /**
   * 获取路径下已经安装的 generator 包
   * source 来源于 模板安装还是 打包代码的安装
   */
  getInstalledGenerators(targetDir, source) {
    const devDependencies = this.getInstalledPkgs(targetDir, source);

    Object.keys(devDependencies).forEach(v => {
      if (!v.match(/^@lingzhi\/gen\-/)) delete devDependencies[v];
    });
    return devDependencies;
  }

  /**
   * 获取build模板之后 执行webpack打包
   */
  async getBuilderFn() {
    const { builder } = this.getConfigs();
    const status = this.getInstalledStatus(builder, process.cwd(), "build");

    switch (status) {
      case INSTALLSTATUS.unInstall:
        this.console(
          `检测到工程并未添加${builder}，将自动为您安装最新版`,
          "red"
        );
        // 设置问题
        const answers = await inquirer.prompt([
          {
            type: "list", // 问题类型
            name: "name", // 数据属性名
            message: "选择安装工具", // 提示信息
            choices: ["npm", "yarn"]
          }
        ]);

        this.console(`安装${builder}中...时间大概几分钟`);
        // 增加手动提示安装
        if (answers.name === "npm") {
          execSync(
            `npm config set sass_binary_site http://cdn.npm.taobao.org/dist/node-sass -g`,
            {
              cwd: process.cwd(),
              stdio: "inherit"
            }
          );
          execSync(`npm i ${builder} --save-dev`, {
            cwd: process.cwd(),
            stdio: "inherit"
          });
        } else {
          execSync(
            `yarn config set sass_binary_site http://cdn.npm.taobao.org/dist/node-sass -g`,
            {
              cwd: process.cwd(),
              stdio: "inherit"
            }
          );
          execSync(`yarn add ${builder} --dev`, {
            cwd: process.cwd(),
            stdio: "inherit"
          });
        }
        break;
      case INSTALLSTATUS.notLast:
        this.console(
          `检测到您的${builder}并非最新版，推荐在工程下 yarn add ${builder} --dev 或者 npm i ${builder} --save-dev进行更新 `
        );
        // 执行打包
        break;
      default:
        // 执行
        console.log("开始构建");
    }
    return this.requireFrom(process.cwd(), builder);
  }

  getConfigs() {
    const configs = this.requireFrom(process.cwd(), "./config.js"); // 获取配置文件,包括webpack自定义

    if (!configs || !configs.builder) {
      this.console(
        "请确保工程根路径下有 config.js 文件，且文件中配置了 builder 属性",
        "red"
      );
      process.exit(1);
    }
    return configs;
  }
}

module.exports = Utils;
