const execSync = require("child_process").execSync;
const path = require("path");
const os = require("os");

function run(releative) {
  return path.resolve(__dirname, releative);
}

function runExec(cmd) {
  execSync(cmd, {
    stdio: "inherit"
  });
}

const isNotWindows = ["linux", "darwin"].includes(os.platform());

let maxSize = "";
// windows增加内存
if (!isNotWindows) {
  maxSize = "--max_old_space_size=4096";
}

module.exports = function start({ argv, type }) {
  const pathPrefix = process.argv[3] || "";
  // 程 序 启 动
  switch (type) {
    case "build-analyze":
      runExec(
        `node ${run("./scripts/build")} --path-prefix=${pathPrefix} --analyze`
      );
      break;
    case "build-dev":
      runExec(`node ${run("./scripts/syncModules")} --dev`);
      runExec(`node ${run("./scripts/build")} --dll`);
      runExec(`node ${run("./scripts/build")} --path-prefix=${pathPrefix}`);
      break;
    case "build-prod":
      runExec(`node ${run("./scripts/syncModules")} --prod`);
      runExec(`cd ${process.cwd()} && yarn`);
      runExec(`node ${run("./scripts/build")} --dll`);
      runExec(`node ${run("./scripts/build")} --path-prefix=${pathPrefix}`);
      break;
    case "build-test":
      runExec(`node ${run("./scripts/syncModules")} --test`);
      runExec(`node ${run("./scripts/build")} --dll`);
      runExec(`node ${run("./scripts/build")} --path-prefix=${pathPrefix}`);
      break;
    case "build-uat":
      runExec(`node ${run("./scripts/syncModules")} --uat`);
      runExec(`node ${run("./scripts/build")} --dll`);
      runExec(`node ${run("./scripts/build")} --path-prefix=${pathPrefix}`);
      break;
    case "build":
      runExec(`node ${run("./scripts/build")} --path-prefix=${pathPrefix}`);
      break;
    case "dev":
      runExec(`node ${run("./scripts/build")} --dev ${maxSize}`);
      break;
    case "dll":
      runExec(`node ${run("./scripts/build")} --dll`);
      break;
    case "legacy":
      runExec(`node ${run("./scripts/build")} --dev --legacy ${maxSize}`);
      break;
    case "sync-modules":
      // 手动更新模块
      runExec(
        `node ${run("./scripts/syncModules")} ${argv &&
          argv.slice(3).join(" ")}`
      );
      break;
    case "update-routes":
      // 手动更新路由
      runExec(`node ${run("./scripts/updateRoutes")} -r`);
      break;
    default:
      console.log("没找到当前命令，请确认是否存在");
  }
};
