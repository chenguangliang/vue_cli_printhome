/**
 *  买家中心---退款/售后列表
 */
/**********************************************************************************************************************/
var listVue = new Vue({
    el: "#sale_after_list",
    data: {
        img_url:img_url,
        addressBarParams:{},
        pager: {},
        saleAfterList:[],
        refundInfoList:[],
        expressNo:"",
        expressName:"",
        tradeReturnDtoId:""
    },
    methods: {
        //初始化退款售后列表
        initSaleAfterList:function () {
            var temp = this;
            var paramData = temp.addressBarParams;
            $.jsonAjax(getUrl("order/cserviceManager"), filterJSONNULL(paramData), function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.$data.pager = data.resultData.pager;
                    temp.$data.saleAfterList = data.resultData.pager.records;
                    temp.$data.refundInfoList = data.resultData.refundInfo;
                }
            }, false);
        },
        //跳转店铺首页
        toShop:function(shopId) {
            var paramData = {
                shopId:shopId
            };
            window.location = "../../html/5_dianPuShouYe/dianPu_index.html?"+ $.assemblyRequestString(paramData);
        },
        //商品详情
        goodsDetail:function(itemId,skuId) {
            var paramData = {
                itemId:itemId,
                skuId:skuId
            };
            window.location = "../../html/13_shangPinXiangQing/shangPinYe.html?"+ $.assemblyRequestString(paramData);
        },
        //查看退款详情
        querySaleAfterDetail:function(returnGoodId,passKey) {
            var paramData = {
                returnGoodId:returnGoodId,
                passKey:passKey
            };
            window.location = "../../html/12_maiJiaZhongXin/12_dingDan_tuiKuanGuanBi.html?"+ $.assemblyRequestString(paramData);
        },
        //修改退款申请
        modifySaleAfterApply:function(returnGoodId,passKey) {
            var paramData = {
                returnGoodId:returnGoodId,
                passKey:passKey
            };
            window.location = "../../html/12_maiJiaZhongXin/12_dingDan_xiuGaiTuiKuan.html?"+ $.assemblyRequestString(paramData);
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
        //确认发货提示框
        confirmDeliverGoods:function (tradeReturnDtoId) {
            var temp = this;
            temp.$data.expressNo = "";//退货快递单号
            temp.$data.expressName = "";//快递公司
            temp.$data.tradeReturnDtoId = tradeReturnDtoId;
            $("#deliver_goods_notice").show();
        },
        //卖家同意退款，买家发货
        deliverGoods:function() {
            var temp = this;
            var returnId = temp.$data.tradeReturnDtoId;
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
        //跳转店铺首页
        toShop:function(shopId) {
            var paramData = {
                shopId:shopId
            };
            window.location = "../../html/5_dianPuShouYe/dianPu_index.html?"+ $.assemblyRequestString(paramData);
        }
    },
    beforeMount: function () {
        this.addressBarParams = $.getUrlJson();//获取地址栏参数
        this.initSaleAfterList();//初始化退款售后列表
    },
    mounted: function () {
        mountJQueryEvent();//初始化页面原有JQuery事件
        initPage();
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
    setTimeout(function () {
        myScroll.refresh();
    },1000);
};
function Load() {
    setTimeout(function () {
        var nextPage = listVue.$data.pager.nextPage;
        var thisPage = listVue.$data.pager.page;
        if (nextPage == thisPage) {
            refresher.info.pullUpLable = "已经到底了";
        } else {
            var paramData = listVue.$data.addressBarParams;
            paramData.page = nextPage;
            $.jsonAjax(getUrl("order/cserviceManager"), paramData, function (data, status, xhr) {
                if (data.isSuccess) {
                    listVue.$data.pager = data.resultData.pager;
                    listVue.$data.saleAfterList = listVue.$data.saleAfterList.concat(data.resultData.pager.records);
                    listVue.$data.refundInfoList = listVue.$data.refundInfoList.concat(data.resultData.refundInfo);
                }
            }, false);
            nextPage = listVue.$data.pager.nextPage;
            thisPage = listVue.$data.pager.page;
            if (nextPage == thisPage) {
                refresher.info.pullUpLable = "已经到底了";
            }
        }
        myScroll.refresh();
    }, 1000);
};