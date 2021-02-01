const path = require("path");

module.exports = function getPath(relative) {
  const cwd = process.cwd();
  return path.join(cwd, relative);
};
