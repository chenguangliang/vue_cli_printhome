<template>
  <div id="app">
    <keep-alive>  <!--这里是为了缓存首页等-->
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style >

</style>
