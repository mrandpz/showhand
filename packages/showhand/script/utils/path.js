const path = require('path')

function resolvePath(relative) {
  const cwd = process.cwd()
  return path.join(cwd, relative)
}

module.exports = { resolvePath }
