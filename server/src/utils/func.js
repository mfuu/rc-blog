const path = require('path')
const fs = require('fs')

module.exports = {
  /**
   * 读取指定目录下的文件
   * @param {String} dir 目录
   * @param {Function} callback 读取文件后处理函数
   * @param {Function} down 完成时回调
   */
  mapDir(dir, callback, down) {
    fs.readdir(dir, function (err, files) {
      if (err) {
        console.log(err)
        return
      }
      files.forEach((filename, index) => {
        let pathname = path.join(dir, filename)
        fs.stat(pathname, (err, stats) => { // 读取文件信息
          if (err) return
          if (stats.isDirectory()) {
            mapDir(pathname, callback, down)
          } else if (stats.isFile()) {
            if (['.json', '.less'].includes(path.extname(pathname))) return
            fs.readFile(pathname, (err, data) => {
              if (err) return
              callback && callback(data)
            })
          }
        })
        if (index === files.length - 1) {
          down && down()
        }
      })
    })
  }
}