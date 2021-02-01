#!/usr/bin/env node

const program = require("commander");
const builder = require("./script/build");

program
  .version("0.0.1", "-V -v --version", "输出当前版本号")
  .description("小渣渣的前端脚手架");

program
  .command("build")
  .description("构建项目")
  .option("--env [env]", "指定构建应用程序的环境变量：dev|pro") // 这里的[env] 等于 --env [env] 中的 test
  .option("--analyze", "构建分析") // 没有赋予变量就是true false
  .action((command) => {
    builder.build(command);
  });

program
  .command("start")
  .description("启动开发环境")
  .action((command) => {
    builder.start(command);
  });
program.parse(process.argv);
