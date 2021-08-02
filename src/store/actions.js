import {
  ADD_COUNTER,
  ADD_TO_CART
} from "./mutation-types"

export default {
  // 异步操作 和 逻辑判断放进actions
  addCart(context, payload) {
    return new Promise((resolve, reject) => {
      // payLoad新添加的商品
      // 1.查找数组中是否含有该商品
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

      // 2.判断oldProduct
      if (oldProduct) { // 数量加一
        // oldProduct.count += 1
        context.commit(ADD_COUNTER, oldProduct)

        resolve("当前商品数量加一")
      } else { // 添加新的商品
        payload.count = 1
          // context.state.cartList.push(payload)
        context.commit(ADD_TO_CART, payload)
        resolve("添加了新的商品")
      }
    })
  }
}