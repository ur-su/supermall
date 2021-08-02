<template>
  <div class="cart">
    <nav-bar class="nav-bar">
      <template #center>购物车({{length}})</template>
      <!-- <div slot="center">购物车</div> -->
    </nav-bar>

    <!-- 商品列表 -->

    <cart-list></cart-list>

    <!-- 底部汇总 -->
    <cart-bottom-bar></cart-bottom-bar>

  </div>
</template>

<script >
import NavBar from "components/common/navbar/NavBar"

import CartList from "./childComps/CartList.vue"
import CartBottomBar from "./childComps/CartBottomBar.vue"

import { mapGetters } from "vuex"

export default {
  name:"Cart",
  components:{
    NavBar,
    CartList,
    CartBottomBar
  },
  computed:{

    // mapGetters辅助函数 需要先导入再用 

    // 两种语法
    // ...mapGetters([
    //   "cartLength",
    //   "cartList"
    // ])

    ...mapGetters({
      length:"cartLength",
      list:"cartList"
    })
  }

}
</script>

<style scoped>
  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
    font-weight: 700;
    /* z-index: 9; */
  }
  
  .cart{
    height: 100vh;
  }

</style>