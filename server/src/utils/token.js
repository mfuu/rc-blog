const jwt = require('jsonwebtoken')
const { TOKEN_ENCODE_STR, URL_YES_PASS } = require('./config')

module.exports = {
  // 生成token
  create_token(str) {
    const token = jwt.sign({ str }, TOKEN_ENCODE_STR, {
      expiresIn: '24h'
    })
    return token
  },

  async check_token(ctx, next) {
    let url = ctx.url
    if (ctx.method != 'GET' && !URL_YES_PASS.includes(url)) {
      let token = ctx.get('Authorization')
      if (token === '') {
        ctx.response.status = 401
        ctx.response.body = 'login first'
        return
      }
      try {
        let { str = '' } = await jwt.verify(token, TOKEN_ENCODE_STR)
        let res = ''
        if (res.length === 0) {
          ctx.response.status = 401
          ctx.response.body = 'login time out'
          return
        }
        ctx._id = res[0]._id
      } catch(err) {
        ctx.response.status = 401
        ctx.response.body = 'login time out'
        return
      }
    }
    await next()
  }
}