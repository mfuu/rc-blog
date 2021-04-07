module.exports = {
  /**
   * 日期转换器
   * @param {Number|String} millSeconds 时间戳
   * @param {String} fmt 格式 'yyyy.MM.dd hh:mm'(默认) || 'yyyy-MM-dd' || 其他
   * @returns 日期
   */
   formatDate(millSeconds, fmt) {
    if (!millSeconds) return ''
    if (typeof millSeconds === 'string' && millSeconds.indexOf('-') >= 0) {
      return millSeconds
    }
    if (typeof millSeconds === 'string') {
      millSeconds = parseInt(millSeconds)
    }
    if (!fmt) fmt = 'yyyy-MM-dd hh:mm'
    const date = new Date(millSeconds)
    const o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S+': date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + '').substr(4 - RegExp.$1.length)
      )
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }
    return fmt
  }
}