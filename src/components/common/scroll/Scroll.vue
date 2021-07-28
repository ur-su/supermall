<template>
  <!-- ref/children -->
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from "better-scroll"

export default {
  name:"Scroll",
  props:{
    probeType:{
      type:Number,
      dafault:0
    },
    // 上拉加载
    pullUpLoad:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return{
      scroll:null,
      message:"哈哈哈"
    }
  },
  mounted(){
    // 通过 document.querySelector(".wrapper")获取到的wrapper 有可能是别的组件中的（重名）
    // 此时给需要获取的元素加上ref属性通过下面的方式获取元素则一定取到要用的元素
    // console.log(this.$refs.wrapper);

    // 1.创建BScroll对象

    this.scroll = new BScroll(this.$refs.wrapper,{
      click:true,
      probeType:this.probeType,
      pullUpLoad:this.pullUpLoad,
    })

    // this.$nextTick(() => {
    //     this.scroll = new BScroll(this.$refs.wrapper, {})
    //   })

    // 2.监听滚动区域
    if (this.probeType ===2||this.probeType === 3){
      this.scroll.on("scroll",(position)=>{
      // console.log(position);
        this.$emit("scroll",position)
      })
    }

    // 3.监听上拉事件
    if(this.pullUpLoad) {
      this.scroll.on("pullingUp",()=>{
        this.$emit("pullingUp")
      })
    }

  },

  methods:{
    scrollTo(x,y,time=300){
      this.scroll && this.scroll.scrollTo(x,y,time)
    },
    refresh(){
      console.log("-------");
      this.scroll && this.scroll.refresh()
    },
    finishPullUp(){
      this.scroll && this.scroll.finishPullUp()
    }
  }
}
</script>

<style scoped>

</style>