const { users } = require('../users')
const path = require('path')
const fs = require('fs')

/**
 * 获取登录人信息
 * @param {Object} ctx username：用户名，password：密码
 */
const login = async (ctx) => {
  let { username = null, password = null } = ctx.request.query || ctx.query
  let login = () => {
    return new Promise((resolve, reject) => {
      try {
        if (!users.find(user => user.username == username)) {
          resolve({ code: 99, msg: '用户不存在', success: false })
        } else {
          if (users.find(user => user.username == username && user.password == password)) {
            resolve({ code: 0, msg: '登陆成功', data:{}, success: true })
          } else {
            resolve({ code: 99, msg: '用户名或密码错误', success: false })
          }
        }
      } catch(error) {
        resolve({ code: 99, msg: error, success: false })
      }
    })
  }
  ctx.body = await login()
}

/**
 * 获取文章列表
 * @param {Object} ctx 请求体
 */
const get_file_list = async (ctx) => {
  let dir = '../server/src/files'
  let arr = []
  let mapDir = () => {
    return new Promise((resolve, reject) => {
      fs.readdir(dir, function (err, files) {
        if (err) {
          return
        }
        files.forEach((filename, index) => {
          let pathname = path.join(dir, filename)
          // 获取文件列表
          arr.push({ id: index, description: filename, title: filename, img: '' })
          resolve({ code: 0, msg: 'success', data: arr })
        })
      })
    })
  }
  ctx.body = await mapDir()
}

/**
 * 获取文章详情
 * @param {Object} ctx 请求体
 */
const get_file_detail = async (ctx) => {
  let { id = null } = ctx.request.body || ctx.body
  let dir = '../server/src/files'
  let mapDir = () => {
    return new Promise((resolve, reject) => {
      fs.readdir(dir, function (err, files) {
        if (err) {
          console.log(err)
          return
        }
        files.forEach((filename, index) => {
          let pathname = path.join(dir, filename)
          // 读取文件详情
          if (id == index) {
            fs.stat(pathname, (err, stats) => { // 读取文件信息
              if (err) return
              if (stats.isDirectory()) {
                mapDir(pathname, callback, down)
              } else if (stats.isFile()) {
                if (['.json', '.less'].includes(path.extname(pathname))) return // 排除json和less文件
                fs.readFile(pathname, (err, data) => {
                  if (err) return
                  resolve({
                    code: 0,
                    msg: 'success',
                    data: { id: index, content: data.toString(), tag: ['vue'], title: 'vue', author: 'mf' }
                  })
                })
              }
            })
          }
        })
      })
    })
  }
  ctx.body = await mapDir()
}

// const save_draft = async (ctx) => {

// }
/**
 * 文章写入
 * @param {Object} ctx 
 */
const write_file = async (ctx) => {
  let { content = '', title = '' } = ctx.request.body || ctx.body
  let filename = '../../blog/server/src/files/' + title + '.md'
  console.log(filename)
  let Write = () => {
    return new Promise((resolve, reject) => {
      fs.writeFile(filename, content, { flag: 'a', encoding: "utf-8" }, function(err) {
        if (err) reject(err)
        else {
          resolve({
            code: 0,
            mgs: 'success'
          })
        }
      })
    })
  }
  ctx.body = await Write()
}

module.exports = {
  get_file_list,
  get_file_detail,
  write_file,
  login
}
