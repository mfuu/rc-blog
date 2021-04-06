import axios from 'axios'
import qs from 'qs'

const isDev = process.env.NODE_ENV === 'development'

const defaultConfig = {
  baseURL: isDev ? '/api' : '/api',
  timeout: 15000,
  responseType: 'json',
  withCredentials: true, // 跨域是否带token
  maxContentLength: 2000,
  validateStatus: function (status) {
    return status >= 200 && status <= 302
  },
}

// 对post格式请求惊醒form-data转码
axios.defaults.transformRequest = [
  function (data) {
    let ret = ''
    for (let it in data) {
      ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    return ret
  },
]

// POST 传参序列化
axios.interceptors.request.use(
  (config) => {
    let token = window.localStorage.getItem('token') || ''
    config.headers.Authorization = 'Bearer ' + token
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 返回结果处理
axios.interceptors.response.use(
  (response) => {
    if (response && response.status === 200) {
      return response.data
    }
  },
  (error) => {
    let response = error.response
    if (response && response.status && response.status === 401) {
      if (response['data']['code'] === 96) {
        console.log('redirect')
      }
    }
  }
)

async function request(api, option = {}) {
  let { method = 'get', params, query = {}, data, isJSON } = option

  // resetful接口处理
  let url = api.replace(/\$([\w]+)/g, (word, $1) => {
    return params[$1] ? params[$1] : word
  })
  // 防止IE缓存
  query.__uuid = uuid()

  return new Promise((resolve) => {
    axios({
      ...defaultConfig,
      headers: {
        'Content-Type': isJSON
          ? 'application/json'
          : 'application/x-www/form-urlencoded;charset=UTF-8',
      },
      transformRequest: [
        function (data) {
          data = isJSON ? JSON.stringify(data) : qs.stringify(data)
          return data
        },
      ],
      ...{ url, method, params: query, data },
    })
      .then((res) => {
        if (res) resolve(res)
      })
      .catch(() => {})
  })
}

function uuid() {
  return +new Date() + (Math.random() * 10000).toFixed(0)
}

export default request
