<template>
    <div id="home" class="wrapper">

      <nav-bar class="home-nav">
        <template #center>
          <div>购物街</div>
        </template>
      </nav-bar>

      <tab-control :titles="['流行','新款','精选']" @tabClick="tabClick" ref="tabControl1" class="tab-control" v-show="isTabFixed"></tab-control>

      <scroll class="content" 
              ref="scroll" 
              :probe-type="3" 
              @scroll="contentScroll" 
              :pull-up-load="true" @pullingUp="loadMore">


        <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>

        <recommend-view :recommends="recommends"></recommend-view>

        <feature-view></feature-view>

        <tab-control :titles="['流行','新款','精选']" @tabClick="tabClick" ref="tabControl2"></tab-control>

        <goods-list :goods="showGoods"></goods-list> <!-- ：goods用计算属性代替 因为原式过长 这样写简洁 -->

      </scroll>

      <!-- @click.native 监听组件 native修饰符 在我们需要监听一个组件的原生事件时，必须给对应的事件加上.native修饰符，才能监听 -->
      <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>

    </div>
</template>

<script >
// 公共组件
import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/tabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll"
import BackTop from "components/content/backTop/BackTop"

// 子组件
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView.vue"
import FeatureView from "./childComps/FeatureViews.vue"


// 方法
import { getHomeMultidata,getHomeGoods} from "network/home";
import {debounce} from "common/utils"


export default {
  name:"Home",
  components:{
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  data() {
    return {
      banners:[],
      recommends:[],
      goods:{
        'pop':{ page:0,list:[] },
        'new':{ page:0,list:[] },
        'sell':{ page:0,list:[] }
      },
      currentType:"pop",
      isShowBackTop:false,
      tabOffsetTop: 0,
      isTabFixed:false
    } 
  },
  computed:{

    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  created(){
    // 1.请求多个数据 
    this.getHomeMultidata()

    // 2.请求商品数据
    this.getHomeGoods("pop")
    this.getHomeGoods("new")
    this.getHomeGoods("sell") 
  },
  mounted(){

    // 1.图片加载完成的事件监听
    const refresh = debounce(this.$refs.scroll.refresh,200)
    //监听item中图片加载完成 事件总线在main.js
    this.$bus.$on("itemImageLoad",()=>{
      refresh()
    })

    // 2.获取tabControl的offsetTop
    // 所有的组件都有一个属性叫$el:拥有获取组件中的元素
    // console.log(this.$refs.tabControl.$el.offsetTop);
    // this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop
  },
  methods:{
    // 防抖动函数 P174 已经被封装到utils中
    // debounce(func, delay){
    //   let timer = null

    //   return function(...args){
    //     if(timer) clearTimeout (timer)

    //     timer = setTimeout(()=>{
    //       func.apply(this,args)
    //     },delay)
    //   }
    // },
    // 事件监听相关的方法
    tabClick(index){
      switch(index){
        case 0:
          this.currentType = "pop"
          break
        case 1:
          this.currentType = "new"
          break
        case 2:
          this.currentType = "sell"
          break
      }
      // 使上下两个 tabcontrol保持一致
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;

    },
    backClick(){
      this.$refs.scroll.scrollTo(0,0,500)
    },
    contentScroll(position){
      // 1.判断BackTop是否显示
      this.isShowBackTop = (-position.y) > 1000

      // 2.决定tabControl是否吸顶（-position:fixed）
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    loadMore(){
      console.log("加载更多的方法");
      this.getHomeGoods(this.currentType)
    },
    swiperImageLoad(){
      // console.log(this.$refs.tabControl.$el.offsetTop);
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },

    // 网络请求相关的方法
    getHomeMultidata(){
      getHomeMultidata().then(res => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      })
    },
    // 动态获取page
    getHomeGoods(type){
      const page = this.goods[type].page+1
      getHomeGoods(type,page).then(res=> {
        // ... 语法 将res.data.list一个一个push进去
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1

        // 完成上拉加载更多
        this.$refs.scroll.finishPullUp()

      })
    }
  }
}
</script>

<style scoped>
  #home{
    /* padding-top:44px; */

    /* 100%视口高度 */
    height: 100vh; 
    position: relative;
  }


  .home-nav{
    background-color: var(--color-tint);
    color:#fff;

    /* 在使用浏览器原生滚动时，为了让导航不跟随一起滚动 */
    /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9; */
  }

  .content{
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control {
    position: relative;
    z-index: 9;
  }
  /* .content {
    height: calc(100% -93px);
    overflow: hidden;
    margin-top: 44px
  } */
</style>
