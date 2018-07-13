/**
 * Created by Administrator on 2018/7/11.
 */
const actions={
  loading_open(context,n){//其实这个context和store具有相同方法和属性，但不是一个
    context.commit('loading_open');//这里提交mutations
  },
  loading_close(context,n){
    context.commit('loading_close');//这里提交mutations
  }

};
export default actions;
