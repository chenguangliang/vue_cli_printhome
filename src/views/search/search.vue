<template>
  <div id="searchApp">
    <div class="top_wrapper">
      <router-link to="/" class="back_wrapper">
        <img src="../../assets/img/back.png" alt="" class="back">
      </router-link>
      <div class="search_wrapper">
        <select name="search" id="search" style="color: rgb(51, 51, 51);position: absolute;top:0.2rem" v-model="queryType">
          <option value="goods" style="color: rgb(51, 51, 51);">商品</option>
          <option value="shop" style="color: rgb(51, 51, 51);">店铺</option>
        </select>
        <input type="text" class="search_box" autofocus style="position: absolute;left: 0.8rem">

        <div class="relationWrap" style="display: none;">
          <ul></ul>
        </div>
          <img src="../../assets/img/fangdajing.png" alt="" class="fangda" style="position: absolute;right: 0.2rem;top:0.1rem" @click="goSearch()">
      </div>
    </div>
    <div class="hot_list">
      <p class="hot_title">热门搜索</p>
      <p class="hot_word">显示器</p>
      <p class="hot_word">纸艺家</p>
      <p class="hot_word">特种纸</p>
      <p class="hot_word">手持VOC检测仪</p>
      <p class="hot_word">纸品汇</p>
      <p class="hot_word">印刷家自营店</p>
      <p class="hot_word">印刷家自营店</p>
      <p class="hot_word">印刷家纸张自营店</p>
      <p class="hot_word">纸艺家数码特种纸精品店</p>
    </div>
    <input type="hidden" value="1" id="typejs">
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'search',
    data () {
      return{
        queryType:this.$route.query.queryType
      }
    },
    methods:{
      goSearch(){
          this.$router.push("")
      }
    }
  }
</script>


<style scoped>
  @import "../../assets/css/4_souSuoJieGuo/search.css";
</style>
<style>
  body{
    background: #fff;
  }
</style>
