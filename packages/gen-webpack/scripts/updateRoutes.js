/**
 * **路由动态生成脚本**
 * 运行`npm run update-routes`命令将会执行此文件（NodeJS环境）
 */

const fs = require("fs");
const path = require("path");
const getPath = require("./getPath");
const ignoredPageFolders = ["authorize", "index"];
const pageFoldersPath = getPath("src/pages");
const rootRouteFilePath = getPath("src/routes.jsx");

const forceRerequire = modulePath => {
  delete require.cache[require.resolve(modulePath)];
  return require(modulePath);
};

const createRoutesFile = (routeComponentArray = [], routes = [], isRoot) => {
  let content = isRoot
    ? `
export default hot(({ match }) => (
  <div className="page-container">${routes.join("")}
  </div>
))
`
    : `
export default hot(({ match }) => (
  <>${routes.join("")}
  </>
))
`;

  return `/**
 * 该文件内容为脚本自动生成，请勿手动修改此文件
 */

import { hot } from 'react-hot-loader/root'
import React from 'react'
// eslint-disable-next-line no-unused-vars
import { Route, Redirect, Switch } from 'react-router-dom'
${routeComponentArray.join("")}
${content}`;
};

function generateRouteFile(routeConfigs, targetFilePath, isRoot) {
  const routeComponentArray = [];
  const routeEntryArray = isRoot
    ? [
        "\r\n    <Route path={`${match.path}/`} exact={true} render={() => <Redirect to={`${match.path}welcome`} />} />"
      ]
    : [];

  let tabIndent = "    ";
  let componentIndex = 0;

  void (function createRouteComponent(items, parentPath = "") {
    parentPath = parentPath.replace(/\/$/, "");

    items.forEach(item => {
      const componentName = `${item.name}_${componentIndex}`;
      let parentTabIndext = tabIndent;
      componentIndex += 1;

      if (item.switch) {
        routeEntryArray.push(`\r\n${tabIndent}<Switch>`);
        tabIndent = `${tabIndent}  `;
        // 递归处理子路由
        item.children &&
          item.children.length &&
          createRouteComponent(item.children, parentPath + (item.path || ""));
      }

      if (item.entry) {
        // 声明异步加载路由组件
        routeComponentArray.push(
          `\r\nconst ${componentName} = React.lazy(() => import(/* webpackChunkName: 'p.${item.name}.${componentIndex}' */ '${item.entry}'))`
        );
        let itemPath = item.path.replace(/^\//, "");
        item.path.indexOf("//") !== 0 &&
          (itemPath = `${parentPath}/${itemPath}`);
        // 绑定路由组件
        routeEntryArray.push(
          `\r\n${tabIndent}<Route path={\`\${match.path === '/' ? '' : match.path}${itemPath}\`} exact={${!!item.exact}} component={${componentName}} />`
        );
      }

      if (!item.switch) {
        // 递归处理子路由
        item.children &&
          item.children.length &&
          createRouteComponent(item.children, parentPath + (item.path || ""));
      } else {
        tabIndent = parentTabIndext;
        routeEntryArray.push(`\r\n${tabIndent}</Switch>`);
      }
    });
  })(routeConfigs);

  const routerFileContent = createRoutesFile(
    routeComponentArray,
    routeEntryArray,
    isRoot
  );
  fs.writeFileSync(targetFilePath, routerFileContent);
}

function resolveRouteConfig(routeConfigs, routeConfig, pageFolderName) {
  if (Array.isArray(routeConfig)) {
    routeConfig.forEach(subRouteConfig =>
      resolveRouteConfig(routeConfigs, subRouteConfig, pageFolderName)
    );
  } else if (routeConfig.local) {
    routeConfigs.push({ ...routeConfig, children: null });
    generateRouteFile(
      routeConfig.children,
      `${pageFoldersPath}/${pageFolderName}/routes.jsx`
    );
  } else {
    routeConfigs.push(routeConfig);
  }
}

function updateRoutes(showLog = true) {
  const routeConfigs = [];
  const pages = fs.readdirSync(pageFoldersPath);

  pages.forEach(pageFolderName => {
    const pageRouteConfigFilePath = `${pageFoldersPath}/${pageFolderName}/route.js`;
    const pageIndexFilePath = `${pageFoldersPath}/${pageFolderName}/index.jsx`;

    if (!ignoredPageFolders.includes(pageFolderName)) {
      if (fs.existsSync(pageRouteConfigFilePath)) {
        const pageRouteConfig = forceRerequire(pageRouteConfigFilePath);
        pageRouteConfig &&
          resolveRouteConfig(routeConfigs, pageRouteConfig, pageFolderName);
      } else if (fs.existsSync(pageIndexFilePath)) {
        routeConfigs.push({
          name: pageFolderName,
          path: pageFolderName,
          entry: `pages/${pageFolderName}`
        });
      }
    }
  });

  generateRouteFile(routeConfigs, rootRouteFilePath, true);
  showLog && console.log("路由文件更新成功!");
}

module.exports = updateRoutes;

// 通过命令行参数-r来直接允许
process.argv.includes("-r") && updateRoutes();
