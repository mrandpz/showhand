const { execSync } = require("child_process");

let hasYarn = false;
try {
  const res = execSync("yarn -v");
  hasYarn = true;
} catch (err) {
  if (err) {
    hasYarn = false;
  }
}

module.exports = hasYarn;
