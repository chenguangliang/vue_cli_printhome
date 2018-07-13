/**
 *  快速下单-订单列表(买家、卖家)
 */
/**********************************************************************************************************************/

var quickOrderVue = new Vue({
    el: "#app",
    data: {
        paper: {},
        submitInfo: {
            centerType: 1, 'page': 1, tabPage: '', startCreateTime: {},endCreateTime: {},
            sellerName: '', sellerPhone: '', premise: '', orderId: '',isConfirm:'',orderStatusArray:''
        },
        orderList: [],
        beginTranY: '',//pullDown的高度也是初始卷去的高度
        userDto:{},
        totalPrice:0,
        payPwd:'',
        buyerReceivedOrderId:'',
        startCreateTime:{},
        endCreateTime:{},
        delOrderId:'',  //存储要删除的订单的Id
        cancelOrderId:'',//存储要取消的订单的Id
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
                    $($event.target).children("img").attr('src','../../img/xiangxia2.png');
                }else {
                    $($event.target).children("img").attr('src','../../img/xiangshang.png');
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
            location.href = './3_quickOrderDetile.html?identity=1&orderId=' + orderId;
        },
        //修改订单
        editOrder: function (orderId) {
            window.location = './15_editOrder_buyer.html?orderId=' + orderId;
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
                        var tabPage = temp.submitInfo.tabPage;
                        temp.changePanle(tabPage);
                    } else {
                        popUp_auto_false(2500, data.msg);
                    }
                }, false);
        },
        cancleOrderNo: function () {
            $(".cancleOrder").hide();
        },
        //去支付
        toPay:function (orderId) {
            var orderIdSub=orderId.substring(0,15);
            $.jsonAjax(getUrl("quickor/master/citicAccount"), {orderId:orderIdSub}, function (data, status, xhr) {
                if (data) {
                    if(data.accountInfoBuyer){//判断买方中信账户
                        if(data.accountInfoSeller){//判断买方中信账户
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
                            //window.location = "../../html/16_dingDanHeDui/quZhiFu.html?"+ $.assemblyRequestString(paramData);
                        }else {
                            printAlert('抱歉，卖方的中信账户正在审核中，请您10分钟之后再付款。');
                        }
                    }else {
                        printAlert('抱歉，您的中信账户正在审核中，请您10分钟之后再付款。');
                    }
                } else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
            /*$.jsonAjax(getUrl("quickor/user/isSellerAccountEffe"), {orderId:orderId}, function (data, status, xhr) {
                if (data) {
                    if(data.effective){
                        var paramData = {
                            orderNo:orderId
                        };
                        window.location = "../../html/16_dingDanHeDui/quZhiFu.html?"+ $.assemblyRequestString(paramData);
                    }else {
                        printAlert('卖家未认证或未审核，请等待卖家审核通过后付款!');
                    }
                } else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);*/
        },
        //再次购买
        buyAgain:function (orderId) {
            var paramData = {
                orderId:orderId
            };
            window.location = './17_buyAgain_buyer.html?orderId=' + orderId;
        },
        //确认收货提示
        toBuyerReceive: function (orderId) {
            if(this.userDto.isHavePayPassword==1){
                $("#confirm_receipt_notice").show();
                this.buyerReceivedOrderId=orderId;
            }else {
                printConfirm('您还未设置支付密码,去设置？', function () {
                    window.location.href='18_anQuanXinXiSheZhi_sheZhiZhiFuMiMa.html'
                })
            }
        },
        //确认收货
        buyerReceive: function () {
            var temp = this;
            if (temp.buyerReceivedOrderId == null || $.trim(temp.buyerReceivedOrderId) == "") {
                popUp_auto_false(1000, "请指定要操作的订单");
                return;
            }
            if (temp.payPwd == null || $.trim(temp.payPwd) == "") {
                popUp_auto_false(1000, "请输入支付密码");
                return;
            }
            $("#confirm_receipt_notice").hide();
            var paramData = {'orderId': temp.buyerReceivedOrderId,'paypwd':temp.payPwd};
                $.jsonAjax(getUrl("/quickor/master/orderBuyerReceive"), paramData, function (data, status, xhr) {
                    if (data.result) {
                        popUp_auto(2500, '确认收货成功');
                        setTimeout(function () {
                              window.location.reload();
                              location.replace(location.href);
                        },1500);
                    } else {
                        popUp_auto_false(2500, data.msg);
                    }
                }, false);
        },
        //买家收到发票
        buyerReceivedInvoice: function (orderId) {
            var paramData = {
                orderId:orderId
            };
            $.jsonAjax(getUrl("/quickor/master/orderBuyerInvoice"), paramData, function (data, status, xhr) {
                if (data.isSuccess) {
                    popUp_auto(2500, '执行成功');
                    window.location.reload();
                } else {
                    popUp_auto_false(2500, data.msg);
                }
            }, false);
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
/*                temp.submitInfo.isConfirm=0;*/
            	tempArray.push(-1);//待确认订单状态搜索条件修改
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
           /* submitInfo: {
            centerType: 1, 'page': 1, tabPage: '', startCreateTime: {},endCreateTime: {},
            sellerName: '', sellerPhone: '', premise: '', orderId: '',isConfirm:'',orderStatusArray:''
            },*/
            this.submitInfo. sellerName='';
            this.submitInfo. orderId='';
            this.submitInfo. sellerPhone='';
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
