/**
 *  快速下单-对账单列表
 */
/**********************************************************************************************************************/

var quickOrderVue = new Vue({
    el: "#app",
    data: {
        pager:{},
        submitInfo: {page:1,billsId: '', startCreateTime: {}, endCreateTime: {}},
        orderList: [],
        beginTranY: '',//pullDown的高度也是初始卷去的高度

    },
    methods: {
        //初始化物资列表
        initOrderList: function () {
            var temp = this;
            var paramData = temp.submitInfo;
            $.jsonAjax(getUrl("/quickor/bills"), filterJSONNULL(paramData), function (data, status, xhr) {
                if (data.result) {
                    temp.pager = data.result.pager;
                    temp.orderList = data.result.pager.records;
                } else {
                    popUp_auto_false(2500, data.msg);
                }
            }, false);
        },
        //回到顶部
        goToTop: function () {
            $("#scroller").css("transform", "translate(0px, -" + this.beginTranY + "px)");
            $("#top").hide();
        },
        //搜索对账单
        searchOrder: function () {
            var temp = this;
            /*submitInfo:{page:1,billsId: '', startCreateTime: {}, endCreateTime: {}}*/
            temp.submitInfo.page = 1;
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
            $.jsonAjax(getUrl("/quickor/bills"), paramData, function (data, status, xhr) {
                if (data.result) {
                    temp.pager = data.result.pager;
                    temp.orderList = data.result.pager.records;
                } else {
                    popUp_auto_false(2500, data.msg);
                }
            }, false);
            $("#scroller").css("transform", "translate(0px, -" + this.beginTranY + "px)");
        },
        //查看订单详情
        orderDetile: function (orderId) {
            location.href = './3_quickOrderDetile.html?identity=1&orderId=' + orderId;
        },
        //搜索页面里的重置
        resetForm: function () {
            console.log(1);
            this.submitInfo.page = 1;
            this.submitInfo.billsId ='';
            $("#billsId").val('');
            this.submitInfo.startCreateTime = {};
            this.submitInfo.endCreateTime = {};
            //重置时间
            $("#startCreateTime,#endCreateTime").val('');
        },
    },
    beforeMount: function () {
    },
    mounted: function () {
        mountJQueryEvent();//初始化页面原有JQuery事件
        initPage();
        this.beginTranY = document.getElementById('pullDown').offsetHeight;//必须有！给初始beginTranY赋值
        // }
        this.initOrderList();//初始化订单列表
    },
    updated: function () {
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
            $.jsonAjax(getUrl("/quickor/bills"), paramData, function (data, status, xhr) {
                if (data.result) {
                    quickOrderVue.$data.pager = data.result.pager;
                    quickOrderVue.$data.orderList = quickOrderVue.$data.orderList.concat(data.result.pager.records);
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
