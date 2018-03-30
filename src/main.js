// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import adjust from './assets/js/adjust'
import "./assets/css/common.css" //引入公共css
import install from "./lib/install" //引入全局方法并use
Vue.use(install);

Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: function () {
    return {

    }
  },
  router,
  components: { App },
  template: '<App/>',
  methods:{
    add: function () {

    }
  }
});
