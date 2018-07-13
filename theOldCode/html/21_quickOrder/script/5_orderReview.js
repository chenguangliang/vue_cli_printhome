/**
 *  快速下单-订单审核
 */
/**********************************************************************************************************************/
var quickOrderVue = new Vue({
    el: "#app",
    data: {
        pager:{},
        urlObj:{},// identity=1买家  identity=2卖家
        orderList:[],
        submitInfo:{page:1, startCreateTime:{},endCreateTime:{}, sellerName:'', sellerPhone:'', orderId:'',
                    auditStatus:'', modelType:'', tabStatus:1},
        orderIdTemp:'',//临时记录要拒绝的订单id
        acceptRefuseParam:{orderId:"",confirmStatus:"",confirmRemark:""},//拒绝
        checkParam:{orderId:"",auditStatus:""},//审核通过，审核驳回
        tempAccept:{orderId:"",confirmStatus:""},//接受
        checkOkId:'',
        checkNoId:'',
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
        goAccept: function (orderId) {
            var temp=this;
            temp.tempAccept.orderId=orderId;
            temp.tempAccept.confirmStatus=1;
            $(".acceptOrder").show();
        },
        //接受，拒绝
        closeAccept: function () {
            $(".acceptOrder").hide();
        },
        accept: function () {
            var temp=this;
            $(".acceptOrder").hide();
                $.jsonAjax(getUrl("/quickor/master/orderConfirm"), temp.tempAccept, function (data, status, xhr) {
                    if (data.isSuccess) {
                        popUp_auto(1500,'操作成功');
                        window.setTimeout(function () {
                            window.location.reload();
                        },1500);
                    } else {
                        popUp_auto_false(2500, data.msg);
                    }
                }, false);
        },
        goRefuse:function (orderId) {
            $(".refuseWin").show();
            this.orderIdTemp=orderId;
        },
        refuse: function () {
            var temp=this;
                temp.acceptRefuseParam.orderId=temp.orderIdTemp;
                temp.acceptRefuseParam.confirmStatus=-1;
                $.jsonAjax(getUrl("/quickor/master/orderConfirm"), temp.acceptRefuseParam, function (data, status, xhr) {
                    if (data.isSuccess) {
                        popUp_auto(1500,'操作成功');
                        window.setTimeout(function () {
                            window.location.reload();
                        },1500);
                    } else {
                        popUp_auto_false(2500, data.msg);
                    }
                }, false);
        },
        //审核通过，审核驳回   /quickor/master/orderBuyerAudit
        closeCheckOk: function () {
            $(".checkOk").hide();
        },
        goCheckOk: function (orderId) {
            $(".checkOk").show();
            this.checkOkId=orderId;
        },
        checkOk: function () {
            var temp=this;
            $(".checkOk").hide();
                $.jsonAjax(getUrl("/quickor/master/orderAudit"), {orderId:temp.checkOkId,auditStatus:1}, function (data, status, xhr) {
                    if (data.isSuccess) {
                        popUp_auto(1500,'操作成功');
                        window.setTimeout(function () {
                            window.location.reload();
                        },1500);
                    } else {
                        popUp_auto_false(2500, data.msg);
                    }
                }, false);
        },
        closeCheckNo: function () {
            $(".checkNo").hide();
        },
        goCheckNo: function (orderId) {
            $(".checkNo").show();
            this.checkNoId=orderId;
        },
        checkNo: function () {
            var temp=this;
            $(".checkNo").hide();
            $.jsonAjax(getUrl("/quickor/master/orderAudit"), {orderId:temp.checkNoId,auditStatus:-1}, function (data, status, xhr) {
                    if (data.isSuccess) {
                        popUp_auto(1500,'操作成功');
                        window.setTimeout(function () {
                            window.location.reload();
                        },1500);
                    } else {
                        popUp_auto_false(2500, data.msg);
                    }
                }, false);
        },
        //查看订单详情
        orderDetile: function (orderId) {
            location.href = './3_quickOrderDetile.html?identity=1&orderId=' + orderId;
        },
        //初始化订单列表
        initOrderList: function () {
            var temp = this;
            var paramData = temp.submitInfo;
            $.jsonAjax(getUrl("/quickor/master/orderCheckList"), filterJSONNULL(paramData), function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.pager = data.result.pager;
                    temp.orderList = data.result.pager.records;
                } else {
                    popUp_auto_false(2500, data.msg);
                }
            }, false);
        },
        //切换面板
        changePanle: function (tabPage,auditStatus) {
            var temp = this;
            temp.submitInfo.tabStatus = tabPage;
            temp.submitInfo.auditStatus = auditStatus;
            temp.submitInfo.page = 1;
            if(tabPage!=3){
                temp.submitInfo.auditStatus = '';//如果点击前两个，把auditStatus置空，防止从tab3点到tab1带值
            }
             refresher.info.pullUpLable = "上拉加载...";
            var paramData = temp.submitInfo;
            $.jsonAjax(getUrl("/quickor/master/orderCheckList"), paramData, function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.pager = data.result.pager;
                    temp.orderList = data.result.pager.records;
                } else {
                    popUp_auto_false(2500, data.msg);
                }
            }, false);
            // $("#scroller").css("transform", "translate(0px, -" + this.beginTranY + "px)");
        },
        //点击tab3下边的三个子按钮
        changeAuditStatus: function (auditStatus) {
            this.changePanle(3,auditStatus);
        },
        //回到顶部
        goToTop: function () {
            $("#scroller").css("transform", "translate(0px, -" + this.beginTranY + "px)");
            $("#top").hide();
        },
        //搜索订单
        searchOrder: function () {
            var temp = this;
            /*temp.submitInfo={page:1, startCreateTime:'', sellerName:'', sellerPhone:'', orderId:'',
                auditStatus:'', modelType:'', tabStatus:1
            },*/
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
            temp.submitInfo.startCreateTime=isNotBlank(getStartTime) ? getStartTime.replace(/-/g,'/') : {};
            temp.submitInfo.endCreateTime=isNotBlank(getEndTime) ? getEndTime.replace(/-/g,'/') : {};

            refresher.info.pullUpLable = "上拉加载...";
            var paramData = temp.submitInfo;
            $.jsonAjax(getUrl("/quickor/master/orderCheckList"), paramData, function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.pager = data.result.pager;
                    temp.orderList = data.result.pager.records;
                } else {
                    popUp_auto_false(2500, data.msg);
                }
            }, false);
            $("#scroller").css("transform", "translate(0px, -" + this.beginTranY + "px)");
        },
        //搜索页面里的重置
        resetForm: function () {
            $("#searchForm")[0].reset();
            this.submitInfo. sellerName='';
            this.submitInfo. orderId='';
            this.submitInfo. ordersellerPhoneId='';
            this.submitInfo. startCreateTime={};
            this.submitInfo. endCreateTime={};
            //重置时间
            $("#startCreateTime,#endCreateTime").val('');
        },

    },
    beforeMount: function () {
        var temp=this;
        temp.urlObj= $.getUrlJson();
        temp.submitInfo.modelType=temp.urlObj.identity;
        //获取个性化表单
        this.getPersonalityList();
    },
    mounted: function () {
        mountJQueryEvent();//初始化页面原有JQuery事件
        initPage();
        this.beginTranY = document.getElementById('pullDown').offsetHeight;//必须有！给初始beginTranY赋值
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
            $.jsonAjax(getUrl("/quickor/master/orderCheckList"), paramData, function (data, status, xhr) {
                if (data) {
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
