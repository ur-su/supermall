<template>
  <div class="category">

    <nav-bar class="nav-bar">
      <template #center>
        <div>商品分享</div>
      </template>
    </nav-bar>

    <div class="content">
      <cate-tab-menu :categories="categories" @selectItem="selectItemHandler"></cate-tab-menu>
      <scroll id="tab-content">
        <div>
          <cate-tab-content :subcategories="showSubcategory"></cate-tab-content>
          <tab-control :titles = "['综合','新品','销售']" @tabClick="tabClickHandler"></tab-control>
          <cate-tab-detail :category-detail="showCategoryDetail"></cate-tab-detail>
          <!-- <page-tab-control></page-tab-control> -->
          <!-- <cate-tab-detail></cate-tab-detail> -->
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
// 公共组件
import NavBar from "components/common/navbar/NavBar"
import TabControl from "components/content/tabControl/tabControl"

// 子组件
import CateTabMenu from "./childComp/CateTabMenu"
import CateTabContent from "./childComp/CateTabContent"
import CateTabDetail from "./childComp/CateTabDetail"

// 方法
import { getCategoriesApi, getSubCategoriesApi, getCategoryDetailApi } from "network/category"
import {POP, NEW, SELL} from "common/const";
import {tabControlMixin} from "common/mixin"


export default {
  name:"Category",
  mixins:[tabControlMixin],
  components:{
    NavBar,
    CateTabMenu,
    CateTabContent,
    CateTabDetail,
    TabControl
  },
  data(){
    return {
      categories:[],
      categoryData:{},
      currentIndex:-1,
    }
  },
  created(){
    this.getCategories();
  
  },
  computed:{
    showSubcategory(){
      if(this.currentIndex === -1) return {}
      return this.categoryData[this.currentIndex].subcategories.list
    },
    showCategoryDetail() {
      if (this.currentIndex === -1) return []
      return this.categoryData[this.currentIndex].categoryDetail[this.currentType]
    }
  },
  methods:{
    /*
      事件监听
    */
    // 获取选中的类别详细数据
    selectItemHandler(index){
      this.getSubCategories(index);
    },

    /*
      网络请求
    */ 
    // 获取分类数据
    getCategories(){
      getCategoriesApi().then(res => {

        // 获取分类数据
        this.categories = res.data.category.list;

        // 初始化每个类别的子数据
        for (let i = 0;i < this.categories.length;i++){
          this.categoryData[i] = {

            // 子分类数据
            subcategories:{},

            // 分类商品类别数据
            categoryDetail:{
              "pop":[],
              "new":[],
              "sell":[]
            }
          }
        }
        this.getSubCategories(0);
      },err=>{
        console.log(err);
      })
    },

    // 获取子分类数据
    getSubCategories(index) {
      this.currentIndex= index;
      // 存储网址拼接参数
      const maitKey = this.categories[index].maitKey;
      // console.log(maitKey);
      getSubCategoriesApi(maitKey).then(res => {
        
        this.categoryData[index].subcategories = res.data;
        // 变为数组，需要解构，重新转换成对象 数组转化为对象
        this.categoryData = { ...this.categoryData };
        
        this.getCategoryDetail(POP)
        this.getCategoryDetail(SELL)
        this.getCategoryDetail(NEW)
      },err=>{
        console.log(err);
      })
    },

    // 获取子分类下的商品详细信息
    getCategoryDetail(type){
      // 1.获取请求的miniWallkey
      const miniWallkey = this.categories[this.currentIndex].miniWallkey;
      // 2.发送请求，传入minikey和type
      getCategoryDetailApi(miniWallkey,type).then(res => {
        // 3.将获取的数据保存下来
        this.categoryData[this.currentIndex].categoryDetail[type] = res;
        this.categoryData = {...this.categoryData}
      },err=>{
        console.log(err);
      })
    }
  }
}
</script>

<style scoped>
  #category{
    height: 100vh;
  }

  .nav-bar {
    background-color: var(--color-tint);
    font-weight: 700;
    color: #fff;
  }

  .content{
    overflow: hidden;

    position: absolute;
    left: 0;
    right: 0;
    top: 44px;
    bottom: 49px;

    display: flex;
  }

  #tab-content {
    height: 100%;
    flex: 1;
  }
</style>