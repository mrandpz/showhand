const chokidar = require("chokidar");
const updateRoutes = require("./updateRoutes");
const getPath = require("./getPath");

class RouteWatchPlugin {
  apply() {
    chokidar
      .watch(getPath("src/pages/**"), {
        ignored: /\.git/,
        persistent: true
      })
      .on("unlinkDir", () => updateRoutes(false));

    chokidar
      .watch(getPath("src/pages/**/route.js"), {
        persistent: true
      })
      .on("change", () => updateRoutes())
      .on("add", () => updateRoutes(false))
      .on("unlink", () => updateRoutes());

    chokidar
      .watch(getPath("src/pages/**/index.jsx"), {
        persistent: true
      })
      .on("add", () => updateRoutes(false))
      .on("unlink", () => updateRoutes());
  }
}

module.exports = RouteWatchPlugin;
