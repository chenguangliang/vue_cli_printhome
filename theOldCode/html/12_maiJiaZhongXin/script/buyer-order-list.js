/**
 *  买家中心---我的订单
 */
/**********************************************************************************************************************/
Array.prototype.removeByValue = function(val) {
    for(var i=0; i<this.length; i++) {
        if(this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
};

var buyerOrdersVue = new Vue({
    el: "#buyerOrders",
    mixins:[math,portionDelivery],
    data: {
        pager: {},
        orderList:[],
        jsonArray:[],
        img_url:img_url,
        orderState:"",
        submitInfo:{},
        tempOrder:{},
        payPassword:"",
        logisticsScheduleInfo:{},
        toPayParam:'',//临时储存去支付需要带的参数（为了逾期提示框）
    },
    methods: {
        //分期支付的支付接口
        toPayForAp: function ($event,orderId,orderApId,orderApItemId) {
            var paramData = {
                orderNo:orderId,
                orderApId:orderApId,
                orderApItemId:orderApItemId
            };
            if($event.target.attributes.apOverdueFee && $event.target.attributes.apOverdueFee.value>0){
                $("#payForPeriod").show();
                $("#overDueDay").html(' '+$event.target.attributes.overdueday.value);//弹窗里逾期的天数赋值
                $("#apOverdueFee").html($event.target.attributes.overduefee.value);//弹窗里逾期的手续费赋值
                $("#paytotal").html($event.target.attributes.paytotal.value);//弹窗里逾期的本金加手续费赋值
                this.toPayParam=$.assemblyRequestString(paramData);
            }else {
            	//判断下是否已经选择过转账支付
                $.jsonAjax(getUrl("order/checkOrderPayMethd"), filterJSONNULL(paramData), function (data, status, xhr) {
                    if(data.result){
                        window.location = "../../html/16_dingDanHeDui/payLastPage.html?"+ $.assemblyRequestString(paramData);
                    }else{
                        window.location = "../../html/16_dingDanHeDui/quZhiFu.html?"+ $.assemblyRequestString(paramData);
                    }

                }, false);
                //window.location = "../../html/16_dingDanHeDui/quZhiFu.html?"+ $.assemblyRequestString(paramData);
            }
        },
        toPayForApForOverDue: function () {
            window.location = "../../html/16_dingDanHeDui/quZhiFu.html?"+ this.toPayParam;
        },
        //根据状态选中不同导航条
        selectedBar:function() {
            var temp = this;
            var tempState = temp.submitInfo.state;
            if(tempState == null || tempState == ""){
                return;
            }
            $("#navigation_bar li").each(function() {
                var state = $(this).attr("state");
                if(state == tempState){
                    $(this).attr("class","on");
                }else{
                    $(this).attr("class","");
                }
            });
        },
        //去支付
        toPay:function (orderId) {
            var paramData = {
                orderNo:orderId
            };
            //判断下是否已经选择过转账支付
            $.jsonAjax(getUrl("order/checkOrderPayMethd"), filterJSONNULL(paramData), function (data, status, xhr) {
                if(data.result){
                    window.location = "../../html/16_dingDanHeDui/payLastPage.html?"+ $.assemblyRequestString(paramData);
                }else{
                    window.location = "../../html/16_dingDanHeDui/quZhiFu.html?"+ $.assemblyRequestString(paramData);
                }

            }, false);

        },
        //再次购买
        againBuy:function(itemId,skuId) {
            var paramData = {
                itemId:itemId,
                skuId:skuId
            };
            window.location = "../../html/13_shangPinXiangQing/shangPinYe.html?"+ $.assemblyRequestString(paramData);
        },
        //切换面板
        changeOrderPanel:function(orderState){
            var temp = this;
            temp.$data.orderState = orderState;
            var paramData = temp.$data.submitInfo = {};
            paramData.state = temp.$data.orderState;
            $.jsonAjax(getUrl("order/queryBuyer"), filterJSONNULL(paramData), function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.$data.pager = data.resultData.pager;
                    temp.$data.orderList = data.resultData.pager.records;
                    temp.$data.jsonArray = data.resultData.jsonArray;
                }
            }, false);
           $(".pullDownLabel").html("");
        },
        //初始化订单列表
        initOrders:function () {
            var temp = this;
            var paramData = temp.submitInfo;
            $.jsonAjax(getUrl("order/queryBuyer"), filterJSONNULL(paramData), function (data, status, xhr) {
                if (data.isSuccess) {
                    console.log(data.resultData.pager);
                    temp.$data.pager = data.resultData.pager;
                    temp.$data.orderList = data.resultData.pager.records;
                    temp.$data.jsonArray = data.resultData.jsonArray;
                }
            }, false);
        },
        //跳转至普通搜索
        toSearch:function() {
            window.location = "../../html/12_maiJiaZhongXin/12_dingDan_sousuo.html";
        },
        //正常订单订单详情  <!-- shipmentType  1立即支付，2延期支付,3分期支付，4定金支付,5新延期支付,-->
        toOrderDetail:function(orderId,passKey,shipmentType) {
            var temp = this;
            var paramData = {
                orderId:orderId,
                passKey:passKey
            };
            window.location = "../../html/12_maiJiaZhongXin/12_dingDan_dingDanXiangQing2.html?shipmentType="+shipmentType+"&"+ $.assemblyRequestString(paramData);
        },
        //取消订单提示
        toCancleOrder:function(order) {
            var temp = this;
            temp.$data.tempOrder = order;
            $("#cancle_order_notice").show();
        },
        //取消订单
        cancleOrder:function() {
            var temp = this;
            var orderId = temp.$data.tempOrder.orderId;
            var paramData = {
                orderId:orderId,
                orderStatus : 6
            };
            $.jsonAjax(getUrl("order/cancelOrder"), filterJSONNULL(paramData), function (data, status, xhr) {
                $('#cancle_order_notice').hide();
                if (data.success) {
                    popUp_auto(2000,'订单取消成功');
                    temp.$data.orderList.removeByValue(temp.$data.tempOrder);
                }else{
                    popUp_auto_false(1000, data.errorMessages);
                }
            }, false);
        },
        //删除订单提示
        toDeleteOrder:function(order) {
            var temp = this;
            temp.$data.tempOrder = order;
            $("#delete_order_notice").show();
        },
        //删除订单
        deleteOrder:function() {
            var temp = this;
            var orderId = temp.$data.tempOrder.orderId;
            var paramData = {
                orderId:orderId
            };
            $.jsonAjax(getUrl("order/deleteOrderById"), filterJSONNULL(paramData), function (data, status, xhr) {
                $('#delete_order_notice').hide();
                if (data.success) {
                    popUp_auto(2000,'订单删除成功');
                    temp.$data.orderList.removeByValue(temp.$data.tempOrder);
                }else{
                    popUp_auto_false(1000, data.errorMessages);
                }
            }, false);
        },
        //确认收货提示
        toConfirmReceipt:function(order) {
            var temp = this;
            temp.$data.tempOrder = order;
            temp.$data.payPassword = "";
            var refund = temp.$data.tempOrder.refund;
            if (refund == 2) {
                printConfirm("您申请的退款/退货正在处理中，点击“确认收货”会关闭卖家未处理或拒绝退款的申请，请确认是否继续？", function () {
                    $("#confirm_receipt_notice").show();
                })
            } else {
                $("#confirm_receipt_notice").show();
            }
        },
        //确认收货
        confirmReceipt:function() {
            var temp = this;
            var orderId = temp.$data.tempOrder.orderId;
            if (orderId == null || $.trim(orderId) == "") {
                popUp_auto_false(1000, "请指定要操作的订单");
                return;
            }
            var paypwd = temp.$data.payPassword;
            if (paypwd == null || $.trim(paypwd) == "") {
                popUp_auto_false(1000, "请输入支付密码");
                return;
            }
            printConfirm("点击确定之后，您的付款将直接到卖家账户里，请务必收到货后再确定", function () {
                var paramData = {
                    orderId:orderId,
                    paypwd : paypwd
                };
                $.jsonAjax(getUrl("order/confirmReceipt"), filterJSONNULL(paramData), function (data, status, xhr) {
                    $('#confirm_receipt_notice').hide();
                    if (data.success) {
                        popUp_auto(1000,'确认收货成功');
                        window.setTimeout(function () {
                            window.location = "../../html/12_maiJiaZhongXin/12_dingDan_woDedingDan.html";
                        }, 2000);
                    }else{
                        popUp_auto_false(1000, data.errorMessages);
                    }
                }, false);
            });
        },
        //延迟收货提示
        toDelayReceipt:function(order) {
            var temp = this;
            temp.$data.tempOrder = order;
            $("#delay_receipt_notice").show();
        },
        //延期收货
        delayReceipt:function() {
            var temp = this;
            var refund = temp.$data.tempOrder.refund;
            if(refund == 2){
                popUp_auto_false(1000, "该订单已延期收货");
                return;
            }
            var orderId = temp.$data.tempOrder.orderId;
            var paramData = {
                orderId:orderId
            };
            $.jsonAjax(getUrl("order/delayDelivery"), filterJSONNULL(paramData), function (data, status, xhr) {
                $('#delay_receipt_notice').hide();
                if (data.success) {
                    popUp_auto(1000,'延期收货成功');
                    window.setTimeout(function () {
                        window.location = "../../html/12_maiJiaZhongXin/12_dingDan_woDedingDan.html";
                    }, 2000);
                }else{
                    popUp_auto_false(1000, data.errorMessages);
                }
            }, false);
        },
        //订单评价
        toOrderEvaluate:function(orderId) {
            var paramData = {
                orderId:orderId
            };
            window.location = "../../html/12_maiJiaZhongXin/12_dingDan_dingDanPingJia.html?"+ $.assemblyRequestString(paramData);
        },
        //字符串截取
        intercept:intercept,
        //跳转店铺首页
        toShop:function(shopId) {
            var paramData = {
                shopId:shopId
            };
            window.location = "../../html/5_dianPuShouYe/dianPu_index.html?"+ $.assemblyRequestString(paramData);
        },
        //查看物流
        checkLogistic:function(orderItemId){
            var temp = this;
            var paramData = {
                orderItemId: orderItemId
            };
            $.jsonAjax(getUrl("delivery/getDeliveryInfo"), filterJSONNULL(paramData), function (data, status, xhr) {
                temp.setDelfiveryInfo(data.deliveryDTO,data.pushDelibery);
            }, false);
        },
        setDelfiveryInfo:function (deliveryDTO,pushDelibery) {
            var temp = this;
            var result = pushDelibery.lastResult;
            if(result == null || result.length <= 0){
                $("#logistics_information_none").show();
                return;
            }
            Vue.set(temp.logisticsScheduleInfo,"deliveryNumber",deliveryDTO.deliveryNumber);
            Vue.set(temp.logisticsScheduleInfo,"deliveryCompanyName",deliveryDTO.deliveryCompanyName);
            Vue.set(temp.logisticsScheduleInfo,"logisticsSchedules",pushDelibery.lastResult.data);
            $("#logistics_information").show();
        },
        closeLogisticsInformationNoneWin:function() {
            $("#logistics_information_none").hide();
        },
        //关闭物流
        closeLogistic:function(){
            $("#logistics_information").hide();
        },
        //卖家还没有维护物流信息弹窗
        logisticsInformationNone2Win:function() {
            $("#logistics_information_none2").show();
        },
        //关闭卖家还没有维护物流信息弹窗
        closeLogisticsInformationNone2Win:function() {
            $("#logistics_information_none2").hide();
        },
        //在次购买
        buyAgain:function(order){
            $.jsonAjax(getUrl("shopCart/buyAgain"),{orderId :order.orderId }, function (data, status, xhr) {
                if(data.success){
                    window.location.href="../../html/14_gouWuChe/gouWuChe.html";
                }else{
                    popUp_auto_false(2500,data.errorMessages);
                }
            }, false);
        },
        //查看部分发货的物流信息
        portionDeliveryShow :function(itemInfo){
            console.log(itemInfo)
            //初始化show
            if(itemInfo){
                if(itemInfo.deliveryDTOs && itemInfo.deliveryDTOs.length > 0){
                    $.each(itemInfo.deliveryDTOs,function(index,item){
                        item.showFlag =false;
                    });
                }
            }
            this.portionDeliveryDialogShow = true;
            //赋值查看信息
            this.itemInfo = itemInfo;
        },
    },
    beforeMount: function () {
        this.submitInfo = $.getUrlJson();

        this.initOrders();//初始化订单列表
    },
    mounted: function () {
        mountJQueryEvent();//初始化页面原有JQuery事件
        this.intercept(".leiXing",18);
        this.intercept(".shangPin",35);
        this.selectedBar();//根据状态选中不同导航条
        initPage();
        //$(".pullUpLabel").hide();
    },
    updated:function () {
        this.intercept(".leiXing",18);
        this.intercept(".shangPin",35);

        myScroll.refresh();

    },
});

