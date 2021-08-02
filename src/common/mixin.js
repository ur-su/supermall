// 生命函数中的可以抽出来 但是methods里面的方法只能整个抽 单抽里面的条件是不行的
import { debounce } from "./utils"
import BackTop from "components/content/backTop/BackTop"

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,
      newRefresh: null
    }
  },
  mounted() {
    this.newRefresh = debounce(this.$refs.scroll.refresh, 100)

    this.itemImgListener = () => {
      this.newRefresh()
    }

    this.$bus.$on("itemImgLoad", this.itemImgListener)
  }
}

export const backTopMixin = {

  data() {
    return {
      isShowBackTop: false
    }
  },
  components: {
    BackTop
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 500)
    }
  }
}