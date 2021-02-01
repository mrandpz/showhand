const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const getPath = require("./getPath");

let modules = [];

// 默认不加参数取config里面的值
if (fs.existsSync(getPath(".site/modules.config.js"))) {
  modules = require(getPath(".site/modules.config.js"));
}

function syncSubmodule(moduleString) {
  const [moduleName, moduleBranch = "master"] = moduleString.split("@");

  if (!moduleName || !modules[moduleName]) {
    moduleName && console.log(`错误: 无效的模块名-${moduleName}`);
    return false;
  }

  let syncCommand = "";

  const { name, repo, dir } = modules[moduleName];
  const modulePath = getPath(dir);

  if (fs.existsSync(modulePath)) {
    syncCommand = `cd ${modulePath} && git reset --hard HEAD && git fetch --all && git checkout ${moduleBranch} && git pull`;
  } else {
    syncCommand = `git clone ${repo} ${modulePath} && cd ${modulePath} && git checkout ${moduleBranch}`;
  }

  console.log(`信息：正在同步${name}`);
  execSync(syncCommand);
}

let modulesNeedSync = [];

if (
  process.argv.includes("--dev") &&
  fs.existsSync(getPath(".site/modules.dev.json"))
) {
  modulesNeedSync = require(getPath(".site/modules.dev.json"));
} else if (
  process.argv.includes("--test") &&
  fs.existsSync(getPath(".site/modules.test.json"))
) {
  modulesNeedSync = require("../.site/modules.test.json");
} else if (
  process.argv.includes("--uat") &&
  fs.existsSync(getPath(".site/modules.uat.json"))
) {
  modulesNeedSync = require(getPath(".site/modules.uat.json"));
} else if (
  process.argv.includes("--prod") &&
  fs.existsSync(getPath(".site/modules.prod.json"))
) {
  modulesNeedSync = require(getPath(".site/modules.prod.json"));
} else if (
  !modulesNeedSync.length &&
  fs.existsSync(getPath(".site/modules-locale.json"))
) {
  modulesNeedSync = require(getPath(".site/modules-locale.json"));
} else {
  modulesNeedSync = process.argv.slice(2);
}

if (modulesNeedSync.length) {
  modulesNeedSync.forEach(syncSubmodule);
  console.log(`成功：${modulesNeedSync.length}个子模块同步完成`);
} else {
  console.log(
    "错误：请指定需要同步的模块名，例如 lingzhi-cli sync-modules order@master member@test"
  );
}

module.exports = { syncSubmodule };
