<template>

</template>

<script type="text/ecmascript-6">
  import popup from "../../components/popup.vue"
  export default {
    name: 'search',
    data () {
      return{
        keywords:'',
        queryType:this.$route.query.queryType
      }
    },
    methods:{
      goSearch(){
          if(this.keywords){
            this.$router.push({path:"searchGoodsResults",query:{queryType:this.queryType,'keywords':this.keywords}})
          }
          else{
            this.$refs.popup.popUp_auto_false(1500,"请输入关键字");
          }
      }
    },
    mounted: function () {

    },
    components:{popup}
  }
</script>


<style>
  @import "../../assets/css/4_souSuoJieGuo/search.css";
</style>
<style>
  body{
    background: #fff;
  }
</style>
