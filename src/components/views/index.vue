<template>
  <div >
    <img  id="bbsImg" style="display: none" src="" alt=""/>
    <!--头部开始-->
    <header>
      <div class="header clearfix">
        <div class="pinDao" @click="toggleMenu();">
          <span></span>
        </div>
        <div class="souSuo">
          <span class="select" id="typeTitle" @click="changeType(0)">商品</span>
          <span class="arrow"></span>
          <ul id="typePanel" class="typePanel block_bg none">
            <li @click="typeClick(0);">商品</li>
            <li @click="typeClick(1);">店铺</li>
          </ul>
          <span class="line"></span>
          <input type="text" placeholder="输入要搜索的商品" class="text" @click='goToSearch'/>
          <span class="btn"><img src="../../assets/img/sousuo@3x.png" alt=""/></span>
        </div>
      </div>
      <div id="navigation">
        <span class="sanjiao"></span>
        <ul id="list">
          <template v-for="channel in erJiPinDaoList">
            <li>
              <a href="javascript:;" @click="toPinDaoIndex(channel.cId)">{{channel.cName}}</a>
            </li>
          </template>
        </ul>
      </div>
    </header>
    <!--头部结束-->
    <div class="main">
      <!--焦点图开始-->
      <section>
        <div class="swiper-container">
          <swiper :options="swiperOption" class="swiper-wrapper">
            <swiper-slide v-for="(item, index) in mallBanner" :key="index">
              <img :src="imgUrl + item.bannerUrl" class="slideImg">
            </swiper-slide>

          </swiper>
          <div class="pad_wrap">
            <span class="swiper-pagination"></span>
          </div>

        </div>

      </section>
      <!--快速导航开始-->
      <section>
        <div class="nav">
          <ul class="clearfix">
            <!--<li>-->
            <!--<a href="javascript:;">-->
            <!--</a>-->
            <!--特纸专区-->
            <!--</li>-->
            <!--<li>-->
            <!--<a href="javascript:;">-->
            <!--</a>-->
            <!--集采专区-->
            <!--</li>-->
            <li v-for="item in mallwxIconList" v-cloak>
              <a :href="item.iconLink" >
                <img v-bind:src="imgUrl + item.iconUrl"/>
              </a>
              {{item.title}}
            </li>
            <!-- <li>
                 <a href="../../html/9_pinPaiDaQuan/pinPaiDaQuan.html">
                 </a>
                 品牌大全
             </li>-->
            <!--<li>-->
            <!--<a href="javascript:;">-->
            <!--</a>-->
            <!--膜频道-->
            <!--</li>-->
            <!--<li>-->
            <!--<a href="javascript:;">-->
            <!--</a>-->
            <!--积分商城-->
            <!--</li>-->
            <!--<li>
                <a href="../../html/7_lingQuanZhongXin/lingQuanZhongXin.html">
                </a>
                优惠券
            </li>-->
            <li v-cloak>
              <a href="../../html/11_pinDaoLeiMu/pinDaoLeiMu.html">
                <img src="../../assets/img/fenlei@3x.png"/>
              </a>
              分类专区
            </li>
          </ul>
        </div>
      </section>
      <!--滚动公告-->
      <section>
        <div class="adv">
          <span class="logo"></span>
          <span class="line"></span>
          <div id="scrollDiv">
            <div class="box">
              <ul class="list">
                <template v-for="(item,index) in noticeFragement">
                  <template v-if="index < 4 ">
                    <li @click="showNeiRongPage(item)">
                      <a class="twoLine" href="javascript:;" v-html="item.noticeTitle"></a>
                    </li>
                  </template>
                </template>
              </ul>
            </div>
          </div>
          <a href="javascript:;" class="more" @click="toMoreNotice">更多</a>
        </div>
      </section>
      <!--热销广告标题-->
      <section>
        <div class="title">印刷家<span>·</span>采购好管家</div>
        <div class="picAdd clearfix">
          <ul class="ul01 clearfix">
            <template v-if="guessLoveMap[1] != null">
              <li>
                <a V-bind:href="guessLoveMap[1].adURL" >
                  <img v-bind:src="imgUrl + guessLoveMap[1].adSrc" />
                </a>
              </li>
            </template>
            <template v-else>
              <li>
                <a href="javascript:;">
                  <img src="" alt=""/>
                </a>
              </li>
            </template>

            <template v-if="guessLoveMap[2] != null">
              <li>
                <a V-bind:href="guessLoveMap[2].adURL" >
                  <img v-bind:src="imgUrl + guessLoveMap[2].adSrc" />
                </a>
              </li>
            </template>
            <template v-else>
              <li>
                <a href="javascript:;">
                  <img src="" alt=""/>
                </a>
              </li>
            </template>

            <template v-if="guessLoveMap[3] != null">
              <li>
                <a V-bind:href="guessLoveMap[3].adURL" >
                  <img v-bind:src="imgUrl + guessLoveMap[3].adSrc" />
                </a>
              </li>
            </template>
            <template v-else>
              <li>
                <a href="javascript:;">
                  <img src="" alt=""/>
                </a>
              </li>
            </template>
          </ul>
          <ul class="ul02 clearfix">
            <template v-if="guessLoveMap[4] != null">
              <li>
                <a V-bind:href="guessLoveMap[4].adURL" >
                  <img v-bind:src="imgUrl + guessLoveMap[4].adSrc" />
                </a>
              </li>
            </template>
            <template v-else>
              <li>
                <a href="javascript:;">
                  <img src="" alt=""/>
                </a>
              </li>
            </template>

            <template v-if="guessLoveMap[5] != null">
              <li>
                <a V-bind:href="guessLoveMap[5].adURL" >
                  <img v-bind:src="imgUrl + guessLoveMap[5].adSrc" />
                </a>
              </li>
            </template>
            <template v-else>
              <li>
                <a href="javascript:;">
                  <img src="" alt=""/>
                </a>
              </li>
            </template>

            <template v-if="guessLoveMap[6] != null">
              <li>
                <a V-bind:href="guessLoveMap[6].adURL" >
                  <img v-bind:src="imgUrl + guessLoveMap[6].adSrc" />
                </a>
              </li>
            </template>
            <template v-else>
              <li>
                <a href="javascript:;">
                  <img src="" alt=""/>
                </a>
              </li>
            </template>
          </ul>
        </div>
        <div class="zhuti clearfix">
          <div id="left" style="box-shadow: #d8d8d8 -1px 1px 4px;margin-left: 0.1rem">
            <div class="box">
              <ul class="list">
                <template v-for="(key,value) in weekAdvertises">
                  <template v-if="value >= 0 && value <4">
                    <li>
                      <a V-bind:href="key.adURL" >
                        <img v-bind:src="imgUrl + key.adSrc" />
                      </a>
                    </li>
                  </template>
                </template>
              </ul>
            </div>
          </div>
          <div id="right" style="float: right;box-shadow: #d8d8d8 1px 1px 4px;margin-right: 0.1rem">
            <div class="box">
              <ul class="list">
                <template v-for="(key,value) in advertises">
                  <template v-if="value >= 0 && value <4">
                    <li>
                      <a v-bind:href="key.adURL" >
                        <img v-bind:src="imgUrl + key.adSrc" />
                      </a>
                    </li>
                  </template>
                </template>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <!--楼层-->
      <template v-for="(key,value) in floors">
        <section :id="'floor'+ value" style="overflow: hidden;"></section>
      </template>
      <!--底部logo-->
      <div class="logo">
      </div>
      <!--占位-->
      <div class="zhanwei"></div>
      <!--回到顶部-->
      <div id="top" style="z-index: 999" @click="goToTop">
      </div>
    </div>
    <!--申请快速卖家邀请认证弹窗-->
    <div class="commonWin quickTip" >
      <div class="commonWinCon">
        <h5>通知</h5>
        <p class="commonWinMsg">您申请的快速卖家信息已被驳回，请前往PC端【订单中心-快速订单】点击【申请快速卖家】按钮进行修改，感谢您认可印刷家！</p>
        <div class="commonWinLine"></div>
        <div class="commonWinBtnWrap" style="padding-left: 0;">
          <span class="commonWinBtn sure" @click="closeTip()" style="margin: 0 auto 0.2rem;float: none">确定</span>
        </div>
      </div>
    </div>
    <!--申请快速卖家被驳回弹窗-->
    <div class="commonWin quickInvitation">
      <div class="commonWinCon">
        <h5>认证快速卖家邀请</h5>
        <p class="commonWinMsg">您是否要认证快速卖家？<br>认证后您将可以在平台进行金额交易、公司信息将在平台记录、保障您的账户安全等多功能优势。<br><span style="color: #e60012">请前往PC端进行认证</span></p>
        <div class="commonWinLine"></div>
        <div class="commonWinBtnWrap" style="padding-left: 0;">
          <span class="commonWinBtn sure" @click="closeInvitation()" style="margin: 0 auto 0.2rem;float: none">确定</span>
        </div>
      </div>
    </div>
    <main-footer :user-info="userInfo" :current-position="1"></main-footer>
  </div>

