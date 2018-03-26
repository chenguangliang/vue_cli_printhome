/**
 *  快速下单-订单列表(买家、卖家)
 */
/**********************************************************************************************************************/

var quickOrderVue = new Vue({
    el: "#app",
    data: {
        paper: {},
        submitInfo: {page: 1, orderId: '', orderStatusArray: '', startCreateTime: {}, endCreateTime: {}},
        orderList: [],
        beginTranY: '',//pullDown的高度也是初始卷去的高度
        selectedArray: [],
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
        //点击每一个单独的按钮
        oneOrderBtn: function ($event, orderId) {
            var temp = this;
            var target = $event.target;
            if ($(target).attr('src').indexOf('yes') == -1) {
                temp.selectedArray.push(orderId);
                $(target).attr('src', '../../img/yes-select.png');
                if (temp.selectedArray.length == temp.orderList.length) {
                    $(".selAll").attr('src', '../../img/yes-select.png');
                }
            } else {
                for (var i = 0; i < temp.selectedArray.length; i++) {
                    if (temp.selectedArray[i] == orderId) {
                        temp.selectedArray.splice(temp.selectedArray[i], 1);
                    }
                }
                $(target).attr('src', '../../img/no-select.png');
                $(".selAll").attr('src', '../../img/no-select.png');
            }
        },
        //点击全选
        selAll: function ($event) {
            var temp = this;
            var target = $event.target;
            if ($(target).attr('src').indexOf('yes') == -1) {
                $(target).attr('src', '../../img/yes-select.png');
                $(".oneOrderBtn").attr('src', '../../img/yes-select.png');
                for (var i = 0; i < temp.orderList.length; i++) {
                    temp.selectedArray.push(temp.orderList[i].orderId);
                }

            } else {
                $(target).attr('src', '../../img/no-select.png');
                $(".oneOrderBtn").attr('src', '../../img/no-select.png');
                temp.selectedArray = [];
            }
        },
        //初始化订单列表
        initOrderList: function () {
            var temp = this;
            var paramData = temp.submitInfo;
            $.jsonAjax(getUrl("/quickor/bills/createBill"), paramData, function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.$data.pager = data.result.pager;
                    temp.$data.orderList = data.result.pager.records;
                } else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
        },
        creatStatement: function () {
            var temp = this;
            var paramData = {orders:JSON.stringify(temp.selectedArray)};
            if(temp.selectedArray.length==0){
                popUp_auto_false(1500,'请选择需要生成的订单');
                return;
            }
            $.jsonAjax(getUrl("/quickor/bills/insertBills"), paramData, function (data, status, xhr) {
                if (data.isSuccess) {
                    popUp_auto(1500, "对账单创建成功！");
                    window.setTimeout(function () {
                        location.href = './7_statementlist.html';
                    }, 1500);
                } else {
                    popUp_auto_false(2500, '对账单创建失败!');
                }
            }, false);
        },
        //查看订单详情
        orderDetile: function (orderId) {
            location.href = './3_quickOrderDetile.html?identity=1&orderId=' + orderId;
        },
        //回到顶部
        goToTop: function () {
            $("#scroller").css("transform", "translate(0px, -" + this.beginTranY + "px)");
            $("#top").hide();
        },
        //搜索订单
        searchOrder: function () {
            mountJQueryEvent();
            /*
             submitInfo: {centerType: '', tabPage: '', startCreateTime: {},
             buyerName: '', buyerPhone: '', premise: '', orderId: ''}
             */
            var temp = this;
            temp.submitInfo.page = 1;
            //订单状态可以多选
            var orderStatus = '';
            var tempArray = [];
            //判断订单状态
            if ($(".checkBtn").eq(0).attr('src').indexOf('fang_selBtn') != -1) {
                tempArray.push(1);
            }
            if ($(".checkBtn").eq(1).attr('src').indexOf('fang_selBtn') != -1) {
                tempArray.push(2);
            }
            if ($(".checkBtn").eq(2).attr('src').indexOf('fang_selBtn') != -1) {
                tempArray.push(3);
            }
            if ($(".checkBtn").eq(3).attr('src').indexOf('fang_selBtn') != -1) {
                tempArray.push(5);
            }
            orderStatus = tempArray.join(",");
            temp.submitInfo.orderStatusArray = orderStatus;
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
            temp.submitInfo.startCreateTime = isNotBlank(getStartTime) ? getStartTime.replace(/-/g, '/') : {};
            temp.submitInfo.endCreateTime = isNotBlank(getEndTime) ? getEndTime.replace(/-/g, '/') : {};

            refresher.info.pullUpLable = "上拉加载...";
            var paramData = temp.submitInfo;
            $.jsonAjax(getUrl("/quickor/bills/createBill"), paramData, function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.$data.pager = data.result.pager;
                    temp.$data.orderList = data.result.pager.records;
                } else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
            $("#scroller").css("transform", "translate(0px, -" + this.beginTranY + "px)");
        //清空筛选条件
            temp.resetForm();
        },
        //搜索页面里的重置
        resetForm: function () {
            /* submitInfo: {
             centerType: 1, 'page': 1, tabPage: '', startCreateTime: {},endCreateTime: {},
             sellerName: '', sellerPhone: '', premise: '', orderId: '',isConfirm:'',orderStatusArray:''
             },*/
            this.submitInfo.sellerName = '';
            this.submitInfo.orderId = '';
            this.submitInfo.sellerPhone = '';
            this.submitInfo.premise = '';
            this.submitInfo.orderStatusArray = '';
            this.submitInfo.startCreateTime = {};
            this.submitInfo.endCreateTime = {};
            $(".selBtnWrap img").attr('src', '../../img/quickOrder/fang_defaultBtn.png');
            //重置时间
            $("#startCreateTime,#endCreateTime").val('');
        }
    },
    beforeMount: function () {
        //获取个性化表单
        this.getPersonalityList();
        //初始化列表
        this.initOrderList();
    },
    mounted: function () {
        mountJQueryEvent();//初始化页面原有JQuery事件
        initPage();
        this.beginTranY = document.getElementById('pullDown').offsetHeight;//必须有！给初始beginTranY赋值
        // }
    },
    updated: function () {
        if (this.orderList && this.orderList.length > 0) {
            myScroll.refresh();
        }
        mountJQueryEvent();
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
            $.jsonAjax(getUrl("/quickor/bills/createBill"), paramData, function (data, status, xhr) {
                if (data) {
                    quickOrderVue.$data.pager = data.result.pager;
                    quickOrderVue.$data.orderList = quickOrderVue.$data.orderList.concat(data.result.pager.records);
                    $(".selAll").attr('src', '../../img/no-select.png');
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