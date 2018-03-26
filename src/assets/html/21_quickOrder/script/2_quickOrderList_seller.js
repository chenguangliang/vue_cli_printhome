/**
 *  快速下单-订单列表(买家、卖家)
 */
/**********************************************************************************************************************/

var quickOrderVue = new Vue({
    el: "#app",
    data: {
        paper: {},
        submitInfo: {
            centerType: 2, 'page': 1, tabPage: '', startCreateTime: {},endCreateTime: {},
            buyerName: '', buyerPhone: '', premise: '', orderId: '',isConfirm:''
        },
        orderList: [],
        beginTranY: '',//pullDown的高度也是初始卷去的高度
        userDto:{},
        totalPrice:0,
        startCreateTime:{},
        endCreateTime:{},
        delOrderId:'',  //存储要删除的订单的Id
        cancelOrderId:'',//存储要取消的订单的Id
        orderSellerReceiveId:'',//存储确认收到货款的订单的Id
        orderSellerDeliveryId:'',//存储确认发货的订单的Id
        personalityDTO:{}//个性化表单数据
    },
    methods: {
        //获取个性化表单
        getPersonalityList: function () {
            var temp = this;
            $.jsonAjax(getUrl("quickor/item/personalityList"), {}, function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.personalityDTO=data.result.personalityDTO;
                } else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
        },
        toggleChildOrder: function ($event) {
            var temp= this;
            if($($event.target).children("img").length){
                if($($event.target).siblings(".childOrders").css("display")=="none"){
                    $($event.target).children("img").css("transform","rotateX(180deg)");
                }else {
                    $($event.target).children("img").css("transform","rotateX(0deg)");
                }
                $($event.target).siblings(".childOrders").slideToggle();
            }
        },
        //状态栏
        selectedBar: function () {
            var checked=$.getUrlJson().checked;
            if(checked){
                if(checked==99){
                    $(".scroll li").removeClass('on').eq(1).addClass('on');
                }else {
                    var sel=parseInt(checked);
                    if(sel<5){
                        $(".scroll li").removeClass('on').eq(sel+1).addClass('on');
                    }
                    if(sel>4){
                        $(".scroll li").removeClass('on').eq(sel).addClass('on');
                        var winW = document.documentElement.clientWidth;
                        per = - 1.21*4*winW / 640 * 100 + "px";
                        setTimeout(function () {
                            $(".scroll_list").css('left',per);
                            $(".scroll_list").attr('goleft','1');
                        },0)
                    }
                }

            }
        },
        //切换面板
        changePanle: function (tabPage) {
            var temp = this;
            temp.submitInfo.tabPage = tabPage;
            temp.submitInfo.page = 1;
            refresher.info.pullUpLable = "上拉加载...";
            var paramData = temp.submitInfo;
            console.log(1);
            console.log(paramData);
            console.log(1);
            $.jsonAjax(getUrl("/quickor/master/orderList"), filterJSONNULL(paramData), function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.$data.pager = data.result.pager;
                    temp.$data.orderList = data.result.orderList;
                    temp.$data.userDto = data.result.userDto;
                } else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
            $("#scroller").css("transform", "translate(0px, -" + this.beginTranY + "px)");
        },
        //初始化订单列表
        initOrderList: function () {
            var urlObj=$.getUrlJson();
            var temp = this;
            temp.submitInfo.tabPage=urlObj.checked;
            var paramData = temp.submitInfo;
            $.jsonAjax(getUrl("/quickor/master/orderList"), paramData, function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.$data.pager = data.result.pager;
                    temp.$data.orderList = data.result.orderList;
                    // temp.$data.orderList = {};
                    temp.$data.userDto = data.result.userDto;
                } else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
        },
        //回到顶部
        goToTop: function () {
            $("#scroller").css("transform", "translate(0px, -" + this.beginTranY + "px)");
            $("#top").hide();
        },
        //查看订单详情
        orderDetile: function (orderId) {
            location.href = './3_quickOrderDetile.html?identity=2&orderId=' + orderId;
        },
        //修改订单
        editOrder: function (orderId) {
            window.location = './16_editOrder_seller.html?orderId=' + orderId;
        },
        //删除订单  temp.delOrderId
        deleteOrder: function (orderId) {
            var temp = this;
            temp.delOrderId=orderId;
            $(".deleteOrder").show()
        },
        deleteOrderYes: function () {
            var temp = this;
            $(".deleteOrder").hide();
            var paramData = {'orderId': temp.delOrderId};
            $.jsonAjax(getUrl("/quickor/master/orderDel"), paramData, function (data, status, xhr) {
                if (data.isSuccess) {
                    popUp_auto(2500, data.msg);
                    window.location.reload();
                } else {
                    popUp_auto_false(2500, data.msg);
                }
            }, false);
        },
        deleteOrderNo: function () {
            $(".deleteOrder").hide();
        },
        //取消订单  temp.cancelOrderId
        cancleOrder: function (orderId) {
            var temp = this;
            temp.cancelOrderId=orderId;
            $(".cancleOrder").show();
        },
        cancleOrderYes: function () {
            var temp = this;
            $(".cancleOrder").hide();
            var paramData = {'orderId': temp.cancelOrderId};
            $.jsonAjax(getUrl("/quickor/master/orderCancle"), paramData, function (data, status, xhr) {
                if (data.isSuccess) {
                    popUp_auto(2500, data.msg);
                    window.location.reload();
                } else {
                    popUp_auto_false(2500, data.msg);
                }
            }, false);
        },
        cancleOrderNo: function () {
            $(".cancleOrder").hide();
        },
        //确认收到货款提示  orderSellerReceiveId
        orderSellerReceive: function (orderId) {
            this.orderSellerReceiveId=orderId;
            $(".orderSellerReceive").show();
        },
        orderSellerReceiveYes: function () {
            var temp=this;
            $(".orderSellerReceive").hide();
            var paramData = {
                orderId:temp.orderSellerReceiveId
            };
                $.jsonAjax(getUrl("/quickor/master/orderSellerReceive"), paramData, function (data, status, xhr) {
                    if (data.isSuccess) {
                        popUp_auto(2500, '确认成功');
                        setTimeout(function () {
                            window.location.reload();
                        },1000);
                    } else {
                        popUp_auto_false(2500, data.msg);
                    }
                }, false);
        },
        orderSellerReceiveNo: function () {
            $(".orderSellerReceive").hide();
        },
        //确认发货  orderSellerDeliveryId
        orderSellerDelivery: function (orderId) {
            this.orderSellerDeliveryId=orderId;
            $(".orderSellerDelivery").show();
        },
        orderSellerDeliveryYes: function () {
            var temp=this;
            var paramData = { orderId:temp.orderSellerDeliveryId};
            $(".orderSellerDelivery").hide();
                $.jsonAjax(getUrl("/quickor/master/orderSellerDelivery"), paramData, function (data, status, xhr) {
                    if (data.isSuccess) {
                        popUp_auto(2500, '确认成功');
                        setTimeout(function () {
                            window.location.reload();
                        },1000);
                    } else {
                        popUp_auto_false(2500, data.msg);
                    }
                }, false);
        },
        orderSellerDeliveryNo: function () {
            $(".orderSellerDelivery").hide();
        },
        //搜索订单
        searchOrder: function () {
            /*
             submitInfo: {centerType: '', tabPage: '', startCreateTime: {},
             buyerName: '', buyerPhone: '', premise: '', orderId: ''}
             */
            var temp = this;
            temp.submitInfo.page = 1;
            //订单状态可以多选
            var orderStatus='';
            var tempArray=[];
            //判断是否是未确认
            if($(".is_confirm").attr('src').indexOf('fang_selBtn')!=-1){
               /* temp.submitInfo.isConfirm=0;*/
            	tempArray.push(-1);//待确认订单状态查询
            }else {
                temp.submitInfo.isConfirm='';
            }
            //判断订单状态
            if($(".order_status").eq(0).attr('src').indexOf('fang_selBtn')!=-1){
                tempArray.push(1);
            }
            if($(".order_status").eq(1).attr('src').indexOf('fang_selBtn')!=-1){
                tempArray.push(2);
            }
            if($(".order_status").eq(2).attr('src').indexOf('fang_selBtn')!=-1){
                tempArray.push(3);
            }
            if($(".order_status").eq(3).attr('src').indexOf('fang_selBtn')!=-1){
                tempArray.push(5);
            }
            if($(".order_status").eq(4).attr('src').indexOf('fang_selBtn')!=-1){
                tempArray.push(6);
            }
            orderStatus=tempArray.join(",");
            temp.submitInfo.orderStatusArray=orderStatus;
            //2017-07-04 转为 2017/07/04
            var getStartTime=$('#startCreateTime').val();
            var getEndTime=$('#endCreateTime').val();
            var time1=new Date(getStartTime);
            var time2=new Date(getEndTime);
            if(time1.getTime()>time2.getTime()){
                popUp_auto_false(1500,'开始时间不能大于结束时间');
                return;
            }
            $(".orderSearch").hide();
            temp.submitInfo.startCreateTime=isNotBlank(getStartTime) ? getStartTime.replace(/-/g,'/') : {};
            temp.submitInfo.endCreateTime=isNotBlank(getEndTime) ? getEndTime.replace(/-/g,'/') : {};

            refresher.info.pullUpLable = "上拉加载...";
            var paramData = temp.submitInfo;
            $.jsonAjax(getUrl("/quickor/master/orderList"), paramData, function (data, status, xhr) {
                if (data) {
                    console.log(data);
                    temp.$data.pager = data.result.pager;
                    temp.$data.orderList = data.result.orderList;
                } else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
            $("#scroller").css("transform", "translate(0px, -" + this.beginTranY + "px)");
        },
        //搜索页面里的重置
        resetForm: function () {
           /* this.submitInfo = {
                centerType: '', 'page': 1, tabPage: '', startCreateTime: {},endCreateTime: {},
                buyerName: '', buyerPhone: '', premise: '', orderId: '',isConfirm:''
            };*/
            $("#searchForm")[0].reset();

            this.submitInfo. buyerName='';
            this.submitInfo. orderId='';
            this.submitInfo. buyerPhone='';
            this.submitInfo. premise='';
            this.submitInfo. orderStatusArray='';
            this.submitInfo. startCreateTime={};
            this.submitInfo. endCreateTime={};
            $(".selBtnWrap img").attr('src','../../img/quickOrder/fang_defaultBtn.png');
            //重置时间
            $("#startCreateTime,#endCreateTime").val('');
        }
    },
    beforeMount: function () {
        //获取个性化表单
        this.getPersonalityList();
        //初始化物资列表
        this.initOrderList();
    },
    mounted: function () {
        mountJQueryEvent();//初始化页面原有JQuery事件
        this.selectedBar();//根据状态选中不同导航条
        // if (this.orderList && this.orderList.length > 0) {
            initPage();
            this.beginTranY = document.getElementById('pullDown').offsetHeight;//必须有！给初始beginTranY赋值
        // }
    },
    updated: function () {
        if(this.orderList && this.orderList.length > 0){
            myScroll.refresh();
        }
        // toggleChildOrder();
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
    }, 1000);
}
function Load() {
    setTimeout(function () {
        var nextPage = quickOrderVue.$data.pager.nextPage;
        var thisPage = quickOrderVue.$data.pager.page;
        if (nextPage == thisPage) {
            refresher.info.pullUpLable = "已经到底了";
        } else {
            var paramData = quickOrderVue.$data.submitInfo;
            paramData.page = nextPage;
            $.jsonAjax(getUrl("/quickor/master/orderList"), paramData, function (data, status, xhr) {
                if (data) {
                    quickOrderVue.$data.pager = data.result.pager;
                    quickOrderVue.$data.orderList = quickOrderVue.$data.orderList.concat(data.result.orderList);
                }
            }, false);
            nextPage = quickOrderVue.$data.pager.nextPage;
            thisPage = quickOrderVue.$data.pager.page;
            if (nextPage == thisPage) {
                refresher.info.pullUpLable = "已经到底了";
            }
        }
        myScroll.refresh();
    }, 1000);
};
//子订单展开
/*
function toggleChildOrder() {
    $(".dianPu").click(function () {
        if ($(this).children("img").length) {
            if ($(this).siblings(".childOrders").css("display") == "none") {
                $(this).children("img").css("transform", "rotateX(180deg)");
            } else {
                $(this).children("img").css("transform", "rotateX(0deg)");
            }
            $(this).siblings(".childOrders").slideToggle();
        }
    });
}*/
