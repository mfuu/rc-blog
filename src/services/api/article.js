import request from '../index'

// 获取文章列表
export const get_article_list = () =>
  request('/article/get_article_list')

// 获取文章详情
export const get_detail_article = (data) =>
  request('/article/get_article_detail', {
    data,
    method: 'post',
    isJSON: true
  })

// 编写文章
export const write_article = (data) => 
  request('/article/write_article', {
    data,
    method: 'post',
    isJSON: true
  })