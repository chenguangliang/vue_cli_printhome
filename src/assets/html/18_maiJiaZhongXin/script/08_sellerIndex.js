/**
 * Created by fdc on 2017/4/19.
 */
/**
*@fileName:08_sellerIndex.js
*@author:fdc
*@time:2017/4/19
*@disc:卖家中心页面
 *
*/
var sellerIndex = new Vue({
    el:"#sellerIndex",
    data:{
        //用户信息
        userInfo:"",
        stayPayment:0,
        stayDelivery:0,
        stayReceipt:0,
        successOrder:0,
        allOrdersCount:0,
        user_msg_num:0,
    },
    methods:{
        //判断卖家用户是否完成开店，没有完成则直接跳转到卖家审核进度页面
        checkUserStatus:function () {
            $.jsonAjax(getUrl("information/progressSeller/initProgressMap"),{},function(data,status,xhr){
                if(data.status=="200"){
                    var shopDTO = data.data.shopDTO;
                    var userContractDTO = data.data.userContractDTO;
                    if(shopDTO.status =='2' || shopDTO.status == '5'){

                    }else{
                        window.location = "../../html/18_maiJiaZhongXin/5_shenJinDuChaKan_shenHeJinDu.html";
                    }
                }else{
                    popUp_auto_false(1500,data.msg);
                    setTimeout("gotoUrl('../../html/1_index/index.html')",1500);
                }
            },false);
        },
        //查询卖家全部订单
        queryAllOrder:function () {
            window.location = "../../html/18_maiJiaZhongXin/3_dingDan_woDedingDan.html";
        },
        //根据不同状态查询订单
        queryOrderByState:function(state) {
            var paramData = {
                state:state
            };
            window.location = "../../html/18_maiJiaZhongXin/3_dingDan_woDedingDan.html?"+ $.assemblyRequestString(paramData);
        },
        //统计不同状态下订单数量
        countOrderNum:function() {
            var temp = this;
            var paramData = {};
            $.jsonAjax(getUrl("order/countSellerOrderNum"), filterJSONNULL(paramData), function (data, status, xhr) {
                if (data.isSuccess) {
                    var resultData = data.resultData;
                    temp.stayPayment = resultData.stayPayment;
                    temp.stayDelivery = resultData.stayDelivery;
                    temp.stayReceipt = resultData.stayReceipt;
                    temp.successOrder = resultData.successOrder;
                    temp.allOrdersCount = resultData.allOrdersCount;
                }
            }, false);
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
        //获取消息中心未读消息的数量
        getUserMessageNum:function(){
            var tmep = this;
            $.jsonAjax(getUrl("buyer/getMessageNum"), {messageType:1,readFlag:1}, function (data, status, xhr) {
                if (data.success) {
                    tmep.user_msg_num = data.result;
                }
            });
        },
    },
    computed:{

    },
    beforeMount:function(){
        /*获取用户信息*/
        this.getUserInfo();

        if(this.userInfo.usertype == 5 && (this.userInfo.userstatus == 9 || this.userInfo.userstatus == 7)){
        }else if(this.userInfo.usertype == 5 && (this.userInfo.userstatus == 8)){
        }else{
            /*检查卖家审核状态*/
            this.checkUserStatus();
            this.countOrderNum();//统计不同状态下订单数量
        }

        //获取用户未读消息的数量
        this.getUserMessageNum();


    },
    mounted:function(){

    },
    updated:function(){

    },
    watch:{

    }
});