/**
 *  卖家中心---订单详情
 */
/**********************************************************************************************************************/
var orderDetail = new Vue({
    el:"#order_detail",
    data:{
        submitInfo:{},
        orderInfo:{},
        img_url:img_url,
        tempOrder:{},
        payPassword:"",
        pay_name:"",
        pay_type:"0",
        pay_date:"",
        logisticsInfo:{},
        deliveryNumber:"",
        deliveryCompanyCode:"",
        deliveryRemark:"",
        isSametemplate:"",
        changePriceInfo:{},
        picUrl:"",
        logisticsScheduleInfo:{},
        periodItemList:[],//分期详情
        orderType:'',//标识订单类型
    },
    methods:{
        //点击顶部分期信息 请求分期信息
        getPeriodInfo: function (orderId) {
            var temp=this;
            $.jsonAjax(getUrl("periodorder/periodInfo"), {"orderId":orderId}, function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.periodItemList=data.apInfo.orderAccountPeriodItemDTOs;
                }else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
        },
        //点击放大图片
        showIMG:function(param1,param2){
            this.picUrl = param2;
            if('businessLicensePicUrl'==param1){
                $('#enlargeImg').css("display", "block");
                $('#enlargeImg').children('.enlargeImg_content').css({width:'5rem',height:'8.08rem',marginTop: '-4.04rem',marginLeft: '-2.5rem'});
                $('#enlargeImg').children().children('img').css({width:'5rem',height:'7.08rem'});
            }
            else{
                $('#enlargeImg').css("display", "block");
                $('#enlargeImg').children('.enlargeImg_content').css({width:'5rem',height:'4.46rem',marginTop: '-2.23rem',marginLeft: '-2.5rem'});
                $('#enlargeImg').children().children('img').css({width:'5rem',height:'3.48rem'});
            }
        },
        //点击关闭图片
        closeIMG:function(){
            $('#enlargeImg').css("display", "none");
        },
        //订单评价
        toOrderEvaluate:function(orderId) {
            var paramData = {
                orderId:orderId
            };
            window.location = "../../html/18_maiJiaZhongXin/3_dingDan_dingDanPingJia.html?"+ $.assemblyRequestString(paramData);
        },
        //关闭确认发货提示
        closeDeliverNotice:function() {
            $("#confirm_deliver_notice").hide();
            unClockedBody();
        },
        //确认发货提示
        toConfirmDeliver:function(order) {
            var temp = this;
            temp.$data.tempOrder = order;
            $("#confirm_deliver_notice").show();
            clockedBody();
        },
        //确认发货
        confirmDeliver:function() {
            var temp = this;
            var orderId = temp.$data.tempOrder.orderId;
            var paramData = {
                orderId: orderId,
                state: 3
            };
            $.jsonAjax(getUrl("order/deliverOrder"), filterJSONNULL(paramData), function (data, status, xhr) {
                $('.zhezhao').hide();
                if (data.success) {
                    popUp_auto(1000,'确认发货成功');
                    window.setTimeout(function () {
                        window.location = "../../html/18_maiJiaZhongXin/3_dingDan_woDedingDan.html";
                    }, 2000);
                }else{
                    popUp_auto_false(1000, data.errorMessages);
                }
            }, false);
        },
        //选择付款方式
        choosePayMethod:function(e) {
            var temp = this;
            temp.$data.pay_date = "";
            var pay_name = $(e.target).attr("payName");
            temp.$data.pay_name = pay_name;
            if (pay_name == "银行承兑汇票") {
                temp.$data.pay_type = "1";
            } else if (pay_name == "银行支票") {
                temp.$data.pay_type = "1";
            } else if (pay_name == "商业承兑汇票") {
                temp.$data.pay_type = "1";
            } else if (pay_name == "其他") {
                temp.$data.pay_type = "2";
            }else{
                temp.$data.pay_type = "0";
            }
        },
        //关闭确认收到货款窗口
        closeReceivePay:function() {
            $("#receive_pay_method").hide();
            unClockedBody();
        },
        //确认收到货款方式
        toReceivePay:function(order) {
            var temp = this;
            temp.$data.tempOrder = order;
            $("#receive_pay_method").show();
            clockedBody();
        },
        //确认收到货款
        receivePay:function() {
            var isCheck = false;
            $("#receive_pay_method img[name='payMethod']").each(function() {
                var src = $(this).attr("src");
                if(src != null && src.indexOf("yes-select.png") != -1){
                    isCheck = true;
                    return false;
                }
            });
            if(!isCheck){
                popUp_auto_false(1000, "请选择收款方式");
                return;
            }

            var temp = this;
            var orderId = temp.$data.tempOrder.orderId;
            var pay_name = temp.$data.pay_name;
            var pay_type = temp.$data.pay_type;
            var pay_date = temp.$data.pay_date;
            if(pay_type == 1 || pay_type == 2){
                if(pay_date == null || pay_date == ''){
                    popUp_auto_false(1000, "请填写到账时间/说明理由");
                    return;
                }
            }
            var paramData = {
                type: pay_type,
                name: pay_name,
                date: pay_date,
                orderid:orderId
            };
            $.jsonAjax(getUrl("order/paytype"), filterJSONNULL(paramData), function (data, status, xhr) {
                $('.zhezhao').hide();
                if (data == "200") {
                    var paramJson = {
                        orderId: orderId,
                        paymentType: 3
                    };
                    $.jsonAjax(getUrl("order/modifyOrderPayStatus"), filterJSONNULL(paramJson), function (data, status, xhr) {
                        if (data.success) {
                            popUp_auto(1000,'确认收到货款成功');
                            window.setTimeout(function () {
                                window.location = "../../html/18_maiJiaZhongXin/3_dingDan_woDedingDan.html";
                            }, 2000);
                        }else{
                            popUp_auto_false(1000, data.errorMessages);
                        }
                    }, false);
                }else{
                    popUp_auto_false(1000, data.errorMessages);
                }
            }, false);
        },
        //订单详情
        initOrderDetail:function() {
            var temp = this;
            var paramData = temp.submitInfo;
            $.jsonAjax(getUrl("order/queryOrderInfoSeller"), filterJSONNULL(paramData), function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.$data.orderInfo = data.resultData;
                }
            }, false);
        },
        //跳转订单列表
        toOrderList:function() {
            window.location = "../../html/18_maiJiaZhongXin/3_dingDan_woDedingDan.html";
        },
        //跳转店铺首页
        toShop:function(shopId) {
            var paramData = {
                shopId:shopId
            };
            window.location = "../../html/5_dianPuShouYe/dianPu_index.html?"+ $.assemblyRequestString(paramData);
        },
        //商品详情
        goodsDetail:function(itemId,skuId,item) {
            var paramData = {
                itemId:itemId,
                skuId:skuId
            };
            if(item){ //套餐也用了这个方法，但是套餐内的商品不用判断因为都是普通商品
                if(item.itemBuyType==2 || item.itemBuyType==3){//橡皮布和板材不能带着skuId过去，因为带着skuId过去就不显示价格了
                    paramData.skuId="";
                }
            }
            window.location = "../../html/13_shangPinXiangQing/shangPinYe.html?"+ $.assemblyRequestString(paramData);
        },
        //显示订单改价div
        showOrderChangePriceDiv:function(orderId, itemId, skuId, payPriceTotal, promotionDiscount, sumDiscount, freight,primitivePrice,integralDiscount) {
            var temp = this;
            var changePriceInfo = {};
            if (integralDiscount == 0) { // 商品未使用积分抵扣
                $("#integralDiscountText").parent().hide();
            } else {
                $("#integralDiscountText").parent().show();
                changePriceInfo.integralDiscountText = integralDiscount;
            }
            changePriceInfo.changePrice_orderId = orderId;
            changePriceInfo.changePrice_itemId = itemId;
            changePriceInfo.changePrice_skuId = skuId;
            changePriceInfo.pay_price_total = primitivePrice;// 是否应该是原价
            changePriceInfo.primitivePrice = primitivePrice;
            var changePrice_old = new Number(primitivePrice-sumDiscount-integralDiscount).toFixed(2);
            changePriceInfo.changedPrice = new Number(payPriceTotal).toFixed(2);
            changePriceInfo.original_pay_price = changePrice_old;
            changePriceInfo.integralDiscount = integralDiscount;
            changePriceInfo.promotionDiscount = new Number(primitivePrice-payPriceTotal-integralDiscount).toFixed(2);
            changePriceInfo.promotionDiscount_old = promotionDiscount;
            changePriceInfo.freight = freight;
            temp.changePriceInfo = changePriceInfo;
            $("#order_change_price_div").show();
            clockedBody();
        },
        //关闭订单改价div
        closeOrderChangePriceDiv:function() {
            $("#order_change_price_div").hide();
            unClockedBody();
        },
        //订单改价
        changeOrderPrice:function() {
            var temp = this;
            var orderId = temp.changePriceInfo.changePrice_orderId;
            var pay_price_total = temp.changePriceInfo.pay_price_total;//商品金额改价
            var changedPrice = temp.changePriceInfo.changedPrice;//商品改价后金额
            var promotionDiscount = temp.changePriceInfo.promotionDiscount;//优惠金额改价
            var itemId = temp.changePriceInfo.changePrice_itemId;
            var skuId = temp.changePriceInfo.changePrice_skuId;
            var primitivePrice = temp.changePriceInfo.primitivePrice;
            if(parseFloat(primitivePrice) < parseFloat(promotionDiscount)){
                popUp_auto_false(1000, "优惠金额不能大于商品金额");
                return;
            }
            var oldPrice = temp.changePriceInfo.original_pay_price;
            var newPrice = temp.changePriceInfo.changedPrice;
            var integralDiscount = temp.changePriceInfo.integralDiscount;
            /*if(parseFloat(oldPrice) < parseFloat(newPrice)){
                popUp_auto_false(1000, "改价金额不允许大于原价!");
                return;
            }*/
            var paramData = {
                orderId: orderId,
                itemId: itemId,
                skuId: skuId,
                changedPrice:changedPrice,
                payPriceTotal: pay_price_total,
                promotionDiscount: temp.changePriceInfo.promotionDiscount_old,
                oldPrice:oldPrice
            };
            $.jsonAjax(getUrl("order/modifyOrderPrice"), filterJSONNULL(paramData), function (data, status, xhr) {
                if (data.success) {
                    popUp_auto(1000,'商品改价成功');
                    window.setTimeout(function () {
                        window.location = "../../html/18_maiJiaZhongXin/3_dingDan_woDedingDan.html";
                    }, 2000);
                }else{
                    popUp_auto_false(1000, data.errorMessages);
                }
            }, false);
        },
        checkNum:function(e) {
            var temp = this;
            var obj = e.target;
            //为了去除最后一个.
            obj.value = obj.value.replace(/\.$/g,"");
            if(obj.value == ''){
                return ;
            }
            //使用改价后，重新计算优惠金额
            var integralDiscount = temp.changePriceInfo.integralDiscount;
            var oldPrice = temp.changePriceInfo.original_pay_price;
            var newPrice = temp.changePriceInfo.changedPrice;
            var newPromotionDiscount =parseFloat(oldPrice) - parseFloat(newPrice);
            newPromotionDiscount = parseFloat(newPromotionDiscount).toFixed(2);
            if(parseFloat(oldPrice) < parseFloat(newPrice)){
                popUp_auto_false(1000, "改价金额不允许大于原价!");
                return;
            }
            var pay_price_total = parseFloat(temp.changePriceInfo.pay_price_total);
            var promotionDiscount = pay_price_total-parseFloat(newPrice);
            temp.changePriceInfo.promotionDiscount = parseFloat(promotionDiscount).toFixed(2);
        },
        //卖家还没有维护物流信息弹窗
        logisticsInformationNone2Win:function() {
            $("#logistics_information_none2").show();
            clockedBody();
        },
        //关闭卖家还没有维护物流信息弹窗
        closeLogisticsInformationNone2Win:function() {
            $("#logistics_information_none2").hide();
            unClockedBody();
        },
        //查看物流
        checkLogistic:function(orderItemId){
            var temp = this;
            var paramData = {
                orderItemId: orderItemId
            };
            $.jsonAjax(getUrl("delivery/getDeliveryInfo"), filterJSONNULL(paramData), function (data, status, xhr) {
                temp.setDelfiveryInfo(data.deliveryDTO,data.pushDelibery);
            }, false);
        },
        setDelfiveryInfo:function (deliveryDTO,pushDelibery) {
            var temp = this;
            var result = pushDelibery.lastResult;
            if(result == null || result.length <= 0){
                $("#logistics_information_none").show();
                clockedBody();
                return;
            }
            Vue.set(temp.logisticsScheduleInfo,"deliveryNumber",deliveryDTO.deliveryNumber);
            Vue.set(temp.logisticsScheduleInfo,"deliveryCompanyName",deliveryDTO.deliveryCompanyName);
            Vue.set(temp.logisticsScheduleInfo,"logisticsSchedules",pushDelibery.lastResult.data);
            $("#logistics_information").show();
            clockedBody();
        },
        closeLogisticsInformationNoneWin:function() {
            $("#logistics_information_none").hide();
            unClockedBody();
        },
        //关闭物流
        closeLogistic:function(){
            $("#logistics_information").hide();
            unClockedBody();
        },
        confirmInvoice: function (sellerId,orderId){
            var sunmitData={},that=this;
            printConfirm("您确认补开发票?", function () {

                sunmitData.id=that.orderInfo.invoiceDTO.id;
                sunmitData.orderId=that.orderInfo.tradeOrder.orderId;
                sunmitData.buyerId=that.orderInfo.invoiceDTO.buyerId;
                sunmitData.sign='agree';
                sunmitData.state=3;

                $.jsonAjax(getUrl('invoice/updateInvoiceState'),sunmitData,function(data, status, xhr){
                    if(data.isSuccess){
                        window.location.reload();
                    }
                });
            });
        },
    },
    beforeMount:function(){
        this.submitInfo = $.getUrlJson();
        this.orderType=$.getUrlJson().orderType;
        this.initOrderDetail();//订单详情
    },
    mounted: function () {
        mountJQueryEvent();//初始化页面原有JQuery事件
    }
});