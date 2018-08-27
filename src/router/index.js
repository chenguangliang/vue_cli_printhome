import Vue from 'vue';
import Router from 'vue-router';
import index from '@/components/views/index';
import search from '@/components/views/search/search';
import searchGoodsResults from '@/components/views/search/searchGoods_results';
import productDetail from '@/components/views/productDetail/productDetail.vue';
import loginPhone from '@/components/views/login/login_phone.vue';
import areaCode from '@/components/views/login/areaCode.vue';
import loginCommon from '@/components/views/login/loginCommon.vue';


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
      component: searchGoodsResults,
      meta: {keepAlive: true}
    },
    {
      path:'/productDetail',
      name:'productDetail',
      component:productDetail
    },
    {
      path:'/loginPhone',
      name:'loginPhone',
      component:loginPhone
    },
    {
      path:'/loginCommon',
      name:'loginCommon',
      component:loginCommon
    },
    {
      path:'/areaCode',
      name:'areaCode',
      component:areaCode
    }
  ]
})

router.beforeEach((to,from,next)=>{
  // alert(111)
  next();
});
router.afterEach((to,from)=>{
  // alert(222)

});

export default router;
