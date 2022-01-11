const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const onerror = require('koa-onerror')
const cors = require('koa-cors')
const json = require('koa-json')
const router = require('./src/routes')

const app = new Koa()
onerror(app)

app
.use(bodyParser())
.use(json())
.use(logger())
.use(router.routes())
.use(router.allowedMethods()) // 先注册bodyparser，再注册router，否则post请求无法获取request.body内容

app.on('error', (err, ctx) => {
  console.log('error', err, ctx)
})

app.listen(3000, () => {
  console.log('running')
})