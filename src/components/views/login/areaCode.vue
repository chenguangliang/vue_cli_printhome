<template>
    <div>
      <!--头部导航-->
      <div class="header">
        <a href="javascript:;" class="return" onclick="javascript:history.back(-1);"></a>选择国家或地区
      </div>
      <div class="zhanwei"></div>
      <div class="neirong">
        <template v-for="listAll in areaCodeList">
          <div class="lieBiao" :data-tab="listAll.letter">
            <div class="top">{{listAll.letter}}</div>
            <ul>
              <template v-for="list in listAll.result">
                <li @click="selectedCode(list.areacode)">
                  {{list.areaName}}
                  <span>+{{list.areacode}}</span>
                </li>
              </template>
            </ul>
          </div>
        </template>
      </div>

      <div class="ziMu">
        <template v-for="letter in dataTab">
          <a href="javascript:;" :data-tab="letter.charLetter">{{letter.charLetter}}</a>
        </template>
      </div>
    </div>
</template>
<script type="text/ecmascript-6">

    export default {
        name: 'areaCode',
        mixins: [],
        data(){
            return {
              dataTab:[],
              areaCodeList:[]
            }
        },
        methods: {
          selectedCode (pareaCode) {
              let fromPage=this.$route.query.fromPage;
              if(fromPage=='login'){
                  this.$router.push({name:'loginPhone',query:{pareaCode:pareaCode}});
              }else if(fromPage=='sign'){

              }else if(fromPage=='findPwd'){

              }else if(fromPage=='setPhoneNum'){

              }
          }
        },
        components: {},
        beforeMount(){
            let temp=this;
            temp.axios.get("information/register/findAreaCode").then( (res) => {
                if(res.data){
                  temp.dataTab = res.data.letters;
                  temp.areaCodeList = res.data.records;
                  }
            }).catch( (err) => {
              console.log(err);
            })
        },
        mounted(){
        },
        watch: {},
    }
</script>

<style scoped>
    @import "./areaCode.css";
</style>
