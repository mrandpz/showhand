const minimist = require("minimist"), // 解析控制台参数
  fs = require("fs"),
  chalk = require("chalk"), // 控制台颜色
  resolveFrom = require("resolve-from"), // 没找到的时候返回undefined
  requireFrom = require("import-from"), // 类似 require，但支持指定目录，让你可以跨工程目录进行 require，比如全局包想引用工程路径下的内容
  homeDir = require("osenv").home(), // 跨平台读取用户顶级路径 /Users/xmz ？？？
  mkdirp = require("mkdirp"), // 跨平台创建文件
  path = require("path"),
  inquirer = require("inquirer"), // 与用户互动
  execSync = require("child_process").execSync,
  yoemanEnv = require("yeoman-environment").createEnv(); //【核心】用于执行一个「模板插件包」

const pkg = require("../package.json"),
  cmdDirName = "../script",
  tplDir = path.resolve(homeDir, ".config"), // 统一把模板放在一个目录下
  Utils = require("./utils"),
  args = minimist(process.argv);

class M extends Utils {
  constructor(args) {
    super();
    this.args = args;
    this.bindTools();
    this.checkTplDir();
    const cmdArr = fs
      .readdirSync(path.resolve(__dirname, cmdDirName))
      .map(item => item.split(".")[0]);
    if (!cmdArr.includes(process.argv[2]))
      throw new Error(
        `没有该命令 ${process.argv[2]}，请使用以下命令 JSON.stringify(cmdArr)`
      );

    // 比如 lingzhi-cli dev 得到的 process.argv[2] 是dev ，对应的目录就是 "../script/dev",
    const cmd = require(path.resolve(__dirname, cmdDirName, process.argv[2]));

    this.checkCliUpdate(); // 检查当前的package.json 和用户全局package.json 对比是否版本相同，提示更新

    // 当执行 npm run build 就会执行 build文件
    cmd.call(this); // script 里的命令函数可读取 this 实例
  }

  /**
   * 将工具方法绑定在类上
   */
  bindTools() {
    this.chalk = chalk;
    this.resolveFrom = resolveFrom;
    this.requireFrom = requireFrom;

    this.dir = {
      home: homeDir,
      tpl: tplDir,
      cwd: process.cwd()
    };
    this.yoemanEnv = yoemanEnv;
    this.inquirer = inquirer;
  }

  checkCliUpdate() {
    const pkgName = pkg.name;
    const version = pkg.version;
    const ltsVersion = execSync(`npm view ${pkgName} version`) + ""; // 返回 buffer 转 string

    if (ltsVersion.trim() !== version)
      this.console(
        `cli 版本过旧，建议执行 npm i -g ${pkgName} 或者 yarn global add ${pkgName} 升级 cli： ${version} -> ${ltsVersion} `
      );
  }

  checkTplDir() {
    mkdirp(this.dir.tpl);
    const pkgFile = path.resolve(this.dir.tpl, "package.json");
    if (!fs.existsSync(pkgFile)) {
      fs.writeFileSync(
        pkgFile,
        JSON.stringify({
          name: "_",
          description: "_",
          repository: "_",
          license: "MIT"
        })
      );
    }
  }

  console(data, color = "yellow") {
    const fn = chalk[color] || chalk.yellow;
    console.log(fn(data));
  }
}

module.exports = new M(args);
