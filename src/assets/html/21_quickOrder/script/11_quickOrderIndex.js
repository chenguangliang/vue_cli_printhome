/**
 *  快速下单-首页
 */
/**********************************************************************************************************************/
var quickOrderIndexVue = new Vue({
    el: "#app",
    data: {
        //用户信息
        userInfo:"",
        result:{
            allOrdersCount:0,
            confirmOrder:0,
            stayPayment:0,
            stayDelivery:0,
            stayReceipt:0,
            evaluation:0,
            successOrder:0,
            cancleOrder:0

        },
        urlObj:{},//身份(urlObj:{identity:0})
    },
    methods: {
        initIndex: function () {
            var temp=this;
            var paramData={'centerType':temp.urlObj.identity};
            $.jsonAjax(getUrl("/quickor/master/portal"), paramData, function (data, status, xhr) {
                if (data.isSuccess) {
                    console.log(data);
                    temp.result=data.result;
                 } else {
                 popUp_auto_false(2500, '网络错误');
                 }
            }, false);
        },
        goToAllOrders: function () {
            if(this.urlObj.identity==1){
                window.location='./1_quickOrderList_buyer.html'
            }else {
                window.location='./2_quickOrderList_seller.html'
            }
        },
        //99:待确认 1:待付款，2：待配送，3：待确认收货，4：待评价，5：已完成 6:已取消 7：已关闭'
        //待确认
        goToConfirmOrder: function () {
            if(this.urlObj.identity==1){
                window.location='./1_quickOrderList_buyer.html?checked=99'
            }else {
                window.location='./2_quickOrderList_seller.html?checked=99'
            }
        },
        //待付款
        goToStayPayment: function () {
            if(this.urlObj.identity==1){
                window.location='./1_quickOrderList_buyer.html?checked=1'
            }else {
                window.location='./2_quickOrderList_seller.html?checked=1'
            }
        },
        //待配送
        goToStayDelivery: function () {
            if(this.urlObj.identity==1){
                window.location='./1_quickOrderList_buyer.html?checked=2'
            }else {
                window.location='./2_quickOrderList_seller.html?checked=2'
            }
        },
        //待收货
        goToStayReceipt: function () {
            if(this.urlObj.identity==1){
                window.location='./1_quickOrderList_buyer.html?checked=3'
            }else {
                window.location='./2_quickOrderList_seller.html?checked=3'
            }
        },
        //已完成
        goToSuccessOrder: function () {
            if(this.urlObj.identity==1){
                window.location='./1_quickOrderList_buyer.html?checked=5'
            }else {
                window.location='./2_quickOrderList_seller.html?checked=5'
            }
        },
        //已取消
        goToCancleOrder: function () {
            if(this.urlObj.identity==1){
                window.location='./1_quickOrderList_buyer.html?checked=6'
            }else {
                window.location='./2_quickOrderList_seller.html?checked=6'
            }
        },
        //获取用户信息
        getUserInfo:function(){
            var tmep = this;
            $.jsonAjax(getUrl("user/getUserByIdForLogin"), {}, function (data, status, xhr) {
                if (data.success) {
                    tmep.userInfo = data.result;
                    console.log(data.result);
                    // console.log(vm.$data.userInfo);
                }
            }, false);
        },
    },
    beforeMount: function () {
        /*获取用户信息*/
        this.getUserInfo();
    },
    mounted: function () {
        this.urlObj= $.getUrlJson();
        this.initIndex();
    },
    updated: function () {
    }

});
