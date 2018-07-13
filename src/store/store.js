import getters from "./getters"
import mutations from "./mutations"
import actions from './actions'

import Vue from "vue"
import Vuex from 'vuex'
Vue.use(Vuex);

const state={
  loadingFlag:0,//页面跳转时loading的标志,0：隐藏；1：显示
};


const store =new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});

export default store;















