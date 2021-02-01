const fs = require("fs");
const os = require("os");
const path = require("path");
const rimraf = require("rimraf");
const { execSync } = require("child_process");

const getPath = require("./getPath");
const updateRoutes = require("./updateRoutes");
const APIUpdater = require("./asyncAPIConf");

const isDev = process.argv.includes("--dev");
const reDll = process.argv.includes("--dll");
const analyze = process.argv.includes("--analyze");
// 不启用 dashboard
const legacyMode = process.argv.includes("--legacy");

const buildStartAt = new Date().getTime();
// 主动更新一次路由配置
updateRoutes(false);
// 主动更新一次API配置
new APIUpdater().updateAPIFile();

const config = path.resolve(__dirname, "../configs/webpack.config.js");
const dll = path.resolve(__dirname, "../configs/webpack.dll.js");
const server = getPath("node_modules/.bin/webpack-dev-server");

const webpack = getPath("node_modules/.bin/webpack");
const crossEnv = getPath("node_modules/.bin/cross-env");
const dashboard = getPath("node_modules/.bin/webpack-dashboard");

const cwd = process.cwd();
const isNotWindows = ["linux", "darwin"].includes(os.platform());
const pathPrefixArg =
  process.argv.find(item => item.indexOf("--path-prefix=") === 0) || "";

let maxSize = "";
// windows增加内存
if (!isNotWindows) {
  maxSize = "--max_old_space_size=4096";
}

if (reDll) {
  rimraf.sync(getPath("dll"));
  console.log("正在生成Dll文件");
  execSync(`${webpack} --mode production --config ${dll}`, {
    stdio: "inherit"
  });
  return;
}

if (isDev) {
  // 启动开发服务器
  if (["linux", "darwin"].includes(os.platform()) && !legacyMode) {
    // 只在linux和osx平台启用webpack-dashboard
    execSync(
      `${dashboard} -- ${server} --config ${config} -d --history-api-fallback --no-inline --progress --colors --hot`,
      {
        stdio: "inherit"
      }
    );
  } else {
    execSync(
      `${server} --config ${config} -d --history-api-fallback --no-inline --progress --colors --hot ${maxSize}`,
      { stdio: "inherit" }
    );
  }
} else {
  execSync("node -v");
  execSync("npm cache clean --force");

  if (!fs.existsSync(path.resolve(cwd, "dll/vendor.dll.manifest.json"))) {
    // 如果dll文件不存在，则先生成一次dll
    console.log("正在生成Dll文件");
    execSync(`${webpack} --mode production --config ${dll}`, {
      stdio: "inherit"
    });
  }

  console.log("正在构建项目，这个过程可能会持续几分钟，请稍候...");
  // 删除dist目录
  rimraf.sync(getPath("dist"));
  // 执行构建命令
  execSync(
    `${crossEnv} NODE_ENV=production ${webpack} --config ${config} --profile ${
      analyze ? "--analyze" : ""
    } ${pathPrefixArg}`,
    {
      stdio: "inherit"
    }
  );
  console.log(
    `编译成功，共耗时: ${Math.floor(
      (new Date().getTime() - buildStartAt) / 1000
    )}秒`
  );
}
