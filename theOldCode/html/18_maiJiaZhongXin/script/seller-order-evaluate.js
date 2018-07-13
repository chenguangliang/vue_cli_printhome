/**
 *  卖家中心---订单评价
 */
/**********************************************************************************************************************/
var orderEvaluate = new Vue({
    el:"#order_evaluate",
    data:{
        addressBarParams:{},
        resultData:{},
        img_url:img_url,
        evaluateContent:""
    },
    methods:{
        //返回卖家中心订单列表
        goBackOrderList:function() {
            window.location = "../../html/18_maiJiaZhongXin/3_dingDan_woDedingDan.html";
        },
        //初始化订单评价页
        initEvaluaditePage:function() {
            var temp = this;
            var paramData = temp.addressBarParams;
            $.jsonAjax(getUrl("sellerEvaluation/initSellerToBuyers"), filterJSONNULL(paramData), function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.resultData = data.resultData;
                }
            }, false);
        },
        //发表评论
        publishEvaluate:function() {
            var temp = this;
            var byShopId = temp.resultData.tradeOrdersDTO.shopId != null ? temp.resultData.tradeOrdersDTO.shopId : "";
            var isAnonymity = "0";
            var src = $("#is_anonymity").attr("src");
            if(src != null && src.indexOf("yes-select.png") != -1){
                isAnonymity = "1";
            }
            var skuScope = 0;
            $("#scope_div img[name='scope_img']").each(function() {
                var src = $(this).attr("src");
                if(src != null && src.indexOf("shoucang_red.png") != -1){
                    skuScope++;
                }
            });
            var paramData = {
                byShopId:byShopId,
                byUserId:temp.resultData.tradeOrdersDTO.buyerId,
                content:temp.evaluateContent,
                isAnonymity:isAnonymity,
                orderId:temp.resultData.tradeOrdersDTO.orderId,
                resource:"2",
                skuScope:skuScope,
                userId:temp.resultData.tradeOrdersDTO.sellerId
            };
            $.jsonAjax(getUrl("sellerEvaluation/submitSellerToBuyers"), filterJSONNULL(paramData), function (data, status, xhr) {
                if (data.messages == "提交成功!") {
                    popUp_auto(1000,'发表成功');
                    window.setTimeout(function () {
                        window.location = "../../html/18_maiJiaZhongXin/3_dingDan_woDedingDan.html";
                    }, 2000);
                }else{
                    popUp_auto_false(1000, data.errorMessages);
                }
            }, false);
        }
    },
    beforeMount:function(){
        this.addressBarParams = $.getUrlJson();

        this.initEvaluaditePage();//初始化订单评价页
    },
    mounted: function () {
        mountJQueryEvent();//初始化页面原有JQuery事件
    }
});