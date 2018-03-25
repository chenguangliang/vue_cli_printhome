<template>
  <div>
    <template v-if="!userinfo.usertype || userinfo.usertype == 1 || userinfo.usertype == 2 ">
      <div>
        <footer>
          <div id='nav'>
            <dl>
              <a href='javascript:void(0);' @click='gotoIndex'>
                <dt><img :src="currentpoition == indexPage ? index1 : index" alt='' id='shouye'/></dt>
                <dd>首页</dd>
              </a>
            </dl>
            <dl>
              <a href='javascript:;' @click='gotoForum'>
                <dt style='margin-bottom: 0.11rem;'> <img  :src="currentpoition == forumPage ? luntan1 : luntan" alt='' id='luntan'/> </dt>
                <dd>论坛</dd>
              </a>
            </dl>
            <dl id='plus'> </dl>
            <dl>
              <a href='javascript:void(0);' @click='gotoCart'>
                <dt> <img :src="currentpoition == cartPage ? footCartNum == 0 ? buy1 : buy1_no : footCartNum == 0 ? buy : buy_no"     alt='' id='buy'/></dt>
                <dd>购物车</dd>
              </a>
            </dl>
            <dl>
              <a href='javascript:void(0);' @click='gotoBuyer'>
                <dt> <img  :src="currentpoition == buyerPage ? my1 : my"  alt='' id='my'/></dt>
                <dd>我的小印</dd>
              </a>
            </dl>
          </div>
          <div class='win_button' style='position: fixed;bottom: 0.1rem;left: 50%;margin-left: -0.5rem;z-index:1001' @click='floatingLayer($event)'>
            <a href='javascript:;'>
              <img style='height: 1rem;width: 1rem' src='../../assets/img/plus2.png' alt=''/>
            </a>
          </div>
        </footer>
        <div id='zhezhao' class='none'>
          <div class='black_div'style='height: 100%;width: 100%; background:rgba(0,0,0,0.7);position: absolute;opacity: 0;'></div>
          <dl>
            <a href='javascript:;' @click='collectionGood'>
              <dt> <img src='../../assets/img/shangpin.png' alt=''/> </dt>
              <dd>收藏商品</dd> </a>
          </dl>
          <dl>
            <a href='javascript:void(0);' @click='payOrder(userinfo)'>
              <dt>
                <img src='../../assets/img/daifukuan.png' alt='' />
              </dt>
              <dd>待付款</dd>
            </a>
          </dl>
          <dl id='2_login_sign'>
            <a href='javascript:void(0);' @click='gotoLogin(userinfo)'>
              <dt>
                <img src='../../assets/img/login.png' alt=''/>
              </dt>
              <dd><template v-if='!userinfo.usertype'>登录</template><template v-else>注销</template></dd>
            </a>
          </dl>
          <dl>
            <a href='javascript:void(0);' @click='allOrder(userinfo)'>
              <dt> <img src='../../assets/img/dingdan.png' alt='' /> </dt>
              <dd>全部订单</dd>
            </a> </dl>
          <dl>
            <a href='javascript:void(0);' @click='deliveryOrder(userinfo)'>
              <dt> <img src='../../assets/img/daishouhuo.png' alt='' /></dt>
              <dd>待收货</dd>
            </a>
          </dl>
          <dl>
            <a href='javascript:;' @click='collectionShop'>
              <dt><img src='../../assets/img/dianpu.png' alt=''/></dt>
              <dd>收藏店铺</dd>
            </a>
          </dl>
        </div>
      </div>
    </template>
    <template v-else>
      <div>
        <footer>
          <div id='nav'>
            <dl>
              <a href='javascript:;' @click='gotoIndex'>
                <dt><img :src="currentpoition == indexPage ? '../../assets/img/index1.png' : '../../assets/img/index.png'" alt='' id='shouye'/></dt>
                <dd>首页</dd>
              </a>
            </dl>
            <dl>
              <a href='javascript:;' @click='gotoForum'>
                <dt style='margin-bottom: 0.11rem;'><img :src="currentpoition == forumPage ? '../../assets/img/luntan1.png' : '../../assets/img/luntan.png'" alt='' id='luntan'/> </dt>
                <dd>论坛</dd>
              </a>
            </dl>
            <dl id='plus'> </dl>
            <dl>
              <a href='javascript:void(0);' @click='gotoBuyer'>
                <dt><img :src="currentpoition == buyerPage ? '../../assets/img/my1.png' : '../../assets/img/my.png'" alt='' id='maijia'/></dt>
                <dd>买家中心</dd>
              </a>
          </dl>
            <dl>
              <a href='javascript:void(0);' @click='gotoSeller(userInfo)'>
                <dt><img  :src="currentpoition == sellerPage ? '../../assets/img/xuanzhong@3x.png' : '../../assets/img/weixuanzhong@3x.png'"  alt='' id='maiJia'/></dt>
                <dd>卖家中心</dd>
              </a>
            </dl>
          </div>
          <div class='win_button' style='position: fixed;bottom: 0.1rem;left: 50%;margin-left: -0.5rem;z-index:1001' @click='floatingLayer($event)'>
            <a href='javascript:;'><img style='height: 1rem;width: 1rem' src='../../assets/img/plus2.png' alt=''/></a>
          </div>
        </footer>
          <div id='zhezhao' class='none'>
            <div class='black_div'style='height: 100%;width: 100%; background:rgba(0,0,0,0.7);position: absolute;opacity: 0;'></div>
              <template v-if='userInfo.usertype != 5 '>
                <dl>
                  <a href='javascript:void(0);' @click='gotoAgreement'>
                    <dt><img src='../../assets/img/xieyiguanli@3x1.png' alt=''/></dt>
                    <dd>协议管理</dd>
                  </a>
                </dl>
                <dl>
                  <a href='javascript:void(0);' @click='gotoBuy'>
                    <dt> <img src='../../assets/img/qiugouguanli@3x1.png' alt='' /> </dt>
                    <dd>求购管理</dd>
                  </a>
                </dl>
            </template>
            <dl id='2_login_sign'>
                <a href='javascript:void(0);' @click='gotoLogin(userinfo)'>
                  <dt> <img src='../../assets/img/login.png' alt=''/> </dt>
                  <dd><template v-if='!userinfo.usertype'>登录</template><template v-else>注销</template></dd>
                </a>
            </dl>
            <template v-if='userInfo.usertype != 5'>
              <dl>
                <a href='javascript:void(0);' @click='allOrder(userinfo)'>
                  <dt><img src='../../assets/img/quanbudingdan@3x1.png' alt='' /> </dt>
                  <dd>全部订单</dd>
                </a>
              </dl>
              <dl>
                <a href='javascript:void(0);' @click='gotoOffer'>
                  <dt> <img src='../../assets/img/baojiaguanli@3x1.png' alt='' /> </dt>
                  <dd>报价管理</dd>
                </a>
              </dl>
              <dl>
                <a href='javascript:void(0);' @click='gotoCart'>
                  <dt><img src='../../assets/img/gouwuche@3x.png' alt=''/> </dt>
                  <dd>购物车</dd>
                </a>
              </dl>
            </template>
          </div>
      </div>
    </template>
  </div>
