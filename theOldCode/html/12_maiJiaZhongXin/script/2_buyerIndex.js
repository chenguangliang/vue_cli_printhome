/**
*@fileName:2_buyerIndex.js
*@author:fdc
*@time:2017/4/11 0011
*@disc:买家中心主页
*/

var buyerIndex = new Vue({
    el:"#buyerIndex",
    mixins:[index_advertises],
    data:{
        //用户信息
        serverUrl:server_url,
        imgUrl:img_url,
        userInfo:"",
        stayPayment:"",
        stayDelivery:"",
        stayReceipt:"",
        evaluation:"",
        approvedOrder:"",
        user_msg_num:0,
        periodOrdersMount:0,
        unPaidCount:0,
        paidCount:0
    },
    methods:{
        //查询分期订单数量
        getPeriodOrders: function () {
            var temp = this;
            $.jsonAjax(getUrl("periodorder/periodOrdersForBuyer"), {}, function (data, status, xhr) {
                if (data.isSuccess) {
                    console.log(data);
                    temp.periodOrdersMount=data.dataMap.allOrderCount;
                    temp.unPaidCount=data.dataMap.unPaidCount;
                    temp.paidCount=data.dataMap.paidCount;
                }
            }, false);
        },
        //查询买家全部订单
        queryPeriodOrders:function (tab) {
            if(tab==0||tab==1){
                window.location = "../../html/12_maiJiaZhongXin/12_dingDan_fenQiDingDan.html?tab="+tab;
            }else {
                window.location = "../../html/12_maiJiaZhongXin/12_dingDan_fenQiDingDan.html";
            }
        },
        //查询买家全部订单
        queryAllOrder:function () {
            window.location = "../../html/12_maiJiaZhongXin/12_dingDan_woDedingDan.html";
        },
        //查询待审核订单
        queryApprovedOrder:function() {
            var paramData = {};
            paramData.approveStatus = 0;
            window.location = "../../html/12_maiJiaZhongXin/12_dingDan_dingDanShenHe.html?"+ $.assemblyRequestString(paramData);
        },
        //查询退款/售后
        querySaleAfter:function() {
            window.location = "../../html/12_maiJiaZhongXin/12_dingDan_tuiKuanShouHou.html";
        },
        //根据不同状态查询订单
        queryOrderByState:function(state) {
            var paramData = {
                state:state
            };
            window.location = "../../html/12_maiJiaZhongXin/12_dingDan_woDedingDan.html?"+ $.assemblyRequestString(paramData);
        },
        //统计不同状态下订单数量
        countOrderNum:function() {
            var temp = this;
            var paramData = {};
            $.jsonAjax(getUrl("order/countBuyerOrderNum"), filterJSONNULL(paramData), function (data, status, xhr) {
                if (data.isSuccess) {
                    var resultData = data.resultData;
                    temp.stayPayment = resultData.stayPayment;
                    temp.stayDelivery = resultData.stayDelivery;
                    temp.stayReceipt = resultData.stayReceipt;
                    temp.evaluation = resultData.evaluation;
                }
            }, false);

            $.jsonAjax(getUrl("order/countApprovedOrder"), filterJSONNULL(paramData), function (data, status, xhr) {
                if (data.isSuccess) {
                    var resultData = data.resultData;
                    temp.approvedOrder = resultData.approvedOrder;
                }
            }, false);
        },
        //获取用户信息
        getUserInfo:function(){
            var tmep = this;
            $.jsonAjax(getUrl("user/getUserByIdForLogin"), {}, function (data, status, xhr) {
                if (data.success) {
                    tmep.userInfo = data.result;
                    //console.log(data.result);
                    // console.log(vm.$data.userInfo);
                }
            }, false);
        },
        //求购管理，并进行权限认证
        gotoQiuGou:function () {
            if(this.userInfo.usertype>1){
                window.location = '../../html/12_maiJiaZhongXin/13_woDeQiuGou_woDeQiuGou.html';
            }else{
                popUp_auto_false(1000, "抱歉！您未拥有此权限，欢迎您进行买家认证");
            }
        },
        //获取消息中心未读消息的数量
        getUserMessageNum:function(){
            var tmep = this;
            $.jsonAjax(getUrl("buyer/getMessageNum"), {messageType:1,readFlag:1}, function (data, status, xhr) {
                if (data.success) {
                    tmep.user_msg_num = data.result;
                }
            });
        },
        //去小印支付
        gotoPayIndex:function(){
            if(this.userInfo.userstatus < 3){
                printConfirm("您还未认证，暂未开通小印支付账户，认证后方可使用小印支付服务？",function(){
                    window.location= "../../html/2_login_sign/fastRenZheng.html";
                },function(){

                });
            }else{
                window.location = "../../html/15_xiaoYinZhiFu/queryBalance.html";
            }

        }
    },
    beforeMount:function(){
        /*获取用户信息*/
        this.getUserInfo();
        this.countOrderNum();//统计不同状态下订单数量
        //查询分期订单
        this.getPeriodOrders();
        //获取用户未读消息的数量
        this.getUserMessageNum();
    },
    mounted:function(){

    }
});
