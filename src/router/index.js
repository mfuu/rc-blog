

module.exports = [
  {
    path: '/',
    component: '../layouts/index',
    routes: [
      { path: '/', component: '../pages/Article/List/index.js', title: '首页' },
      { path: '/detail', component: '../pages/Article/Detail/index.js' },
      { path: '/time', component: '../pages/Time/index.js', title: '时间轴' },
      { path: '/admin',
        routes: [
          { path: 'write', component: '../pages/Admin/Write/index.js', title: '编写文章' },
          { path: 'manage', component: '../pages/Admin/Manage/index.js', title: '文章管理' }
        ]
      },
      { component: '../pages/404.js' }
    ]
  }
]