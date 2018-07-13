/**
 * Created by fdc on 2017/4/18.
 */
/**
*@fileName:myCoupons.js
*@author:fdc
*@time:2017/4/18
*@disc:买家中心,我的优惠券js
 *
*/
Array.prototype.removeByValue = function(val) {
    for(var i=0; i<this.length; i++) {
        if(this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
}


var myCoupons = new Vue({
    el:"#myCoupons",
    mixins:[shop_coupon,common],
    data:{
        pager:'',
        userConpons:[],
        showModel:true,
        deleteDialog:false,
    },
    methods:{
        //获取用户的优惠券
        getUserConpons:function(){
            var temp = this;
            popUp_open();
            $.jsonAjax(getUrl('coupons/buyerCoupons'),{},function(data, status, xhr){
                console.log(data);
                if(data.success){
                    temp.userConpons = data.result.couponsDTOs;
                    temp.pager = data.result.pager;
                }
                popUp_close();
            },false);
        },
        //得到优惠卷颜色样式
        getCouponType:function(coupon){
           /* 0-未开始 1-已开始 2-已结束 3-已中止 4-待送审 5-待审核 6- 审核驳回 7-已领完'*/
            /*userCouponType;// 用户领取优惠券的状态	0-未使用，1-已使用，2-已过期 3-未开始 4-已终止*/
            var couponType =  coupon.couponType;
            var state = coupon.state;
            if(coupon.deleted=='1'){
                return 'yiguoqi';
            }else{
                if(state == 2){
                    return 'yiguoqi';
                }else {
                    if(coupon.userCouponType == 1 ){
                        return 'yiguoqi';
                    }else{
                        if(couponType == '1')
                            return 'manjian';
                        if(couponType == '2')
                            return 'dazhe';
                        if(couponType == '3')
                            return 'xianjin';
                    }
                }
            }
        },
        //获取优惠卷图片
        getCouponStateImg:function(coupon){
            var couponType =  coupon.couponType;
            var state = coupon.state;
            if(coupon.deleted == '1'){
                return '../../../img/yiguoqi@3x.png';
            }else{
                if(state == 2){
                    return '../../../img/yiguoqi@3x.png';
                }else {
                    if(coupon.userCouponType == 1 ){
                        return '../../../img/yishiyong@3x.png';
                    }
                }
            }
        },
        //判断优惠券是否过期
        getCouponCanDelete:function(coupon){
            var showFlag = false;
            var couponType =  coupon.couponType;
            var state = coupon.state;
            if(coupon.deleted=='1'){
                showFlag = true;
            }else{
                if(state == 2){
                    showFlag = true;
                }else {
                    if(coupon.userCouponType == 1 ){
                        showFlag = true;
                    }
                }
            }
            return showFlag;
        },
        //进入 编辑模式
        gotoEdit :function(){
            this.showModel = false;
        },

        //完成
        gotoFinish:function(){
            this.showModel = true;
        },
        //选中需要删除的数据
        checkedCoupon:function(coupon){
            Vue.set(coupon,"checked",!Boolean(coupon.checked));
        },
        //删除选中的条目
        deleteCheckCoupon:function(){
            this.deleteDialog = !this.deleteDialog;
            var temp = this;
            var deleteCount = 0;
            var deleteCoupons = [];
            $.each(this.userConpons,function(indexCoupon,coupon){
                if(coupon.checked){
                    deleteCount ++ ;
                    deleteCoupons.push(coupon.couponUserId);
                }
            });
            if(deleteCount == 0){
                popUp_auto_false(1500,"请先选择需要删除的优惠券！");
            }else{
                popUp_open();
                $.jsonAjax(getUrl("coupons/couponsUserUpdates"),{ids:JSON.stringify(deleteCoupons)},function(data, status, xhr){
                    console.log(data);
                    popUp_close();
                    if(data.success){
                        popUp_auto(1500,"删除成功！");
                        deleteJsonArrayItem(temp.userConpons,"checked");
                    }else{
                        popUp_auto_false(1500,data.errorMessages);
                    }
                });
            }

        }

    },
    computed:{

    },
    beforeMount:function(){
        //获取用户的优惠券
        this.getUserConpons();

    },
    mounted:function(){
        //上拉刷新下拉加载
        refresher.init({
            id: "wrapper",
            pullDownAction: Refresh,
            pullUpAction: Load
        });
        changeLabel(this.$data.pager.nextPage,this.$data.pager.page);
    },
    updated:function(){
        myScroll.refresh();
        changeLabel(this.$data.pager.nextPage,this.$data.pager.page);
    },
    watch:{

    }
});


function Refresh() {
    setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
        myScroll.refresh();
        /****remember to refresh when you action was completed！！！****/
    }, 2000);
}

function Load() {
    setTimeout(function () {
        var nextPage = myCoupons.$data.pager.nextPage;
        var thisPage = myCoupons.$data.pager.page;
        if (nextPage == thisPage) {
            refresher.info.pullUpLable = "已经到底了";
        } else {
            refresher.info.pullUpLable = "上拉加载...";
            $.jsonAjax(getUrl('coupons/buyerCoupons'),{page:nextPage},function(data, status, xhr){
                if(data.success){
                    myCoupons.$data.userConpons = myCoupons.$data.userConpons.concat(data.result.couponsDTOs);
                    myCoupons.$data.pager = data.result.pager;
                }
            },false);
            // nextPage = myCoupons.$data.pager.nextPage;
            // thisPage = myCoupons.$data.pager.page;
            // if (nextPage == thisPage) {
            //     refresher.info.pullUpLable = "已经到底了";
            // }
            changeLabel(myCoupons.$data.pager.nextPage,myCoupons.$data.pager.page);
        }
        myScroll.refresh();
    }, 1000);

}
function changeLabel(nextPage,thisPage) {
    if(nextPage <= thisPage){
        refresher.info.pullUpLable = "已经到底了";
    }else {
        refresher.info.pullUpLable = "上拉加载...";
    }
    document.querySelector('.pullUpLabel').innerHTML =refresher.info.pullUpLable;
}