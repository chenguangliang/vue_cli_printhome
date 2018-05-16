/**
 * 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。
   Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。
   这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数：

 * 你不能直接调用一个 mutation handler。这个选项更像是事件注册：“当触发一个类型为 increment 的 mutation 时，调用此函数。”
   要唤醒一个 mutation handler，你需要以相应的 type 调用 store.commit 方法：

 */
export default {
  turnOnLoading (state){
    console.log("on");
    state.isLoading= true;
  },
  turnOffLoading (state) {
    console.log("off");
    state.isLoading=false;
  }
}
