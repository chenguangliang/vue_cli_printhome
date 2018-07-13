import Vue from 'vue';
import Router from 'vue-router';
import index from '@/components/views/index';
import search from '@/components/views/search/search';
import searchGoodsResults from '@/components/views/search/searchGoods_results';
import productDetail from '@/components/views/productDetail/productDetail.vue';
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
  // alert(111)
  console.log(10010);
  next();
});
router.afterEach((to,from)=>{
  // alert(222)
  console.log(10011);

});

export default router;
