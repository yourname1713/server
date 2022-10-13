import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{ path: '/', redirect: '/login' },
{ path: '/login', component: resolve => require(['@/components/Login/Login.vue'], resolve) },
{
  path: '/home', component: resolve => require(['@/components/Home/Home.vue'], resolve), redirect: '/home/welcome',
  children: [{ path: '/home/welcome', component: resolve => require(['@/components/Home/Welcome/Welcome.vue'], resolve) },
  { path: '/home/users', component: resolve => require(['@/components/Home/Users/Users.vue'], resolve) },
  { path: '/home/roles', component: resolve => require(['@/components/Home/Roles/Roles.vue'], resolve) },
  { path: '/home/goods', component: resolve => require(['@/components/Home/Goods/Goods.vue'], resolve) },
  { path: '/home/goods/add', component: resolve => require(['@/components/Home/Goods/Add/Add.vue'], resolve) },
  { path: '/home/orders', component: resolve => require(['@/components/Home/Orders/Orders.vue'], resolve) },
  { path: '/home/reports', component: resolve => require(['@/components/Home/Reports/Reports.vue'], resolve) },
  { path: '/home/rights', component: resolve => require(['@/components/Home/Rights/Rights.vue'], resolve) },
  { path: '/home/params', component: resolve => require(['@/components/Home/Params/Params.vue'], resolve) },
  { path: '/home/categories', component: resolve => require(['@/components/Home/Categories/Categories.vue'], resolve) }]
}
]
const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    return next()
  }
  if (!window.sessionStorage.getItem('token')) {
    return next('/login')
  }
  next()
})
export default router
