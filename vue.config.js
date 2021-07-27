module.exports = {
  configureWebpack: {
    resolve: {
      // 路径别名 
      alias: {
        "assets": "@/assets",
        "common": "@/common",
        "components": "@/components",
        "network": "@/network",
        "views": "@/views",
      }
    }
  }
}