</template>
<style src=""></style>
<script type="text/ecmascript-6">
  //首页标志
  var indexPage  = 1;
  //论坛标志
  var forumPage  = 2;
  //购物车位置
  var cartPage = 3;
  //买家中心
  var buyerPage  = 4;
  //卖家中心
  var sellerPage  = 5;

  //跳转地址
  var gotoHtml = {
    data:function(){
      return {
        indexPage: indexPage,
        forumPage : forumPage,
        cartPage : cartPage,
        buyerPage :buyerPage,
        sellerPage: sellerPage,
        footCartNum : 0,
      }
    },
    methods:{
      //去购物车
      gotoCart:function(){
        window.location = '../../html/14_gouWuChe/gouWuChe.html';
      },
      //去首页
      gotoIndex:function(){
        window.location = '../../html/1_index/index.html';
      },
      //去论坛
      gotoForum:function(){
        window.location = 'http://bbs.printhome.com/';
      },
      //去登录
      gotoLogin:function(userinfo){
        if(!userinfo){
          window.location = '../../html/2_login_sign/login_common.html';
        }else{
          $.jsonAjax(request.getUrl('user/logout'),{},function(){
            window.location = '../../html/2_login_sign/login_common.html';
          });
        }
      },
      //全部订单
      allOrder:function(userinfo){
        if(!userinfo.usertype || userinfo.usertype == 1 || userinfo.usertype == 2 || userinfo.usertype == 5){//买家
          window.location = "../../html/12_maiJiaZhongXin/12_dingDan_woDedingDan.html";
        }else{//卖家
          if(this.checkShop()){
            window.location="../../html/18_maiJiaZhongXin/3_dingDan_woDedingDan.html"
          }else{
            popUp_auto_false(1500,"完成卖家审核后解锁该权限!");
          }
        }
      },
      //待收货订单
      deliveryOrder:function(userinfo){
        var paramData = {
          state:3
        };
        window.location = "../../html/12_maiJiaZhongXin/12_dingDan_woDedingDan.html?"+ $.assemblyRequestString(paramData);
      },
      //代付款
      payOrder:function(userinfo){
        var paramData = {
          state:1
        };
        window.location = "../../html/12_maiJiaZhongXin/12_dingDan_woDedingDan.html?"+ $.assemblyRequestString(paramData);
      },
      //收藏商品
      collectionGood:function(){
        window.location = '../../html/12_maiJiaZhongXin/3_shouCangZhongXin_shangPinShouCang.html';

      },
      //收藏店铺
      collectionShop:function(){
        window.location = '../../html/12_maiJiaZhongXin/3_shouCangZhongXin_dianPuShouCang.html';
      },
      //去买家中心
      gotoBuyer:function(){
        window.location = '../../html/12_maiJiaZhongXin/2_maiJiaZhongXin_maiJiaZhongXin.html';

      },
      //去卖家中心
      gotoSeller:function(userInfo){
        if(userInfo.usertype == 5 && (userInfo.userstatus == 9 || userInfo.userstatus == 7)){
          window.location = '../../html/18_maiJiaZhongXin/8_maiJiaZhongXin_maiJiaZhongXin.html';
        }else if(userInfo.usertype == 5 && (userInfo.userstatus == 8)){
          window.location = '../../html/18_maiJiaZhongXin/8_maiJiaZhongXin_maiJiaZhongXin.html';
        }else{
          if(this.checkShop()){
            window.location = '../../html/18_maiJiaZhongXin/8_maiJiaZhongXin_maiJiaZhongXin.html';
          }else{
            window.location = "../../html/18_maiJiaZhongXin/5_shenJinDuChaKan_shenHeJinDu.html";
          }
        }
      },
      //判断用户是否已完成店铺开店，完成则进入卖家中心，没有完成则进入卖家审核进度页面
      checkShop:function () {
        var isKT = false;
        $.jsonAjax(request.getUrl("information/progressSeller/initProgressMap"),{},function(data,status,xhr){
          if(data.status=="200"){
            var shopDTO = data.data.shopDTO;
            var userContractDTO = data.data.userContractDTO;
            // if((userContractDTO!=null && userContractDTO.contractStatus == '3' && (shopDTO.status =='2' || shopDTO.status == '5'))&&shopDTO.runStatus == '1'){
            if(shopDTO.status =='2' || shopDTO.status == '5'){
              isKT = true;
            }else{
              isKT = false;
            }
          }
        },false);
        return isKT;
      },
      //店铺管理
      shopManage:function(){

      },
      //小印支付
      citicPay:function(){

      },
      //去求购管理
      gotoBuy:function(){
        if(this.checkShop()){
          window.location = '../../html/18_maiJiaZhongXin/11_qiuGouGuanLi_qiuGouGuanLi.html';
        }else{
          popUp_auto_false(1500,"完成卖家审核后解锁该权限!");
        }
      },
      //去报价管理
      gotoOffer:function(){
        if(this.checkShop()){
          window.location = '../../html/18_maiJiaZhongXin/2_baoJiaGuanLi_baoJiaGuanLi.html';
        }else{
          popUp_auto_false(1500,"完成卖家审核后解锁该权限!");
        }
      },
      //去协议管理
      gotoAgreement:function(){
        if(this.checkShop()){
          window.location = '../../html/12_maiJiaZhongXin/10_xieYiGuanLi_xieYiGuanLi.html?sourcePage=seller';
        }else{
          popUp_auto_false(1500,"完成卖家审核后解锁该权限!");
        }
      },
      //弹出浮层
      floatingLayer:function(e){
        if ($("#zhezhao").hasClass("none")) {
          $("#zhezhao").removeClass("none");
          $(".black_div").animate({'opacity': 1.0}, 500);
          $(e.currentTarget).css({'transform': 'rotate(135deg)', 'transition': 'all 400ms'});
          $("#zhezhao dl").removeClass("bounceOutDown");
          $("#zhezhao dl").addClass("animated bounceInUp");
        } else {
          $(e.currentTarget).css({'transform': 'rotate(0deg)', 'transition': 'all 400ms'});
          $("#zhezhao dl").removeClass("bounceInUp");
          $("#zhezhao dl").addClass("bounceOutDown");
          window.setTimeout(function () {
            $(".black_div").animate({'opacity': 0}, 300);
            window.setTimeout(function () {
              $("#zhezhao").addClass("none");
            }, 300);
          }, 600)
        }
      },
      //获取购物车数量
      getCartNum:function(){
        var temp = this;
        $.jsonAjax(request.getUrl("shopCart/cartNum"),{},function(data,status,xhr){
          if(data.success){
            temp.footCartNum =  data.result;
          }
        },false);
      },

    },
    beforeMount:function(){
      this.getCartNum();
    }
  };
  import $ from "jquery";
  import request from "../../assets/js/request";
  export default {
    name:"mainFooter",
    mixins:[gotoHtml],
    data () {
        return {
          userinfo : this.userInfo,
          currentpoition : this.currentPosition,
          footCartNum : this.footCartNum,
          index:require("../../assets/img/index.png"),
          index1:require("../../assets/img/index1.png"),
          luntan:require('../../assets/img/luntan.png'),
          luntan1:require('../../assets/img/luntan1.png'),
          buy1:require('../../assets/img/buy1.png'),
          buy1_no:require('../../assets/img/buy1+.png'),
          buy:require('../../assets/img/buy.png'),
          buy_no:require('../../assets/img/buy+.png'),
          my:require('../../assets/img/my.png'),
          my1:require('../../assets/img/my1.png'),
        }
    },
    props:['userInfo','currentPosition'],
    methods:{

    },

  }
</script>
