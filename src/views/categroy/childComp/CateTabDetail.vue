<template>
    <grid-view>
      <goods-list-item v-for="(item, index) in categoryDetail" :key="index" :goods-item="item"/>
    </grid-view>
  </template>

<script>
import GoodsListItem from "components/content/goods/GoodsListItem"

    export default {
        name:"CateTabDetail",
        components:{
            GoodsListItem
        },
        props:{
            categoryDetail:{
                default() {
                    return []
                }
            }
        }
    }
</script>

<style scoped>

</style>