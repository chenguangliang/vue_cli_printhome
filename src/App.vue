<template>
  <div id="app">
        <div>
            <transition name="fade"><!--这是为了进来和离开的动画-->
              <keep-alive>  <!--这里是为了缓存,首页等页面,需要在router中加 meta: {keepAlive: true}-->
                  <router-view v-if="$route.meta.keepAlive"></router-view>
              </keep-alive>
            </transition>
            <transition name="fade"><!--其他页不缓存-->
                <router-view v-if="!$route.meta.keepAlive"></router-view>
            </transition>
        </div>
    <!--TODO:页面前进从从左边滑动进来，页面后退从右边滑进来-->
  </div>
</template>
<script>
export default {

  name: 'App',
  data: function () {
      return{
      }
  },
  methods:{

  },
  computed:{

  },
  watch:{
      $route(to,from){

      },

  },
  beforeCreate: function () {
//    this.$refs.popup.popUp_open();
  },
  created: function () {
//    this.$refs.popup.popUp_close();
  },
  beforeMount: function () {

  },
  mounted: function () {

  },
  beforeRouteEnter(to, from, next) {//切换进入当前路由之前的钩子函数
    next();
  },
  beforeRouteUpdate(to, from, next) {//切换进入当前路由之前的钩子函数
    next();
  },
  beforeRouteLeave (to, from , next) {
    const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
    if (answer) {
      next()
    } else {
      next(false)
    }
  }
}


</script>

<style>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0
  }
</style>
