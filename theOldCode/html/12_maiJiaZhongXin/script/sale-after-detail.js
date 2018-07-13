/**
 *  买家中心---退款售后详情
 */
/**********************************************************************************************************************/
var saleAfterVue = new Vue({
    el:"#sale_after_detail",
    data:{
        addressBarParams:{},
        resultData:{},
        img_url:img_url,
        returnResult:"",
        remark:"",
        amountNum:"",
        refundMoney:""
    },
    methods:{
        //返回买家中心订单列表
        goBackOrderList:function() {
            window.location = "../../html/12_maiJiaZhongXin/12_dingDan_woDedingDan.html";
        },
        //初始化退款售后详情页
        initSaleAfterDetail:function() {
            var temp = this;
            var paramData = temp.addressBarParams;
            $.jsonAjax(getUrl("order/refundInfoBuyer"), filterJSONNULL(paramData), function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.resultData = data.resultData;
                    temp.returnResult = temp.resultData.tradeReturnDto.returnResult;
                    temp.amountNum = temp.resultData.tradeReturnGoodsDetailList[0].rerurnCount;
                    temp.refundMoney = temp.resultData.tradeReturnDto.refundGoods;
                    temp.remark = temp.resultData.tradeReturnDto.remark;
                }
            }, false);
        }
    },
    beforeMount:function(){
        this.addressBarParams = $.getUrlJson();

        this.initSaleAfterDetail();//初始化退款售后详情页
    },
    mounted: function () {
        mountJQueryEvent();//初始化页面原有JQuery事件
    }
});