/**
 * Created by fdc on 2017/4/17.
 */
/**
*@fileName:shopIndexCoupon.js
*@author:fdc
*@time:2017/4/17
*@disc:店铺首页优惠券
 *
*/


var shopIndexCoupon = new Vue({
    el:"#shopIndexCoupon",
    mixins:[shop_coupon],
    data:{
        shopId:"",
        browserParams:""
    },
    methods:{
        //初始化浏览器参数
        initParam:function(){
            this.shopId = this.browserParams.shopId  ;
            if(!isNotBlank(this.shopId)){
               popUp_auto_false("shopId不能为空");
            }
        },
        //去店铺首页
        gotoShopIndex:function(){
            window.location.href='../../html/5_dianPuShouYe/dianPu_index.html?shopId=' + this.shopId;
        }
    },
    computed:{

    },
    beforeMount:function(){
        //获取浏览器参数
         this.browserParams = $.getUrlJson();
        //初始化参数
        this.initParam();
        //获取用户优惠卷信息
        this.getShopCoupons(this.shopId);
    },
    mounted:function(){

    },
    watch:{

    }
});
