import Mock from 'mockjs'
const Random = Mock.Random

export default {
  '/api/get_article_list': Mock.mock({
    'list|1-10': [
      { 'id|+1': 1, title: Random.ctitle(), description: Random.word(), img: Random.image() }
    ]
  }),
  '/api/get_detail_article': Mock.mock({
    data: {
      id: Random.id(),
      title: Random.ctitle(),
      author: Random.cname(),
      content: Random.cparagraph(100, 500),
      tag: ['vue', 'react']
    }
  })
}