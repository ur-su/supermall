<template>
    <div v-if="Object.keys(commentInfo).length !== 0" class="comment-info">

      <!-- 标题部分 -->
      <div class="info-header ">
        <div class="header-title">用户评价</div>
        <div class="header-more">
          更多
          <i class="arrow-right"></i>
        </div>
      </div>

      <!-- 用户信息 -->
      <div class="info-user">
        <img :src="commentInfo.user.avatar" alt="">
        <span>{{commentInfo.user.uname}}</span>
      </div>

      <!-- 详情 -->
      <div class="info-detail">
        <p>{{commentInfo.content}}</p>
        <div class="info-other">
          <span class="date">{{commentInfo.created | showDate}}</span>
          <span>{{commentInfo.style}}</span>
        </div>
        <div class="info-imgs">
          <img :src="item" v-for="(item,index) in commentInfo.images" :key="index" alt="">
        </div>
      </div>

    </div>
</template>

<script>
import {formatDate} from "common/utils"

export default {
  name:"DetailCommentInfo",
  props:{
    commentInfo:{
      type:Object,
      default() {
        return {}
      }
    }
  },
  filters:{
    showDate(value){
      // 1.将时间戳转换为Date对象
      const date = new Date(value * 1000)

      // 2.将date进行格式化
      return formatDate(date,"yyyy-MM-dd hh:mm")
    }
  }
}
</script>

<style scoped>
  /* p199 8:26 */
  .comment-info{
    padding: 5px 12px;
    color: #333;
    border-bottom: 5px solid #f2f5f8;
  }

  .info-header {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid rgba(0, 0, 0, .1);
  }

  .info-header .header-title {
    float: left;
    font-size: 15px;
  }

  .info-header .header-more {
    float: right;
    margin-right: 10px;
    font-size: 13px;
  }

  .header-more {
    float: right;
    margin-right: 10px;
    font-size: 13px;
  }
</style>