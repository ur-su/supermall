<template>
  <div class="bottom-bar ignore">
    <div class="check-content">
      <check-button
       :is-checked="isSelectAll" 
       class="check-button" 
       @click.native="checkClick"></check-button>
      <span>全选</span>
    </div>

    <div class="total-price">
      合计：{{totalPrice}}
    </div>
    
    <div class="calculate" @click="calcClick">
      去计算 ({{checkLength}})
    </div>
  </div>
</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton"
import {mapGetters} from "vuex"

export default {
  name:"CartBottomBar",
  components:{
    CheckButton
  },
  computed:{
    ...mapGetters(["cartList"]),
    totalPrice(){
      return "￥" + this.$store.getters.cartList.filter(item=>{
        return item.checked
      }).reduce((preValue,item)=>{
        return preValue + item.price * item.count
      },0).toFixed(2)
    },
    checkLength(){
      // 原 this.$store.state.cartList.filter(item =>item.checked).length
      // 引入 mapGetters 后 可以用以下写法
      // 商品种类数
      return this.cartList.filter(item =>item.checked).length

      // 商品数量
      // return this.$store.getters.cartList.filter(item=>{
      //   return item.checked
      // }).reduce((preValue,item)=>{
      //   return preValue +item.count
      // },0)
    },
    isSelectAll(){

      if(this.cartList.length === 0){return false}
      // 方法一：
      // filter判断item中是否存在没勾选的选项 如果有则数组会有长度 有长度则表示并未全选 
      // this.cartList.filter(item => !item.checked).length 这个返回的是一个数字 现为布尔值则为true  有未选值 isSelectAll应为false 所以要对整个取反
      // 这种要全部遍历完 性能不好
      // return !(this.cartList.filter(item => !item.checked).length)

      // 方法二：
      // 只要找到一个不选中的就返回 这个性能好
      return !this.cartList.find(item => !item.checked)

    }
  },
  methods:{
    checkClick(){
      if (this.isSelectAll){// 全部选中
        this.cartList.forEach(item => item.checked = false)
      } else { // 部分或全部不选中
        this.cartList.forEach(item => item.checked = true)
      }
    },
    calcClick(){

      if(!this.isSelectAll) {
        this.$toast.show("请选择购买的商品",1500)
      }

    }
  }
}
</script>

<style scoped>
  .bottom-bar {
    height: 40px;
    line-height: 40px;
    background-color: #eee;
    position: relative;
    display: flex;
    /* z-index: 99; */
  }

  .check-content {
    display: flex;
    width: 60px;
    align-items: center;
    margin-left: 10px;
  }

  .check-button {
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }

  .total-price{
    font-size: 15px;
    margin-left: 20px;
    flex: 1;
  }

  .calculate {
    width: 90px;
    background-color: red;
    text-align: center;
    color: #fff;
  }
</style>