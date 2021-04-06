import request from '../index'

export const get_article_list = () =>
  request('/get_article_list')

export const get_detail_article = (query) =>
  request('/get_detail_article', { query })