<template>
    <div id="home" class="wrapper">

      <nav-bar class="home-nav">
        <template #center>
          <div>购物街</div>
        </template>
      </nav-bar>

      <scroll class="content" 
              ref="scroll" 
              :probe-type="3" 
              @scroll="contentScroll" 
              :pull-up-load="true" 
              @pullingUp="loadMore">

        <home-swiper :banners="banners"></home-swiper>

        <recommend-view :recommends="recommends"></recommend-view>

        <feature-view></feature-view>

        <tab-control class="tab-control" :titles="['流行','新款','精选']" @tabClick="tabClick"></tab-control>

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
      isShowBackTop:false
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
  methods:{
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
    },
    backClick(){
      this.$refs.scroll.scrollTo(0,0,500)
    },
    contentScroll(position){
      this.isShowBackTop = (-position.y) > 1000
    },
    loadMore(){
      this.getHomeGoods(this.currentType)
      this.$refs.scroll.scroll.refresh()
    },

    // 网络请求相关的方法
    getHomeMultidata(){
      getHomeMultidata().then(res => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      })
    },
    getHomeGoods(type){
      const page = this.goods[type].page+1
      getHomeGoods(type,page).then(res=> {
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1

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
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
  }

  .tab-control {
    position: sticky;
    top: 44px;
    z-index: 9;
  }

  .content{
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  /* .content {
    height: calc(100% -93px);
    overflow: hidden;
    margin-top: 44px
  } */
</style>
