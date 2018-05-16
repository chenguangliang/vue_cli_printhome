<template>
  <div id="app">
        <div>
            <popup ref="popup"></popup>
            <transition name="fade"><!--这是为了进来和离开的动画-->
              <keep-alive>  <!--这里是为了缓存,首页等,需要在router中加一个参数-->
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
  watch:{
    isLoading: function (newValue,oldValue) {

      if(newValue){
          this.$refs.popUp_open();
      }else{
        this.$refs.popUp_close();

      }
    }
  },
  beforeMount: function () {
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
