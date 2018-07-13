/**
 *  买家中心---订单审核
 */
/**********************************************************************************************************************/
var nowApproveStatus = "1";
$(function(){
    var urlAS = $.getUrlParam("approveStatus")
    if(urlAS){
        nowApproveStatus = urlAS;
    }
    orderReviewVue.changeOrderPanel(nowApproveStatus);
})
var orderReviewVue = new Vue({
    el: "#order_review_list",
    data: {
        addressBarParams:{},
        img_url:img_url,
        pager: {},
        orderList:[],
        jsonArray:[],
        rejectReason:"",
        approveStatus:"",
        tempOrder:{},
        tempRejectReason:""
    },
    methods: {
        //切换面板
        changeOrderPanel:function(approveStatus){
            nowApproveStatus = approveStatus;
            var temp = this;
            temp.$data.approveStatus = approveStatus;
            var paramData = temp.$data.addressBarParams = {};
            if(approveStatus != null && approveStatus == '0'){
                paramData.approveStatus = temp.$data.approveStatus;
            }
            this.changeLab(approveStatus);
            $.jsonAjax(getUrl("order/queryBuyer?approve=loadApprove"), filterJSONNULL(paramData), function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.$data.pager = data.resultData.pager;
                    temp.$data.orderList = data.resultData.pager.records;
                    temp.$data.jsonArray = data.resultData.jsonArray;
                }
            }, false);
        },
        //初始化订单列表
        initOrders:function () {
            var temp = this;
            var paramData = temp.addressBarParams;
            this.changeLab(paramData.approveStatus);
            $.jsonAjax(getUrl("order/queryBuyer?approve=loadApprove"), filterJSONNULL(paramData), function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.$data.pager = data.resultData.pager;
                    temp.$data.orderList = data.resultData.pager.records;
                    temp.$data.jsonArray = data.resultData.jsonArray;
                }
            }, false);
        },
        changeLab:function (labNum) {
          if(labNum=="1"){
              $("#lab1").attr("class","on");
              $("#lab0").attr("class","");
          }else{
              $("#lab0").attr("class","on");
              $("#lab1").attr("class","");
          }
        },
        //查看驳回原因
        queryRejectReason:function(e) {
            var temp = this;
            var rejectReason = $(e.target).attr("rejectReason");
            temp.rejectReason = rejectReason;
            $("#reject_reason_div").show();
        },
        //订单审核通过
        approveSubmit:function(orderId,status,parentId) {
            var temp = this;
            printConfirm("您确定要审核通过吗？", function () {
                var paramData = {
                    orderId:orderId,
                    status:status,
                    parentId:parentId
                };
                $.jsonAjax(getUrl("order/approveSubmit"), filterJSONNULL(paramData), function (data, status, xhr) {
                    if (data.success) {
                        popUp_auto(1000,'审核成功');
                        window.setTimeout(function () {
                            window.location = "../../html/12_maiJiaZhongXin/12_dingDan_dingDanShenHe.html?approveStatus="+nowApproveStatus;
                        }, 2000);
                    }else{
                        popUp_auto_false(1000, "审核失败");
                    }
                }, false);
            });
        },
        //审核驳回提示
        approveRejectNotice:function(order) {
            var temp = this;
            temp.$data.tempOrder = order;
            $("#approve_reject_notice").show();
        },
        //审核驳回
        approveReject:function() {
            var temp = this;
            var tempRejectReason = temp.tempRejectReason;
            if(tempRejectReason == null || tempRejectReason == ''){
                popUp_auto_false(1000, "请先填写驳回原因！");
                return;
            }
            var paramData = {
                orderId:temp.tempOrder.orderId,
                status:2,
                reason:tempRejectReason
            };
            $.jsonAjax(getUrl("order/approveReject"), filterJSONNULL(paramData), function (data, status, xhr) {
                if (data.success) {
                    popUp_auto(1000,'已驳回');
                    window.setTimeout(function () {
                        window.location = "../../html/12_maiJiaZhongXin/12_dingDan_dingDanShenHe.html?approveStatus="+nowApproveStatus;
                    }, 2000);
                }else{
                    popUp_auto_false(1000, "驳回失败");
                }
            }, false);
        }
    },
    beforeMount: function () {
        this.addressBarParams = $.getUrlJson();
        // this.initOrders();//初始化订单列表
        // this.changeOrderPanel('1');
    },
    mounted: function () {
        mountJQueryEvent();//初始化页面原有JQuery事件
        initPage();
        $(".pullUpLabel").hide();
    },
    updated:function () {
        myScroll.refresh();
    }
});

function initPage() {
    refresher.init({
        id: "wrapper",
        pullDownAction: Refresh,
        pullUpAction: Load
    });
};
function Refresh() {
    myScroll.refresh();
};
function Load() {
    setTimeout(function () {
        var nextPage = orderReviewVue.$data.pager.nextPage;
        var thisPage = orderReviewVue.$data.pager.page;
        if (nextPage == thisPage) {
            refresher.info.pullUpLable = "已经到底了";
        } else {
            var paramData = orderReviewVue.$data.addressBarParams;
            paramData.page = nextPage;
            paramData.approveStatus = orderReviewVue.$data.approveStatus;
            $.jsonAjax(getUrl("order/queryBuyer?approve=loadApprove"), paramData, function (data, status, xhr) {
                if (data.isSuccess) {
                    orderReviewVue.$data.pager = data.resultData.pager;
                    orderReviewVue.$data.orderList = orderReviewVue.$data.orderList.concat(data.resultData.pager.records);
                    orderReviewVue.$data.jsonArray = orderReviewVue.$data.jsonArray.concat(data.resultData.jsonArray);
                }
            }, false);
            nextPage = orderReviewVue.$data.pager.nextPage;
            thisPage = orderReviewVue.$data.pager.page;
            if (nextPage == thisPage) {
                refresher.info.pullUpLable = "已经到底了";
            }
        }
        myScroll.refresh();
    }, 100);
};