# showhand

- Lerna 管理多个包： 生成模板，执行命令入口，webpack配置项
- lerna的默认模式是Fixed/Locked mode，在这种模式下，实际上lerna是把工程当作一个整体来对待。每次发布packges，都是全量发布，无论是否修改。但是在Independent mode下，lerna会配合Git，检查文件变动，只发布有改动的packge。

1. npm install --global lerna
2. 创建一个具有git地址的 repo
3. lerna init 初始化一个项目 生成 lerna.json(配置文件)
4. lerna bootstrap 会给package下面的子模块各自安装依赖
5. 在 git commit 之后，执行lerna publish 选择发布的版本迭代,此时包的 package.json 会被增加 gitHead 参数
额外的配置：husky


### 统筹命令入口：showhand.js
- npm init -y 指定package的name，files，指定bin入口
#### commander 控制获取当前命令参数，并执行对应流程

区分编译环境：比如 dev，prod => dll,anaylize 陆续再加
```js
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
    builder.build(command)
  });

program
  .command("start")
  .description("启动开发环境")
  .action((command) => {
    builder.start(command)
  });
program.parse(process.argv);
```
#### 开启一个webpack 服务


### yeoman-generator 框架模板 => 命名为 showhand-template

### 执行webpack => 命名为 showhand-pack