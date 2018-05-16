import Vue from "vue"
import Vuex from 'vuex'
import mutations from "./mutations"
Vue.use(Vuex);

const store =new Vuex.Store({
  state:{
    isLoading:false
  },
  actions:{},
  mutations:mutations,
  getters:{},

});

export default store;















