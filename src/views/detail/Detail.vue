<template>
  <div id="detail">
    <!-- 导航 -->
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :topImages="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @detailImageLoad="detailImageLoad"></detail-goods-info>
      <detail-param-info ref="params" :param-info="paramInfo"></detail-param-info>
      <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
      <goods-list ref="recommend" :goods="recommends" ></goods-list>
    </scroll>

    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
    <!-- <toast :message="message" :show="show"></toast> -->
  </div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar.vue"
  import DetailSwiper from "./childComps/DetailSwiper.vue"
  import DetailBaseInfo from "./childComps/DetailBaseInfo.vue"
  import DetailShopInfo from "./childComps/DetailShopInfo.vue"
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo.vue"
  import DetailParamInfo from "./childComps/DetailParamInfo.vue"
  import DetailCommentInfo from "./childComps/DetailCommentInfo.vue"
  import DetailBottomBar from "./childComps/DetailBottomBar.vue"

  import Scroll from "components/common/scroll/Scroll"
  import GoodsList from "components/content/goods/GoodsList"
  import BackTop from "components/content/backTop/BackTop"
  // import Toast from "components/common/toast/Toast"


  import {getDetail,Goods,Shop,GoodsParam,getRecommend} from "network/detail"; 
  import {debounce} from "common/utils";
  import {itemListenerMixin,backTopMixin} from "common/mixin"
  import { mapActions } from "vuex"

export default {
  name:"Detail",
  components:{
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    GoodsList,
    Scroll,
    BackTop,
    // Toast
  },
  mixins:[itemListenerMixin,backTopMixin],
  data(){
    return {
      iid:null,
      topImages:[],
      goods:{},
      shop: {},
      detailInfo:{},
      paramInfo:{},
      commentInfo:{},
      recommends:[],
      themeTopYs:[],
      getThemeTopY:null,
      currentIndex:0,
      // message:"",
      // show:false
      // isShowBackTop:false, 抽成mixin组件了
    }
  },
  created(){
    // 1.保存传入的iid
    this.iid = this.$route.params.iid

    // 2.根据iid请求详情数据
    getDetail(this.iid).then(res=>{
  
      // 1.获取数据
      const data = res.result;
      // console.log(data);
      // 2.获取顶部的图片轮播数据
      this.topImages = data.itemInfo.topImages

      // 3.获取商品信息
      this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)

      // 4.获取店铺信息
      this.shop = new Shop(data.shopInfo)

      // 5.获取商品详细信息
      this.detailInfo = data.detailInfo;

      // 6.获取参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)

      // 7.取出评论信息
      if(data.rate.cRate !== 0){
        this.commentInfo = data.rate.list[0]
      }

      // 8.等页面渲染完了以后 获取数据 $nextTick等待页面渲染完成(dom虽然被渲染出来了但是 图片还没加载完 所以也有问题)
      // 获取offsetTop 值 不对得话 一般就是图片没加载出来
      // this.$nextTick(()=>{

      //   this.themeTopYs = []
      //   this.themeTopYs.push(0);
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      //   console.log(this.themeTopYs);
      // })
    })

    // 3.请求推荐数据
    getRecommend().then(res=>{
      this.recommends = res.data.list
    })

    // 4.给getThemeTopY赋值
    this.getThemeTopY = debounce(()=>{
      this.themeTopYs = []
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop-51);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop-51);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop-51);
      // this.themeTopYs.push(Number.MAX_VALUE);
      // console.log(this.themeTopYs);
    })
  },
  mounted(){

  },
  updated(){
    
  },
  destroyed(){
    // console.log("destroyed");
    this.$bus.$off("itemImgLoad",this.itemImgListener)
  },
  methods:{
    ...mapActions(["addCart"]),
    detailImageLoad(){
      // console.log("++++");
      this.newRefresh()
      this.getThemeTopY()
    },

    
    titleClick(index){
      // console.log(index);
      this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],500)
    },

    contentScroll(position){
      // 1.获取y值
      let positionY = -position.y

      // 2.positionY和主题中值进行对比 

      let length = this.themeTopYs.length

      for (let i=0 ; i<length ;i++){ // 遍历出来后是 字符串
        if(this.currentIndex!==i && positionY>=this.themeTopYs[i] && positionY<this.themeTopYs[i+1]){
          this.currentIndex = i;
          // console.log(this.$refs.nav);
          // this.$refs.nav.currentIndex 这个属性是 nav-bar组件中的currentIndex
          // 想要区域与导航同步 就需要使 this.$refs.nav.currentIndex = this.currentIndex
          this.$refs.nav.currentIndex = this.currentIndex

        }
        
        // 上面的代码有点复杂 进行优化 但此时要给 this.themeTopYs数组中 加入Number.Max_VALUE
        // if(this.currentInde !== i && (positionY >= this.currentIndex[i] && positionY < this.themeTopYs[i+1])){
        //   this.currentIndex = i;
        //   this.$refs.nav.currentIndex = this.currentIndex
        // }
      }

      // 3.是否显示回到顶部
      this.isShowBackTop = -position.y > 1000
    },
    // 抽成组件了
    // backClick(){
    //   this.$refs.scroll.scrollTo(0,0,500)
    // }
    addToCart(){
      // 1.获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid

      // 2.将商品添加到购物车中 

      // 通过getAction方法映射了 
      this.addCart(product).then(res => {
        // this.show = true;
        // this.message = res;
        // setTimeout(()=>{
        //   this.show = false;
        //   this.message = ""
        // },1500)

      this.$toast.show(res,1500)
      })
      
      // 未被映射的方法
      // this.$store.dispatch("addCart",product).then(res => {
      //   alert(res);
      // })


    }
  }
}
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav{
    position: relative;
    overflow: hidden;
    z-index: 9;
    background-color: #fff;
    
  }

  /* .content {
    height: calc(100% - 44px - 49px);
  } */
  .content {
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
</style>