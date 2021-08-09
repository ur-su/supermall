import Vue from 'vue'
import App from './App.vue'
import router from "./router"
import store from "./store"

import FastClick from "fastclick"
import VueLazyLoad from 'vue-lazyload'

// 安装toast插件
import toast from "components/common/toast"

Vue.config.productionTip = false

// 事件总线
Vue.prototype.$bus = new Vue()

// 安装toast插件
Vue.use(toast)

// 导入全局组件
import Scroll from "components/common/scroll/Scroll"
import GridView from "components/common/gridview/GridView"

// 注册全局组件
Vue.component('scroll',Scroll)
Vue.component("grid-view",GridView)

// 解决移动端300ms延迟
FastClick.attach(document.body)

// 使用懒加载 
Vue.use(VueLazyLoad, {
  preLoad:1,
  loading: require("./assets/img/common/placeholder.png")
})

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')