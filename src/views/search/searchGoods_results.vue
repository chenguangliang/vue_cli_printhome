<template>
  <div id="searchResult">
    <div>
      <div class="top_wrapper">
        <a href="javascript:;" class="back_wrapper" @click="returnPage"><img class="back" src="../../assets/img/back.png" alt="" /></a>

        <div class="search_wrapper" style="width: 5rem">
          <select name="search" id="search" style="position:absolute;top:0.2rem">
            <option value="goods" selected = "selected" >商品</option>
            <option value="shop">店铺</option>
          </select>
          <input type="text" id="key" class="search_box" style="width: 2.6rem;border-radius: 0;position:absolute;left: 0.8rem;" v-model="keywords" @keyup="enterSearch($event)"  @click="goToSearch($event)"/>
          <div class="relationWrap">
            <ul>
              <template v-for="item in relationWords">
                <li class="oneLine" @click="searchItem($event,2)">{{item.title}}</li>
              </template>
            </ul>
          </div>
            <img class="fangda" src="../../assets/img/fangdajing.png" alt="" @click="searchList()" style="position:absolute;right:0.2rem;top:0.1rem"/>
        </div>
        <img class="toggle_img" :src=ThumbnailImg alt="" @click="showMode = !showMode;"  v-show="showMode"/>
        <img class="toggle_img" :src=listImg alt="" @click="showMode = !showMode;" v-show="!showMode"/>
      </div>
      <div class="search_btn"  v-if="goodsData.length!=0">
        <p searchSort="1" searchSortFlag="1" @click="searchList($event,'update')">最近更新</p>

        <p searchSort="3" searchSortFlag="1" @click="searchList($event,'sale')">销量<img :src="clickImgUrl.saleSrc" alt=""/></p>

        <p searchSort="4" searchSortFlag="1" @click="searchList($event,'price')">价格<img :src="clickImgUrl.priceSrc" alt=""/></p>

        <p searchSort="2" searchSortFlag="1" class="last" @click="searchList($event,'comment')">评论最多</p>
      </div>
    </div>
    <div class="suolue_wrap">
      <div id="wrapper">
        <div id="scroller" >
          <ul  class="suolue_result wrapScrool">
            <div style="height: 1.9rem"></div>
            <template v-for="item in goodsData">

              <li class="suolue_goods" style="float: left;overflow: hidden" v-show="showMode">
                <a href="javascript:;" style="" @click="gotoGood(item)">
                  <img class="suoluegoods_img" :src="imgUrl + item.itemPicture" alt=""/>
                  <template v-if="item.itemNameHighlight">
                    <p class="suoluegoods_name oneLine" style="width: 2.8rem" v-html="item.itemNameHighlight"></p>
                  </template>
                  <template v-else>
                    <p class="suoluegoods_name oneLine" style="width: 2.8rem">{{item.itemName}}</p>
                  </template>
                </a>

                <p class="suoluegoods_price" @click="getUserItemInfo(item)">
                  <template v-if="item.hasPrice != 2">
                    ￥{{item.sellPrice}}
                  </template>
                  <template v-else>
                    欢迎询价
                  </template>
                  <img style="width: 0.3rem;float: right;margin-top: 0.15rem;" src="../../assets/img/point.png" alt=""/>
                </p>
                <div class="suoluefloot_ship"><p style="background-color: #f39700;">

                  <template v-if="itemFavouriteFlag">
                                          <span class="suoluecontact" >
                                          已收藏
                                           </span>
                  </template>
                  <template v-else>
                                          <span class="suoluecontact" @click="itemSkuFavorite(item)">
                                          收藏商品
                                           </span>
                  </template>


                  <template v-if="shopFavouriteFlag">
                                          <span class="suoluegoods_car" >
                                          已收藏
                                           </span>
                  </template>
                  <template v-else>
                                          <span class="suoluegoods_car" @click="shopFavorite(item)">
                                          收藏店铺
                                           </span>
                  </template>
                </p>

                  <div class="suolueship_wrapper">
                    <p class="suolueshop_name" v-on:click="toShop(item.shopId)">{{item.shopName}}</p>

                    <p class="suolue_detile">描述：
                      <span class="red_word mr20">{{shopEvaluationInfo.shopDescription}}</span>服务：
                      <span class="red_word">{{shopEvaluationInfo.shopReputation}}</span></p>

                    <p class="suolue_detile">物流：
                      <span class="red_word mr20">{{shopEvaluationInfo.shopArrival}}</span>态度：
                      <span class="red_word">{{shopEvaluationInfo.shopService}}</span>
                    </p></div>
                </div>
              </li>
            </template>
          </ul>
          <ul v-show="!showMode" class="list_result wrapScrool">
            <template v-for="item in goodsData">

              <li class="list_goods" v-show="!showMode">
                <a href="javascript:;" style="" @click="gotoGood(item)">
                  <img class="listgoods_img" v-bind:src="imgUrl + item.itemPicture" alt=""/></a>

                <div class="title_wrapper">
                  <a href="javascript:;" class="listgoods_name" @click="gotoGood(item)">{{item.itemName}}</a>

                  <p class="listgoods_price red_word" @click="getUserItemInfo(item)">
                    <template v-if="item.hasPrice != 2">
                      ￥{{item.sellPrice}}
                    </template>
                    <template v-else>
                      欢迎询价
                    </template>
                    <img style="width: 0.3rem;float: right;margin-top: 0.15rem;" src="../../assets/img/point.png" alt=""/>
                  </p>
                </div>
                <div class="listfloot_ship">
                  <div class="listship_wrapper">
                    <p class="listshop_name" v-on:click="toShop(item.shopId)">{{item.shopName}}</p>

                    <p class="list_detile">描述：
                      <span class="red_word mr20">{{shopEvaluationInfo.shopDescription}}</span>服务：
                      <span class="red_word">{{shopEvaluationInfo.shopReputation}}</span>
                    </p>

                    <p class="list_detile">物流：
                      <span class="red_word mr20">{{shopEvaluationInfo.shopArrival}}</span>态度：
                      <span class="red_word">{{shopEvaluationInfo.shopService}}</span>
                    </p>

                    <p style="margin-top: 0.1rem;">
                      <!--<span class="list_shoucang mr20" @click="itemSkuFavorite(item)">收藏商品</span>
                      <span class="list_shoucang" @click="shopFavorite(item)">收藏店铺</span>-->
                    </p>
                  </div>
                  <!--<span class="add_wrapper" style="background-color: #f39700;">
                      <p class="listcontact" @click="itemSkuFavorite(item)"><span>收藏</span><br/><span>商品</span></p>
                      <p class="listgoods_car" @click="shopFavorite(item)">收藏<br/>店铺</p>
                  </span>-->
                  <div class="add_wrapper" style="background-color: #f39700;height: 1.7rem;">

                    <template v-if="itemFavouriteFlag">
                      <p class="listcontact" style="line-height: 0.6rem;">
                        已收藏
                      </p>
                    </template>
                    <template v-else>
                      <p class="listcontact" @click="itemSkuFavorite(item)">
                        收藏<br/>商品
                      </p>
                    </template>


                    <template v-if="shopFavouriteFlag">
                      <p class="listgoods_car" style="line-height: 0.6rem;">
                        已收藏
                      </p>
                    </template>
                    <template v-else>
                      <p class="listgoods_car" @click="shopFavorite(item)">
                        收藏<br/>店铺
                      </p>
                    </template>

                  </div>
                </div>
              </li>
            </template>
          </ul>
          <template v-if="goodsData.length==0 && getDataErr">
            <div style="width:100%;height: 100%;">
              <div style="position: relative;top:1.6rem">
                <div class="search_bg">
                  <img src="../../assets/img/search_bg.png" alt=""/>
                </div>

                <p style="text-align: center;font-size: 0.28rem;color:#333333">十分抱歉，没有找到您想要的相关商品</p>

                <p style="text-align: center;font-size: 0.26rem;color:#666666;margin-top: 0.4rem;">亲，我们换个词试试吧~</p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <popup ref="popup"></popup>
  </div>
