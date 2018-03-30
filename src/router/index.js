import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import index from '@/views/index';
import search from '@/views/search/search';

Vue.use(Router);

export default new Router({
  mode:'history',//这句话可以让url没有#
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
    }
  ]
})
