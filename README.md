# showhand

- Lerna 管理多个包： 生成模板，执行命令入口，webpack配置项
- lerna的默认模式是Fixed/Locked mode，在这种模式下，实际上lerna是把工程当作一个整体来对待。每次发布packges，都是全量发布，无论是否修改。但是在Independent mode下，lerna会配合Git，检查文件变动，只发布有改动的packge。


1. npm install --global lerna
2. 创建一个具有git地址的 repo
3. lerna init 初始化一个项目 生成 lerna.json(配置文件)
4. lerna bootstrap 会给package下面的子模块各自安装依赖

