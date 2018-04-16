/**
 * Created by Administrator on 2017/3/23 0023.
 */
/**
*@fileName:shopCoupon.js
*@author:fdc
*@time:2017/3/23 0023
*@disc:店铺优惠卷
*/
import popup from "../../components/popup.vue"

function getUrl(name) {
  return "http://wx.printhome.com/mall-web" + "/" + name;
}

export default {
    data: function () {
      return {
        //店铺优惠卷
        couponsDTOs:"",
        //优惠卷弹框
        couponDialog:false,
        //店铺优惠卷详情
        couponDetail:{couponUsingRange:"",couponInfo:""},
        //优惠卷详情弹框
        couponDetailDialog:false,
        noCoupon:""
      }
    }
      ,
    methods:{
        //获取优惠卷详情样式
        getCouponDetailClass:function(couponUsingRange){
            if(couponUsingRange == '1'){
                return 'pingtaitanchuang';
            }else{
                return 'dianputanchuang';
            }
        },
        //获取店铺优惠卷信息
        getShopCoupons:function(shopId){
            var temp = this;
            if(shopId!=null && typeof(shopId)!="undefined"){
                $.jsonAjax(getUrl("/shopItemListIndexController/shopCoupons"),
                    {shopId: shopId},
                    function(data,status, xhr){
                        // console.log(data);
                        if(data.success){
                            temp.couponsDTOs = data.result;
                        }else{
                            temp.couponsDTOs = '';
                        }
                    },false);
            }

        },
        //获取店铺优惠卷信息
        getShopCoupons:function(shopId,asyncFlag){
            var temp = this;
            debugger
            this.$ref.popup.popUp_open();
            if(shopId!=null && typeof(shopId)!="undefined"){
                $.jsonAjax(getUrl("/shopItemListIndexController/shopCoupons"),
                    {shopId: shopId},
                    function(data,status, xhr){
                        this.$ref.popup.popUp_close();
                        // console.log(data);
                        if(data.success){
                            temp.couponsDTOs = data.result;
                        }else{
                            temp.couponsDTOs='';
                            temp.noCoupon= "暂无可以领取的优惠券"
                        }
                    },asyncFlag);
            }

        },
         //得到优惠卷颜色样式
         getCouponType:function(entity){
             var retClass = "";
             //优惠券状态 0-未开始 1-已开始 2-已结束 3-已中止 4-待送审 5-待审核 6- 审核驳回 7-已领完
             if(entity.state == '2' ||entity.state == '3'){
                 retClass = "yiguoqi";
             }else if(entity.isGet=="true" || entity.state == '7'){
                 retClass = "yilingwan";
             }else if(entity.couponType == '1'){
                 retClass = "manjian";
             }else if(entity.couponType == '2'){
                 retClass = "dazhe";
             }else if(entity.couponType == '3'){
                 retClass = "xianjin";
             }
             return retClass;
         },
        //用户领取优惠卷
        getCoupons:function(coupon,$event){
            if(coupon.isGet=="true"||coupon.state == '2' ||coupon.state == '3'||coupon.state == '7'){
                return;
            }
            this.$ref.popup.popUp_open();
            $.jsonAjax(getUrl("coupons/getCoupons"),
                {couponId: coupon.couponId},
                function(data,status, xhr){
                    this.$ref.popup.popUp_close();
                    if(data.success){
                        if(data.result.userGetCount == coupon.allowGetNum){
                            coupon.isGet = 'true';
                        }
                        this.$ref.popup.popUp_auto(1500,'领取成功!');
                    }else{
                        this.$ref.popup.popUp_auto_false(3000,data.errorMessages);
                    }
                });
        },
        //获取优惠卷详情
        getCouponDetail:function(couponId){
            var temp = this;
            if(couponId!=null && typeof(couponId)!="undefined"){
                $.jsonAjax(getUrl("/coupons/couponShowList"),
                    {couponsId: couponId},
                    function(data,status, xhr){
                        console.log(data);
                        if(data){
                            if(data.result.couponInfo.couponUsingRange == 3){
                                temp.initCates(data.result);
                            }
                            temp.couponDetail = data.result;
                            temp.couponDetailDialog = true;
                        }
                    },false);
            }
        },
        //跳转店铺首页
        gotoShopIndex:function(shop){
            window.location="../../../html/5_dianPuShouYe/dianPu_index.html?shopId=" + shop.itemId;
        },
        //跳转商品详情
        gotoProductDetail:function(itemId,skuId){
            window.location = "../../../html/13_shangPinXiangQing/shangPinYe.html?itemId="+itemId+"&skuId="+skuId;
        },
        //如果是类目通用初始化数据
        initCates:function(data){
            var allCate = data.categoryes;
            var ranges = data.ranges;
            var tempThreeLevel = [];
            $.each(allCate,function(oneIndex,oneLevel){
                var oneLevelExist = false;
                $.each(oneLevel.children,function(twoIndex,twoLevel){
                    var twoExist = false;
                    $.each(twoLevel.children,function(threeIndex,threeLevel){
                        var exist  = false;
                        $.each(ranges,function(rangeIndex,range){
                            if(threeLevel.categoryCid　&& range.couponUsingId == threeLevel.categoryCid){
                                exist = true;
                                return false;
                            }
                        });
                        if(exist){
                            tempThreeLevel.push(threeLevel);
                            if(!twoExist){
                                twoExist  = true;
                            }
                        }
                    });
                    twoLevel.children = tempThreeLevel;
                    tempThreeLevel = [];
                    if(twoLevel.children.length > 0){
                        if(!oneLevelExist){
                            oneLevelExist  = true;
                        }
                    }
                    if(twoExist){
                        Vue.set(twoLevel,"canShow",true);
                    }

                });
                if(oneLevelExist){
                   Vue.set(oneLevel,"canShow",true);
                }

            });
        },
    },
    components:{popup},
    updated:function(){
        cateShow();
    }

};


function cateShow(){
    //品类弹窗一级、二级列表
    $(".kezi").click(function(){
        if(!$(this).hasClass('dianjihou')){
            $(this).addClass('dianjihou').parent().siblings().children('.kezi').removeClass('dianjihou');
        }else{
            $(this).removeClass('dianjihou');
        }
        if($(this).children().hasClass('yijibg')){
            $(this).children().removeClass('yijibg').addClass('yijibg2').parent().parent().siblings().children().children().removeClass('yijibg2').addClass('yijibg');
        }else{
            $(this).children().removeClass('yijibg2').addClass('yijibg');
        }
        $(this).next().slideToggle().parent().siblings().children('.erji').slideUp();
    });

//品类弹窗三级列表

    $(".sanji_top ").click(function(){
        if(!$(this).hasClass('sanji_top_color2')){
            $(this).removeClass('sanji_top_color').addClass('sanji_top_color2').parent().siblings().children('.sanji_top ').removeClass('sanji_top_color2').addClass('sanji_top_color');
        }else{
            $(this).removeClass('sanji_top_color2');
        }
        $(this).next('.sanji_bottom').slideToggle().parent().siblings().children('.sanji_bottom ').slideUp();

    });
}

