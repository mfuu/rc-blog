module.exports = [
  {
    path: '/',
    component: '../layouts/index',
    routes: [
      { path: '/', component: '../pages/article', title: '首页' },
      { path: '/detail/:id', component: '../pages/article_detail' },
      { path: '/time', component: '../pages/time.js', title: '时间轴' },
    ]
  }
]