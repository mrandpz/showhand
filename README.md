## 简介

灵智内部基础脚手架搭建

- 快速生成管理端模板
- 可做 --> 快速生成小程序模板
- 快速生成移动端模板

## 使用

```bash
# 安装cli
npm i @lingzhi/lingzhi-cli -g

# 安装仓库模板
lingzhi-cli install @lingzhi/gen-admin # 模板仓库核心是 yeoman-generator，cli预定模板包的名称都为特定前缀比如 @lingzhi/gen-

# 初始化工程
lingzhi-cli init # 会弹出对话框，让你选择已经安装了的模板仓库，如 @lingzhi/gen-admin

# 构建
lingzhi-cli build # 在工程目录下执行，调用构建插件，进行webpack打包
如果没有安装构建插件，会从模板中的 config.js 中提取构建插件模板，当前模板默认 `@lingzhi/gen-webpack`
```

## ??? 系统不一致？？

build 后，会丢失包

## lerna 管理多个子包

lerna 管理包  
lerna 会根据当前的 lerna publish 在当前的 git 打上 tag，也就是 changeLog
