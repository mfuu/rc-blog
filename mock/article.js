import Mock from 'mockjs'
const Random = Mock.Random

export default {
  '/api/get_article_list': Mock.mock({
    'list|10-20': [
      { 'id|+1': 1, title: Random.ctitle(), description: Random.word(), img: 'https://riyugo.com/i/2021/04/07/gxx50y.jpg' }
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