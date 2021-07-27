<template>
  <div id="tab-bar-item">
    <div class="tab-bar-item" @click="itemClick">
      <!-- <slot v-if="!isActive" name="item-icon"></slot>
      <slot v-else :class="{active:isActive}" name="item-icon-active"></slot> -->

      <!-- 插槽若要有绑定操作最好在外层套一个div 否则插槽替换后失效 -->
      <div v-if="!isActive" class="item-icon">
        <slot name="item-icon"></slot>
      </div>

      <div v-else :style="activeStyle" class="item-active-icon">
        <slot name="item-icon-active"></slot>
      </div>

      <div :style="activeStyle" class="item-text">
        <slot name="item-text"></slot>
      </div>
      
        <!-- <span class="iconfont">&#xe6a2;</span>
        <div>首页</div> -->
    </div>
  </div>
</template>

<script>

export default {
  name:"TabBarItem",
  props:{
    path:String,
    activeColor:{
      type:String,
      default:"red"
    }
  },
  data(){
    return {
      // isActive:false
    }
  },
  computed:{
    isActive(){
      // /home -> item1(/home)=true
      // 这个path是取活跃状态的path 哪个活跃就取哪个
      return this.$route.path.indexOf(this.path) !== -1
    },
    activeStyle(){
      return this.isActive ? {color:this.activeColor} : {}
    }
  },
  methods:{
    itemClick(){
      // console.log(this.path);
      // 这个if是用来判断是否点了多次 若是则不执行 （执行会报错）
      if(!this.isActive) this.$router.replace(this.path)
    }
  }
}

</script>

<style scoped>

  #tab-bar-item{
    flex: 1;
    text-align: center;
    height: 49px;
    font-size: 14px;
  }

  .tab-bar-item .item-icon img,.item-active-icon img {
    width: 24px;
    height: 24px;
    margin-top: 5px;
    vertical-align: middle;
  }

</style>