</template>
<script type="text/ecmascript-6">
    import $ from "jquery"
    import {refresher} from "../../../src/assets/bower_components/pullToRefresh_fixHead"
    function getUrl(name) {
      return "http://wx.printhome.com/mall-web" + "/" + name;
    }
    function goodsSiblings(){
      $(".suoluegoods_price").click(function () {
        $(this).next(".suoluefloot_ship").animate({"left": 0}, 100).parent().siblings().find(".suoluefloot_ship").animate({"left": "3.1rem"}, 100);
      });
      $(".listgoods_price").click(function (e) {
        $(this).parent().siblings(".listfloot_ship").animate({"left": "1.6rem"}, 100).parent().siblings().find(".listfloot_ship").animate({"left": "6.5rem"}, 100);
      });
      $(".listfloot_ship").click(function (e) {
        e.preventDefault();
        $(this).animate({"left": "6.5rem"}, 100);
      });
      $(".suoluefloot_ship").click(function (e) {
        e.preventDefault();
        $(this).animate({"left": "3.1rem"}, 100);
      });
      /*商品名截取*/
      // testAuto('.suoluegoods_name', 20);
//      testAuto('.listgoods_name', 26);
      /*the result of search shop*/
//      testAuto('.shop_title', 26);
    }

    //点击文字颜色变色
    function changeFontColor(){
      $(".search_btn p").click(function () {
        var Index = $(this).index();
        $(".search_btn p").eq(Index).css({
          "color": "#e60012"
        }).siblings().css({"color": "#666666"});
      });
    }

    export default {
      name: 'searchGoodsResults',
      data(){
          return{
            keywords:'',
            serverUrl:"http://wx.printhome.com/mall-web",
            imgUrl:"http://img.printhome.com/imgs/",
            keyword : "",
            queryType :"goods",
            goodsData:[],
            pageSize:10,
            page:1,
            searchSort:"",
            //搜索结果页显示模式 1 条形 2  方块
            showMode:true,
            clickImgUrl:{
              saleSrc:require('../../assets/img/up_down.png'),
              priceSrc:require('../../assets/img/up_down.png'),
              sortPicUpDownNo:require('../../assets/img/up_down.png'),
              sortPicUpRed:require('../../assets/img/up_red.png'),
              sortPicDownRed:require('../../assets/img/down_red.png')
            },
            shopEvaluationInfo:{},
            itemFavouriteFlag:false,
            shopFavouriteFlag:false,
            relationWords:[],
            myScroll:'',//初始化iscrool获得的滑动对象
            ThumbnailImg:require('../../assets/img/suoluetu-@3x.png'),
            listImg:require('../../assets/img/liebiao@3x.png'),
            getDataErr:false
          }
      },
      computed:{
        setSort:{
          set:function(event){
            if(event){
              var searchSort = $(event.currentTarget).attr("searchSort");
              var searchSortFlag = $(event.currentTarget).attr("searchSortFlag");
              if(searchSortFlag == 1){
                $(event.currentTarget).attr("searchSortFlag",2);
                // this.searchSort = searchSort * 2;
                if(searchSort * 2==2){
                  this.searchSort="listtingTime_desc"
                }else if(searchSort * 2==4){
                  this.searchSort="evaluateScope_desc"
                }else if(searchSort * 2==6){
                  this.searchSort="sellNum_desc"
                }else if(searchSort * 2==8){
                  this.searchSort="sellPrice_desc"
                }
              }else{
                $(event.currentTarget).attr("searchSortFlag",1);
                // this.searchSort = searchSort * 2 - 1;
                if(searchSort * 2-1==1){
                  this.searchSort="listtingTime_asc"
                }else if(searchSort * 2-1==3){
                  this.searchSort="evaluateScope_asc"
                }else if(searchSort * 2-1==5){
                  this.searchSort="sellNum_asc"
                }else if(searchSort * 2-1==7){
                  this.searchSort="sellPrice_asc"
                }
              }
            }
          },
          get:function(){

          }
        }
      },
      methods:{
        /**初始化滑动区域**/
        scrollInit(){
            let temp=this;
            temp.myScroll= refresher.init({
            id: "wrapper",
            pullDownAction:()=>{
              setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
                temp.myScroll.refresh();
                /****remember to refresh when you action was completed！！！****/
              }, 2000);
            },
            pullUpAction: temp.loadMore
          });
        },
        /**下拉加载更多数据**/
        loadMore:function(){
          let temp = this;
          this.page = this.page + 1;
          temp.axios.get("/searchController/itemSearch",{params:{keywords:temp.keywords,page:temp.page,sort:temp.searchSort}}).then( (res) => {
            if(res.data.isSuccess && res.data.resultData.pager.records){
              temp.goodsData=temp.goodsData.concat(res.data.resultData.pager.records);
              goodsSiblings();
            }else{
              refresher.info.pullUpLable = "已经到底了";
              temp.myScroll.refresh();
            }
          }).catch( (err) => {
            console.log(err);
          })

        },
        searchList:function(event,type){
          $(".listfloot_ship").css('left','6.5rem');
          $(".suoluefloot_ship").css('left','3.1rem');
          //只是为了控制销量/价格图片
          if(type == 'sale'){//销量--先降序
            let srcName = this.clickImgUrl.saleSrc;
            if(srcName == this.clickImgUrl.sortPicUpDownNo || srcName == this.clickImgUrl.sortPicUpRed){//无->下 上->下
              this.clickImgUrl.saleSrc = this.clickImgUrl.sortPicDownRed;
            }else if(srcName == this.clickImgUrl.sortPicDownRed){//下->上
              this.clickImgUrl.saleSrc = this.clickImgUrl.sortPicUpRed;
            }
            this.clickImgUrl.priceSrc = this.clickImgUrl.sortPicUpDownNo;//清除其它格式
          }
          else if(type == 'price'){//价格--先降序
            let srcName = this.clickImgUrl.priceSrc;
            if(srcName == this.clickImgUrl.sortPicUpDownNo || srcName == this.clickImgUrl.sortPicUpRed){//无->下 上->下
              this.clickImgUrl.priceSrc = this.clickImgUrl.sortPicDownRed;
            }else if(srcName == this.clickImgUrl.sortPicDownRed){//下->上
              this.clickImgUrl.priceSrc = this.clickImgUrl.sortPicUpRed;
            }
            this.clickImgUrl.saleSrc = this.clickImgUrl.sortPicUpDownNo;//清除其它格式
          }
          else{
            this.clickImgUrl.saleSrc = this.clickImgUrl.sortPicUpDownNo;//清除其它格式
            this.clickImgUrl.priceSrc = this.clickImgUrl.sortPicUpDownNo;//清除其它格式
          }

          let temp = this;
          this.setSort= event;
          /*temp.axios.get("/searchController/itemSearch",{keywords:encodeURI(this.keyword),page:this.page,sort:this.searchSort}).then( (res) => {
            res.data.isSuccess?temp.goodsData=res.data.resultData.pager.records:temp.router.push({path:"/searchNothing",query:this.route.query});
          }).catch( (err) => {
            console.log(err);
          })*/

          temp.axios.get("/searchController/itemSearch",{params:{keywords:temp.keywords,page:temp.page,sort:temp.searchSort}}).then( (res) => {
            if(res.data.isSuccess && res.data.resultData.pager.records){
              temp.goodsData.length=0;
              temp.goodsData=temp.goodsData.concat(res.data.resultData.pager.records);
              goodsSiblings();
            }else{
              refresher.info.pullUpLable = "已经到底了";
              temp.myScroll.refresh();
            }
          }).catch( (err) => {
            console.log(err);
          })
        },
        /**点击搜索框**/
        goToSearch: function ($event) {
          var queryType = $("#search").val();
          var keyword=$(".search_box").val();
          var urlTemp=$.assemblyRequestString({queryType:queryType,keyword:this.keyword});
          //var goToPath='../../html/4_souSuoJieGuo/search.html'+"?"+urlTemp;
          //window.location=goToPath;
        },
        gotoGood:function(item,event){
//          window.location = "../../html/13_shangPinXiangQing/shangPinYe.html?itemId="+item.itemId+"&skuId="+item.skuId;
          this.$router.push({path:'/productDetail',query:{itemId:item.itemId,skuId:item.skuId}})
        },
        //跳转店铺首页
        toShop:function(shopId) {
          var paramData = {
            shopId:shopId
          };
          window.location = "../../html/5_dianPuShouYe/dianPu_index.html?"+ $.assemblyRequestString(paramData);
        },
        //商品收藏
        itemSkuFavorite:function(good){
          $.jsonAjax(getUrl('favourite/addItem'),{
            skuId:good.skuId,itemId:good.itemId,shopId:good.shopId,sellerId:good.sellerId,
          },function(data,status, xhr){
            if(data.success){
              popUp_auto(1500,"收藏成功");
            }else{
              popUp_auto_false(1500,data);
            }
          },false);
        },
        //店铺收藏
        shopFavorite:function(good){
          $.jsonAjax(getUrl('favourite/addShop'),{
            shopId:good.shopId,
          },function(data,status, xhr){
            if(data.success){
              popUp_auto(1500,"收藏成功");
            }else{
              popUp_auto_false(1500,data);
            }
          },false);
        },
        //店铺评分
        getUserItemInfo: function (item) {
          var temp = this;
          shopEvaluationInfoOut = {};
          var pdata = {
            shopId:item.shopId
          };
          $.jsonAjax(getUrl("shopBaseInfoController/shopEvaluationInfo"), pdata, function (data, status, xhr) {
            if (data) {
              shopEvaluationInfoOut = data;
            }
          },false);

          $.jsonAjax(getUrl("favourite/getItemFavouriteInfo"), {
            skuId:item.skuId,
            itemId:item.itemId,
            shopId:item.shopId,
          }, function (data, status, xhr) {
            if (data.success) {
              temp.itemFavouriteFlag = data.result.itemFavouriteFlag;
              temp.shopFavouriteFlag = data.result.shopFavouriteFlag;
            }
          },false);



          this.shopEvaluationInfo = shopEvaluationInfoOut;
        },
        searchItem:function(event,type){
          window.location = "../../html/4_souSuoJieGuo/search_result.html?keyword="+$(event.currentTarget).html() + "&queryType="+ $("#search").val();
        },
        enterSearch: function ($event,type) {
          var that=this;
          if($event.key=="Enter"){
            searchList();
          }else {
            console.log($event);
            $.jsonAjax(getUrl("searchController/autoComplete"),{'keyword':$(".search_box").val()},function(data, status, xhr){
              if(data.isSuccess){
                that.relationWords=data.resultData.termList;
                if(data.resultData.termList.length>0){
                  $(".relationWrap").show();
                }else {
                  $(".relationWrap").hide();
                }
              }else{

              }
            },false);
          }
        },
        returnPage: function () {
          /*if(levOut == 2){
           window.location.href = "../../html/11_pinDaoLeiMu/pinDaoLeiMu.html?cid="+pcid+"&lev=2&themId="+themId;
           }else{
           window.location = "../../html/1_index/index.html";
           }*/
          //cgl
          window.history.back(-1);
        }
      },
      beforeMount:function(){
        let temp = this;
        temp.keywords=temp.$route.query.keywords;
        temp.axios.get("/searchController/itemSearch",{params:{keywords:temp.keywords,page:temp.page,sort:temp.searchSort}}).then( (res) => {
          if(res.data.isSuccess && res.data.resultData.pager.records){
            temp.goodsData=temp.goodsData.concat(res.data.resultData.pager.records);
            goodsSiblings();
            temp.scrollInit();
          }else{
            temp.goodsData.length=0;
            temp.getDataErr=true;
            refresher.info.pullUpLable = "已经到底了";
//            temp.myScroll.refresh();
          }
        }).catch( (err) => {
          console.log(err);
        })

      },
      mounted:function(){
          if(this.goodsData.length){
            this.scrollInit();
          }
        goodsSiblings();
        changeFontColor();
      },
      updated:function(){
        this.myScroll.refresh();
        goodsSiblings();
        changeFontColor();
      },
      watch:{
        'queryData.keyword': function () {
          var that=this;
          $.jsonAjax(getUrl("searchController/autoComplete"),{'keyword':$(".search_box").val()},function(data, status, xhr){
            if(data.isSuccess){
              that.relationWords=data.resultData.termList;
              if(data.resultData.termList.length>0){
                $(".relationWrap").show();
              }else {
                $(".relationWrap").hide();
              }
            }else{

            }
          },false);
        }
      }
    }
</script>

<style>
  #wrapper{
    background: #f4f4f4;
  }
  body{
    font-size: 0.3rem;
  }
  #pullDown {
    height: 0.6rem;
  }
  #pullUp {
    margin-bottom: 0.4rem;
    clear: both;
  }
</style>
<style scoped>
  @import "../../assets/css/4_souSuoJieGuo/search.css";
</style>
<style>
  @import "../../assets/css/pullToRefresh.css";
</style>
