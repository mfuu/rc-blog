let timer, flag // 防抖节流用

module.exports = {
  /**
 * 防抖
 * @param {Function} fn 执行函数
 * @param {Number} delay 防抖时间
 * @param {Boolean} immediate 是否立即执行
 */
   debounce(fn, delay = 300, immediate = false) {
    if (timer !== null) clearTimeout(timer)
    if (immediate) {
      let callnow = !timer
      timer = setTimeout(() => {
        timer = null
      }, delay)
      if (callnow) typeof fn === 'function' && fn()
    } else {
      timer = setTimeout(() => {
        typeof fn === 'function' && fn()
      }, delay)
    }
  },

  /**
   * 节流
   * @param {Function} fn 执行函数
   * @param {Number} delay 节流时间
   * @param {Boolean} immediate 是否立即执行
   */
  throttle(fn, delay = 300, immediate = true) {
    if (immediate) {
      if (!flag) {
        flag = true
        // 如果是立即执行，则在delay毫秒内开始执行
        typeof fn === 'function' && fn()
        timer = setTimeout(() => {
          flag = false
        }, delay)
      }
    } else {
      if (!flag) {
        flag = true
        // 如果是非立即执行，则在wait毫秒内的结束处执行
        timer = setTimeout(() => {
          flag = false
          typeof fn === 'function' && fn()
        }, delay)
      }
    }
  },
  /**
   * 为代码块显示添加行号
   * @param {String} code MD的代码内容
   */
  beforNumber(code) {
    if (!code.trim()) {
      return code;
    }
    const list = code.split('\n');
    const spanList = ['<span aria-hidden="true" line-row>'];
    list.forEach(() => {
      spanList.push('<span></span>');
    });
    spanList.push('</span>');
    list.push(spanList.join(''));
    return list.join('\n');
  }
}