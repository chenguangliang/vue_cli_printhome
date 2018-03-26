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
    data: {
        selBtnIndex:13,
        periodName:['首','二','三','四','五','六','七','八','九','十','十一','尾'],
        periodItemList:[],
        img_url:img_url,
        submitInfo:{
            page:'',     //	分页信息	非必传
            isAllPay:'', //	是否全部付清	非必传	1全付清 0未付清
            orderId:'',  //		订单号	非必传
            createStart:'',//		下单开始时间	非必传
            createEnd:'', //	下单结束时间	非必传
            yq_state:'',  //	订单状态	非必传
            currentPeriodStartTime:'',//	本次付款开始时间	非必传
            currentPeriodEndTime:''
        },
        pager: {},
        orderList:[],
        jsonArray:[],
        allOrderCount:'',
        paidCount:"",
        unPaidCount:{},
        beginTranY: '',//pullDown的高度也是初始卷去的高度
        toPayParam:'',//临时储存去支付需要带的参数（为了逾期提示框）
    },
    methods: {
        //去支付-分期订单(除了必付的首期)
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
        closeWin: function () {
            $("#crossPay").hide();
            this.selBtnIndex=13;
        },
        //选择要付款的期数
        selPeriod: function (index) {
            this.selBtnIndex=index;
        },
        //跨期支付
        crossPay: function (orderId) {
            $("#crossPay").show();
            var temp=this;
            $.jsonAjax(getUrl("periodorder/periodInfo"), {"orderId":orderId}, function (data, status, xhr) {
            if (data.isSuccess) {
                temp.periodItemList=data.apInfo.orderAccountPeriodItemDTOs;
                }else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
        },
        //搜索订单弹窗里的箭头
        cancelSearch: function () {
            $(".searchWin").hide();
            this.resetForm();
        },
        //搜索订单
        searchOrder: function () {
            /*
             page:'',     //	分页信息	非必传
             isAllPay:'', //	是否全部付清	非必传	1全付清 0未付清
             orderId:'',  //		订单号	非必传
             createStart:'',//		下单开始时间	非必传
             createEnd:'', //	下单结束时间	非必传
             yq_state:'',  //	订单状态	非必传
             currentPeriodStartTime:'',//	本次付款开始时间	非必传
             currentPeriodEndTime:''
             */
            $(".searchWin").hide();
            popUp_open();
            var temp = this;
            temp.submitInfo.page = 1;
            //2017-07-04 转为 2017/07/04
            var getStartTime=$('#startCreateTime').val();
            var getEndTime=$('#endCreateTime').val();
            var currentPeriodStartTime=$('#currentPeriodStartTime').val();
            var currentPeriodEndTime=$('#currentPeriodEndTime').val();
            var time1=new Date(getStartTime);
            var time2=new Date(getEndTime);
            var time3=new Date(currentPeriodStartTime);
            var time4=new Date(currentPeriodEndTime);
            if(time1.getTime()>time2.getTime() || time3.getTime()>time4.getTime()){
                popUp_auto_false(1500,'开始时间不能大于结束时间');
                return;
            }
            temp.submitInfo.createStart=isNotBlank(getStartTime) ? getStartTime.replace(/-/g,'/') : {};
            temp.submitInfo.createEnd=isNotBlank(getEndTime) ? getEndTime.replace(/-/g,'/') : {};
            temp.submitInfo.currentPeriodStartTime=isNotBlank(currentPeriodStartTime) ? currentPeriodStartTime.replace(/-/g,'/') : {};
            temp.submitInfo.currentPeriodEndTime=isNotBlank(currentPeriodEndTime) ? currentPeriodEndTime.replace(/-/g,'/') : {};

            refresher.info.pullUpLable = "上拉加载...";
            var paramData = temp.submitInfo;
            $.jsonAjax(getUrl("periodorder/periodOrdersForBuyer"), filterJSONNULL(paramData), function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.$data.pager = data.dataMap.pager;
                    temp.$data.orderList = data.dataMap.pager.records;
                    temp.$data.jsonArray = data.dataMap.jsonArray;
                    popUp_close();
                }else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
            $("#scroller").css("transform", "translate(0px, -" + this.beginTranY + "px)");
        },
        //搜索页面里的重置
        resetForm: function () {
            this.submitInfo.orderId='';
            this.submitInfo.yq_state='';
            this.submitInfo.createStart={};
            this.submitInfo.createEnd={};
            this.submitInfo.currentPeriodStartTime={};
            this.submitInfo.currentPeriodEndTime={};
            $("#yq_state").val('');
            $("#orderId").val('');
            //重置时间
            $("#startCreateTime,#endCreateTime,#currentPeriodStartTime,#currentPeriodEndTime").val('');
        },
        toSearch: function () {
            $(".searchWin").show();
        },
        //去支付
        toPay:function (orderId) {
            var paramData = {
                orderNo:orderId
            };
            window.location = "../../html/16_dingDanHeDui/quZhiFu.html?"+ $.assemblyRequestString(paramData);
        },
        //切换面板
        changeOrderPanel:function(tab){
            popUp_open();
            if(tab==2){
                this.submitInfo.isAllPay='';
            }else if(tab==0){
                this.submitInfo.isAllPay=0;
            }else if(tab==1){
                this.submitInfo.isAllPay=1;
            }
            var temp = this;
            temp.submitInfo.page=1;
            var paramData = temp.submitInfo;
            $.jsonAjax(getUrl("periodorder/periodOrdersForBuyer"), paramData, function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.$data.pager = data.dataMap.pager;
                    temp.$data.orderList = data.dataMap.pager.records;
                    temp.$data.jsonArray = data.dataMap.jsonArray;
                    popUp_close();
                }else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
            $("#scroller").css("transform", "translate(0px, -" + this.beginTranY + "px)");
        },
        //初始化订单列表
        initOrders:function () {
            popUp_open();
            var temp = this;
            var paramData = temp.submitInfo;
            $.jsonAjax(getUrl("periodorder/periodOrdersForBuyer"), filterJSONNULL(paramData), function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.$data.pager = data.dataMap.pager;
                    temp.$data.orderList = data.dataMap.pager.records;
                    temp.$data.jsonArray = data.dataMap.jsonArray;
                    popUp_close();
                }else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
        },
        //订单详情
        toOrderDetail:function(orderId,passKey) {
            var temp = this;
            var paramData = {
                orderId:orderId,
                passKey:passKey,
                orderType:'periodOrder'
            };
            window.location = "../../html/12_maiJiaZhongXin/12_dingDan_dingDanXiangQing2.html?"+ $.assemblyRequestString(paramData);
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

    },
    beforeMount: function () {
        this.submitInfo.isAllPay = $.getUrlJson().tab;
        this.initOrders();//初始化订单列表
    },
    mounted: function () {
        mountJQueryEvent();//初始化页面原有JQuery事件
        this.intercept(".leiXing",18);
        this.intercept(".shangPin",35);
        initPage();
        this.beginTranY = document.getElementById('pullDown').offsetHeight;//必须有！给初始beginTranY赋值
        //$(".pullUpLabel").hide();
    },
    updated:function () {
        this.intercept(".leiXing",18);
        this.intercept(".shangPin",35);
        myScroll.refresh();

    }
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
            $.jsonAjax(getUrl("periodorder/periodOrdersForBuyer"), paramData, function (data, status, xhr) {
                if (data.isSuccess) {
                    buyerOrdersVue.$data.pager = data.dataMap.pager;
                    buyerOrdersVue.$data.orderList = buyerOrdersVue.$data.orderList.concat(data.dataMap.pager.records);
                    buyerOrdersVue.$data.jsonArray = buyerOrdersVue.$data.jsonArray.concat(data.dataMap.jsonArray);
                }else {
                    popUp_auto_false(2500, '网络错误');
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