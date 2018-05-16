import Vue from 'vue';
import Router from 'vue-router';
import index from '@/views/index';
import search from '@/views/search/search';
import searchGoodsResults from '@/views/search/searchGoods_results';
import productDetail from '@/views/productDetail/productDetail.vue';
import store from '../store/store';

Vue.use(Router);

let router= new Router({
  mode:'history',//这可以让url没有#
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      meta: {keepAlive: true}
    },{
      path: '/search',
      name: 'search',
      component: search
    },
    {
      path: '/searchGoodsResults',
      name: 'searchGoodsResults',
      component: searchGoodsResults
    },
    {
      path:'/productDetail',
      name:'productDetail',
      component:productDetail
    }
  ]
})
router.beforeEach((to,from,next)=>{
  store.commit('turnOnLoading');
  next();
});
router.beforeEach((to,from,next)=>{
  store.commit('turnOffLoading');
  next();
});

export default router;
