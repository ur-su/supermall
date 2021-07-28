import Vue from 'vue'
import VueRouter from 'vue-router'

// 懒加载
const Home = () =>
  import ("views/home/Home")
const Category = () =>
  import ("views/categroy/Categroy")
const Cart = () =>
  import ("views/cart/Cart")
const Profile = () =>
  import ("views/profile/Profile")
const Detail = () =>
  import ("views/detail/Detail")

// 1.安装插件
Vue.use(VueRouter)

// 2.创建router
const routes = [{
    // 配置默认页面
    path: "",
    redirect: "/home"
  },
  {
    path: "/home",
    component: Home
  },
  {
    path: "/category",
    component: Category
  },
  {
    path: "/cart",
    component: Cart
  },
  {
    path: "/profile",
    component: Profile
  },
  {
    path: "/detail/:iid",
    component: Detail
  }
]
const router = new VueRouter({
  routes,
  mode: "history"
})

export default router