function initPage() {
    refresher.init({
        id: "wrapper",
        pullDownAction: Refresh,
        pullUpAction: Load
    });
}
function Refresh() {
    setTimeout(function () {
        myScroll.refresh();
    },1000);
}
function Load() {
    setTimeout(function () {
        var nextPage = buyerOrdersVue.$data.pager.nextPage;
        var thisPage = buyerOrdersVue.$data.pager.page;
        if (nextPage == thisPage) {
            refresher.info.pullUpLable = "已经到底了";
        } else {
            var paramData = buyerOrdersVue.$data.submitInfo;
            paramData.page = nextPage;
            if(buyerOrdersVue.$data.orderState != null && buyerOrdersVue.$data.orderState != ""){
                paramData.state = buyerOrdersVue.$data.orderState;
            }
            $.jsonAjax(getUrl("order/queryBuyer"), paramData, function (data, status, xhr) {
                if (data.isSuccess) {
                    buyerOrdersVue.$data.pager = data.resultData.pager;
                    buyerOrdersVue.$data.orderList = buyerOrdersVue.$data.orderList.concat(data.resultData.pager.records);
                    buyerOrdersVue.$data.jsonArray = buyerOrdersVue.$data.jsonArray.concat(data.resultData.jsonArray);
                }
            }, false);
            nextPage = buyerOrdersVue.$data.pager.nextPage;
            thisPage = buyerOrdersVue.$data.pager.page;
            if (nextPage == thisPage) {
                refresher.info.pullUpLable = "已经到底了";
            }
        }
        myScroll.refresh();
    }, 1000);
};