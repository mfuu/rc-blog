module.exports = [
  {
    path: '/',
    component: '../layouts/index',
    routes: [
      { path: '/', component: '../pages/Article/index.js', title: '首页' },
      { path: '/detail/:id', component: '../pages/ArticleDetail/index.js' },
      { path: '/time', component: '../pages/Time/index.js', title: '时间轴' },
      { path: '/admin', component: '../pages/Admin/Write/index.js', title: '编写文章' },
      { component: '../pages/404.js' }
    ]
  }
]