</template>
<style>
  @import "../../../node_modules/swiper/dist/css/swiper.css";
  @import "../../css/index.css";
  @import "../../css/animate.css";
</style>

<script type="text/ecmascript-6">
  import request from "../../lib/request";
  import common from "../../lib/common";
  import {swiper,swiperSlide} from "vue-awesome-swiper";
  import index from "../../lib/1_index";
  import mainFooter from "./index/mainFooter.vue";
  import $ from "jquery";
  export default {
    name: 'index',
    data :function() {
      return {
        serverUrl: request.server_url,
        imgUrl: request.img_url,
        userInfo: {},
        erJiPinDaoList:[],
        noticeFragement: [],
        mallBanner: [],
        advertises: [],
        weekAdvertises:[],
        guessLoveMap: {},
        floors: [],
        queryType: "goods",
        mallwxIconList:[],
        swiperOption: {//轮播config
          autoplay:{
            delay: 3000,
            stopOnLastSlide: false,
            disableOnInteraction: false,
          },
          loop:true,
          effect:"flip",
          pagination: {
            el: '.swiper-pagination',
          },
        }
      }
    },
    methods:{
      toggleMenu(){
        $("#navigation").toggle();//一期不开放
      },
      goToSearch(){
        var queryType = $("#typeTitle").html()=="商品"?"goods":"shop";
        this.$router.push({name:"search",query:{queryType:queryType}})
      },
      /* 查询二级频道列表*/
      queryErJiPinDao () {
        let temp=this;
        temp.axios.get("/erJiChannels").then( (res) => {
          res.data?temp.erJiPinDaoList=res.data:"";
        }).catch( (err) => {
            console.log(err);
        })
      },
      toMoreNotice() {
        window.location ="../../html/6_gongGao/gongGaoLieBiao.html";
      },
      goToTop: common.goToTop,
      /**
       * 加载用户信息
       */
      getUserInfo(){
        let temp = this;
        temp.axios.get("/user/getUserInfo").then((res) => {
          res.data.success?temp.userInfo=res.data.result:"";
        }).catch( (err)=> {
          console.log(err);
        })
      },
      /**
       * 跳转到对应的二级频道页
       * @param cId
       */
      toPinDaoIndex (cId) {
        window.location = "../../html/10_pinDaoShouYe/pinDaoShouYe.html?cid="+cId;
      },
      /*切换店铺和商品*/
      changeType (res) {
        if (res == 0) {
          $("#typePanel").toggle();
        } else {
          $("#typePanel").hide();
        }
      },
      /*切换店铺和商品*/
      typeClick (para) {
        if (0 == para) {
          $("#typeTitle").html('商品');
        } else {
          $("#typeTitle").html('店铺');
        }
        this.changeType(1);
      },
      showNeiRongPage (notice) {
        if(notice.noticeType == 1){
          window.location = "../../html/6_gongGao/gongGaoNeiRong.html?noticeId="+notice.noticeId;
        }else{
          window.location = notice.url;
        }

      },
      //加载论坛
      loadForum (){
        let temp=this;
        temp.axios.get("/user/loadForum").then((res)=> {
          res.data.success?$("#bbsImg").attr("src",data.result):"";
        }).catch( (err)=> {
          console.log(err);
        })
      },
      //获取首页图标
      getMallwxIndexIcon (){
        let temp=this;
        temp.axios.get("/mallwxIcon").then( (res) => {
          res.data?temp.mallwxIconList=res.data:"";
        }).catch( (err) => {
          console.log(err);
        })
      },
      closeInvitation () {
        $(".quickInvitation").hide();
      },
    },
    components:{
      'mainFooter':mainFooter,
      swiper,
      swiperSlide
    },
    beforeMount: function () {
      let temp = this;
      this.getUserInfo();
      this.queryErJiPinDao();
      //首页轮播图
      temp.axios.get("/mallBanner").then( (response) => {
        response.data ? temp.mallBanner = response.data:'';
      }).catch( (err) => {
        console.log(err);
      })
      //获取首页图标
      this.getMallwxIndexIcon();


      /**
       * 首页公告
       */
      temp.axios.get("/noticeFragement").then( (res) => {
        res.data?temp.noticeFragement=res.data:"";
      }).catch( (err) => {
        console.log(err);
      })




      /**
       * 轮播图下的广告位:本周推荐 + 广告位
       */
      temp.axios.get("/weekadvertises").then( (res) => {
        res.data?temp.weekAdvertises=res.data:"";
      }).catch( (err) => {
        console.log(err);
      })
      temp.axios.get("/advertises").then( (res) => {
        res.data?temp.advertises=res.data:"";
      }).catch( (err) => {
        console.log(err);
      })

      /**
       * 猜你喜欢
       */
      temp.axios.get("/guessLoveMap").then( (res) => {
        res.data.isSuccess?temp.guessLoveMap=res.data.resultData:"";
      }).catch( (err) => {
        console.log(err);
      })


    },
    mounted: function () {
      //公告列表向上滚动
//      $("#scrollDiv").cxScroll({direction:"bottom",speed:600,time:3000,plus:false,minus:false,step:1});
      //对联图片向上滚动
//      $("#left").cxScroll({direction:"bottom",speed:500,time:2000,plus:false,minus:false,step:1});
//      $("#right").cxScroll({direction:"bottom",speed:500,time:2000,plus:false,minus:false,step:1});
      var temp = this;
      //请求楼层
      temp.axios.get("/floors").then((res) => {
        res.data ? temp.floors = res.data:"";
      }).then(function () {
        //TODO:下面的循环改了！也把load方法改了，不用load！
        $.each(temp.$data.floors, function (index, ele) {
          $("#floor" + index).load(request.getUrl('floor') + "?userId="+temp.userInfo.uid+"&fid=" + ele.idDTO + "&num=" + index + "&commonPlatformId" + "=" + request.commonPlatformId, function (data, status, xhr) {
            //$('#img-scroll'+index).cxScroll({direction:"right",speed:500,time:2000,plus:false,minus:false,step:2});
          });
        });
      }).catch( (err) => {
        console.log(err);
      })

      this.loadForum();
      var invitationFlag=$.getUrlJson().invitation;
      if(this.userInfo.userstatus==9 && invitationFlag==1){ //快速卖家未认证
        $(".quickInvitation").show();
      }
    }
  }
</script>
