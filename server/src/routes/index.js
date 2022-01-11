const Router = require('koa-router')
const controller = require('../controller')
const path = require('path')
const fs = require('fs')

const router = new Router()

router.get('/', async (ctx, next) => {
  ctx.body = 'koa'
})
.get('/api/user/login', controller.login)
.get('/api/article/get_article_list', controller.get_file_list)
.post('/api/article/get_article_detail', controller.get_file_detail)
.post('/api/article/write_article', controller.write_file)

module.exports = router