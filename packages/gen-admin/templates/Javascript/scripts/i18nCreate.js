const path = require('path')
const fs = require('fs')

// 基础文件夹
const dir = path.resolve(__dirname, '../../src/')

let keys = []

function catchFile(filePath) {
  const files = fs.readdirSync(filePath)
  // 遍历读取到的文件列表
  files.forEach(filename => {
    // 获取当前文件的绝对路径
    const fileDir = path.join(filePath, filename)
    // 根据文件路径获取文件信息，返回一个fs.Stats对象
    const stats = fs.statSync(fileDir)
    const isFile = stats.isFile()
    const isDir = stats.isDirectory()
    if (isFile && /\.(js|jsx)$/.test(fileDir) && !/i18n/.test(fileDir)) {
      const content = fs.readFileSync(fileDir, 'utf-8')
      if (fileDir === '/Users/xmz/Desktop/watsons/scrm-fe/src/pages/index/index.jsx') {
        // console.log(content.match(/fmt\('\w+'\)/g))
        // 不会匹配  {fmt('22',{type:1})}
        keys = [
          ...keys,
          ...content
            .match(/fmt\('[^']*'\)/g)
            .map(item => item.replace(/fmt\(/g, '').replace(/\)/, '')),
        ]
      }
    }

    // 国际化文件无需再获取，git文件下也无需获取
    if (isDir && !/i18n/.test(fileDir) && !/\.git/.test(fileDir)) {
      catchFile(fileDir)
    }
  })
}

catchFile(dir)

// 获取到的keys,创建一个文件夹，让中文文件引入

console.log(keys)
