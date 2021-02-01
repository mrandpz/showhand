const path = require("path");
const { execSync } = require("child_process");

function startDevServer() {
  execSync(
    `npx webpack serve --config ${path.resolve(
      __dirname,
      "./webpack.dev.js"
    )} --progress --color`,
    {
      stdio: "inherit",
    }
  );
}

function buildProduction() {
  console.log("buildProduction");
}

function buildDLL() {
  console.log("buildDLL");
}

module.exports = {
  start: startDevServer,
  build: buildProduction,
  buildDLL: buildDLL,
};
