/**
 *  买家中心---查看售后进度
 */
/**********************************************************************************************************************/
var progressVue = new Vue({
    el:"#sale_after_progress",
    data:{
        addressBarParams:{},
        progressInfo:{},
        expressNo:"",
        expressName:""
    },
    methods:{
        //跳转订单列表
        toOrderList:function() {
            window.location = "../../html/12_maiJiaZhongXin/12_dingDan_woDedingDan.html";
        },
        //初始化查看售后进度页
        initProgressPage:function() {
            var temp = this;
            var paramData = temp.addressBarParams;
            $.jsonAjax(getUrl("order/refundSubmitSucc"), filterJSONNULL(paramData), function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.$data.progressInfo = data.resultData;
                }
            }, false);
        },
        //买家确认收款
        receivables:function(returnId, orderId, state) {
            if(parseInt(state) != 7){
                return;
            }
            var temp = this;
            var paramData = {
                returnId: returnId,
                orderId: orderId,
                type:4
            };
            $.jsonAjax(getUrl("order/updateTradeReturn"), filterJSONNULL(paramData), function (data, status, xhr) {
                if(data.errorMessages == null || data.errorMessages.length <= 0){
                    popUp_auto(2000,'确认收款成功');
                    window.setTimeout(function () {
                        window.location = "../../html/12_maiJiaZhongXin/12_dingDan_woDedingDan.html";
                    }, 2000);
                }
            }, false);
        },
        //卖家同意退款，买家发货
        deliverGoods:function(returnId) {
            var temp = this;
            var expressNo = temp.$data.expressNo;//退货快递单号
            if(expressNo == null || $.trim(expressNo)==""){
                popUp_auto_false(1000, "请填写快递单号");
                return;
            }
            var expressName = temp.$data.expressName;//快递公司
            var paramData = {
                returnId: returnId,
                expressNo: expressNo,
                expressName:expressName
            };
            $.jsonAjax(getUrl("order/deliverGoods"), filterJSONNULL(paramData), function (data, status, xhr) {
                if (data.success) {
                    popUp_auto(2000,'确认发货成功');
                    window.setTimeout(function () {
                        window.location = "../../html/12_maiJiaZhongXin/12_dingDan_woDedingDan.html";
                    }, 2000);
                }
            }, false);
        },
        //修改退款申请
        modifySaleAfterApply:function(returnGoodId,passKey) {
            var paramData = {
                returnGoodId:returnGoodId,
                passKey:passKey
            };
            window.location = "../../html/12_maiJiaZhongXin/12_dingDan_xiuGaiTuiKuan.html?"+ $.assemblyRequestString(paramData);
        },
        //查看退款详情
        querySaleAfterDetail:function(returnGoodId,passKey) {
            var paramData = {
                returnGoodId:returnGoodId,
                passKey:passKey
            };
            window.location = "../../html/12_maiJiaZhongXin/12_dingDan_tuiKuanGuanBi.html?"+ $.assemblyRequestString(paramData);
        }
    },
    beforeMount:function(){
        this.addressBarParams = $.getUrlJson();

        this.initProgressPage();//初始化查看售后进度页
    },
    mounted: function () {
        //mountJQueryEvent();//初始化页面原有JQuery事件
    }
});