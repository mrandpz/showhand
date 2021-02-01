/*
 * 同步pages下的各业务模块的api.js汇总到src/.api.js
 *
 * @Author: 叶峰
 * @Date: 2019-06-28 16:48:18
 * @Last Modified by: Mr.pz
 * @Last Modified time: 2019-10-24 09:47:05
 */
const getPath = require("./getPath");
const chokidar = require("chokidar");
const fs = require("fs");

const forceRerequire = modulePath => {
  delete require.cache[require.resolve(modulePath)];
  return require(modulePath);
};

const pageFoldersPath = getPath("src/pages");

class AsyncAPIConf {
  apply() {
    chokidar
      .watch(
        [getPath("src/pages/**/api.js"), getPath("src/services/baseAPI.js")],
        {
          persistent: true
        }
      )
      .on("change", () => this.updateAPIFile())
      .on("add", () => this.updateAPIFile())
      .on("unlink", () => this.updateAPIFile());
  }

  apiArrayToObj(apiArray) {
    const obj = {};
    apiArray.map(v => {
      const { key, url } = v;
      obj[key] = url;
    });
    return obj;
  }

  formatAPI(apiObj, moduleName) {
    let list = [];
    for (const key in apiObj) {
      list.push({
        key,
        url: apiObj[key],
        moduleName
      });
    }
    return list;
  }

  updateAPIFile() {
    const baseAPI = forceRerequire(getPath("src/services/baseAPI"));
    let apis = this.formatAPI(baseAPI, "baseAPI");

    const pages = fs.readdirSync(pageFoldersPath);
    pages.forEach(moduleName => {
      const apiFilePath = `${pageFoldersPath}/${moduleName}/api.js`; // TODO: 暂时未解决接口重复定义的问题
      if (fs.existsSync(apiFilePath)) {
        let apiList = forceRerequire(apiFilePath);
        apiList = this.formatAPI(apiList, moduleName);
        if (!apiList.length) {
          return;
        }
        if (apis.length === 0) {
          apis = apiList;
        } else {
          apis.forEach(v => {
            apiList.forEach(y => {
              if (v.key === y.key) {
                console.warn("以下API定义冲突，请协商解决");
                console.warn(JSON.stringify(v, "", "  "));
                console.warn(JSON.stringify(y, "", "  "));
                throw new Error("");
              }
            });
          });
          apis = [...apis, ...apiList];
        }
      }
    });

    fs.writeFileSync(
      getPath("src/.api.js"),
      `
/** 自动生成 请勿人为修改 */
module.exports = ${JSON.stringify(this.apiArrayToObj(apis), "  ", "  ")}`
    );
  }
}

// new AsyncAPIConf().apply()

module.exports = AsyncAPIConf;
