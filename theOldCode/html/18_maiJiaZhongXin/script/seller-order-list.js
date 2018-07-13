/**
 *  卖家中心---订单列表
 */
/**********************************************************************************************************************/
Array.prototype.removeByValue = function(val) {
    for(var i=0; i<this.length; i++) {
        if(this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
};


var sellerOrderVue = new Vue({
    el:"#seller_order_list",
    mixins:[math,portionDelivery],
    data:{
        pager: {},
        orderList:[],
        jsonArray:[],
        img_url:img_url,
        orderState:"",
        submitInfo:{},
        tempOrder:{},
        payPassword:"",
        pay_name:"",
        pay_type:"0",
        pay_date:"",
        logisticsInfo:{},
        deliveryNumber:"",
        deliveryCompanyCode:"",
        deliveryRemark:"",
        isSametemplate:"no",
        changePriceInfo:{},
        logisticsScheduleInfo:{}
    },
    methods:{
        //根据状态选中不同导航条
        selectedBar:function() {
            var temp = this;
            var tempState = temp.submitInfo.state;
            if(tempState == null || tempState == ""){
                return;
            }
            $("#navigation_bar li").each(function() {
                var state = $(this).attr("state");
                if(state == tempState){
                    $(this).attr("class","on");
                }else{
                    $(this).attr("class","");
                }
            });
        },
        //初始化订单列表
        initOrders:function () {
            var temp = this;
            var paramData = temp.submitInfo;
            $.jsonAjax(getUrl("order/querySeller"), filterJSONNULL(paramData), function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.$data.pager = data.resultData.pager;
                    temp.$data.orderList = data.resultData.pager.records;
                    temp.$data.jsonArray = data.resultData.jsonArray;
                }
            }, false);
        },
        //切换面板
        changeOrderPanel:function(orderState){
            var temp = this;
            temp.$data.orderState = orderState;
            var paramData = temp.$data.submitInfo = {};
            paramData.state = temp.$data.orderState;
            $.jsonAjax(getUrl("order/querySeller"), filterJSONNULL(paramData), function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.$data.pager = data.resultData.pager;
                    temp.$data.orderList = data.resultData.pager.records;
                    temp.$data.jsonArray = data.resultData.jsonArray;
                }
            }, false);
            $(".pullDownLabel").html("");
        },
        //跳转至普通搜索
        toSearch:function() {
            window.location = "../../html/18_maiJiaZhongXin/3_dingDan_sousuo.html";
        },
        //订单详情
        toOrderDetail:function(orderId,passKey,shipmentType) {
            var temp = this;
            var paramData = {
                orderId:orderId,
                passKey:passKey
            };
            if(shipmentType==3 || shipmentType==4 || shipmentType== 5){
                window.location = "../../html/18_maiJiaZhongXin/3_dingDan_dingDanXiangQing2.html?orderType=periodOrder&"+ $.assemblyRequestString(paramData);

            }else {
                window.location = "../../html/18_maiJiaZhongXin/3_dingDan_dingDanXiangQing2.html?"+ $.assemblyRequestString(paramData);
            }
        },
        //删除订单提示
        toDeleteOrder:function(order) {
            var temp = this;
            temp.$data.tempOrder = order;
            $("#delete_order_notice").show();
        },
        //删除订单
        deleteOrder:function() {
            var temp = this;
            var orderId = temp.$data.tempOrder.orderId;
            var paramData = {
                orderId:orderId
            };
            $.jsonAjax(getUrl("order/deleteOrderById"), filterJSONNULL(paramData), function (data, status, xhr) {
                $('#delete_order_notice').hide();
                if (data.success) {
                    popUp_auto(2000,'订单删除成功');
                    temp.$data.orderList.removeByValue(temp.$data.tempOrder);
                }else{
                    popUp_auto_false(1000, data.errorMessages);
                }
            }, false);
        },
        //确认发货提示
        toConfirmDeliver:function(order) {
            var temp = this;
            temp.tempOrder = order;
            var tempOrderT = this.getOrderJsonData(order.orderId);
            //原来的cart数据
            var tempOrderJson =JSON.parse(JSON.stringify(tempOrderT));
            console.log(tempOrderJson);
            //赋值初始值
            $.each(tempOrderJson.items,function(index,item){
                item.checked = false;
                if(tempOrderJson.existPortionDelivery){
                    item.maxValue = item.unDeliveriedNum;
                }else{
                    item.maxValue = item.num;
                }
                if(!item.deliveryCompanyCode){
                    item.deliveryCompanyCode = "";
                }
            });
            //临时orderJson
            temp.orderJson = tempOrderJson;
            if(temp.orderJson.existPortionDelivery){
                temp.otherDeliveryDialog = true;
            }else{
                temp.fisrtDeliveryDialogShow = true;
            }
        },


        //第一次发货
         deliveryFisrt:function(){

            if(this.deliveryType == "1"){//继续走先前的逻辑
                this.confirmDeliver();
            }

            if(this.deliveryType == "2"){//部分配送
                console.log(this.orderJson);
                var temp = this;
                var  orderId= temp.tempOrder.orderId;
                var  deliverys = [];
                $.each(this.orderJson.items,function(index,item){
                    if(item.num  && parseFloat(item.num) > 0 && item.checked){
                        var delivery={
                            orderItemId:item.orderItemId,
                            itemId:item.itemId,
                            orderId:temp.tempOrder.orderId,
                            deliveryNum:item.num,
                            deliveryNumber:item.deliveryNumber,
                            deliveryCompanyCode:item.deliveryCompanyCode,
                            deliveryRemark:item.deliveryRemark,
                            shopFreightTemplateId:item.shopFreightTemplateId,
                        };
                        deliverys.push(delivery);
                    }
                });

                if(deliverys.length == 0){
                    popUp_auto_false(2000, "请先勾选商品，并填写发货数量!");
                    return;
                }
                this.portionDelivery(orderId,deliverys);
            }
        },


        //部分发货，非首次发货
        //第一次发货
         deliveryRemain:function(){

             var  deliverys = [];
             var  orderId= this.tempOrder.orderId;
            if(this.deliveryType == "1"){//非首次发货，发货其余全部商品
                //非第一次配送code
                var deliveryCompanyCode =this.deliveryCompanyCode;
                //快递号
                var deliveryNumber =this.deliveryNumber;
                //备注
                var deliveryRemark =this.deliveryRemark;

                $.each(this.orderJson.items,function(index,item){
                    //如果此商品未发货数量大于0，需要记录并发货
                    if(item.unDeliveriedNum && parseFloat(item.unDeliveriedNum) > 0){
                        var delivery={
                            orderItemId:item.orderItemId,
                            itemId:item.itemId,
                            orderId:orderId,
                            deliveryNum:item.unDeliveriedNum,
                            deliveryNumber:deliveryNumber,
                            deliveryCompanyCode:deliveryCompanyCode,
                            deliveryRemark:deliveryRemark,
                            shopFreightTemplateId:item.shopFreightTemplateId,
                        };
                        deliverys.push(delivery);
                    }
                });

            }

            if(this.deliveryType == "2"){//部分配送
                $.each(this.orderJson.items,function(index,item){
                    if(item.unDeliveriedNum && parseFloat(item.unDeliveriedNum) > 0 && item.checked){
                        var delivery={
                            orderItemId:item.orderItemId,
                            itemId:item.itemId,
                            orderId:orderId,
                            deliveryNum:item.unDeliveriedNum,
                            deliveryNumber:item.deliveryNumber,
                            deliveryCompanyCode:item.deliveryCompanyCode,
                            deliveryRemark:item.deliveryRemark,
                            shopFreightTemplateId:item.shopFreightTemplateId,
                        };
                        deliverys.push(delivery);
                    }
                });
            }

             if(deliverys.length == 0){
                 popUp_auto_false(2000, "请先勾选商品，并填写发货数量!");
                 return;
             }
             this.portionDelivery(orderId,deliverys);
        },




        //部分配送
        portionDelivery:function(orderId,deliverys){
             var requestData = {
                 orderId: orderId,
                 deliverys:JSON.stringify(deliverys),
             };
            $.jsonAjax(getUrl("order/deliverOrderPortion"), requestData, function (data, status, xhr) {
                if (data.success) {
                    popUp_auto(1000,'部分发货成功');
                    window.setTimeout(function () {
                        window.location = "../../html/18_maiJiaZhongXin/3_dingDan_woDedingDan.html";
                    }, 2000);
                }else{
                    popUp_auto_false(1000, data.errorMessages);
                }
            }, false);
        },



        //查看部分发货的物流信息
         portionDeliveryShow :function(itemInfo){
            console.log(itemInfo)
            //初始化show
            if(itemInfo){
                if(itemInfo.deliveryDTOs && itemInfo.deliveryDTOs.length > 0){
                    $.each(itemInfo.deliveryDTOs,function(index,item){
                        item.showFlag =false;
                    });
                }
            }
            this.portionDeliveryDialogShow = true;
            //赋值查看信息
            this.itemInfo = itemInfo;
        },


        //修改发货弹框
        updatePortionDeliveryShow:function(itemInfo){
            console.log(itemInfo)
            //初始化show
            if(itemInfo){
                if(itemInfo.deliveryDTOs && itemInfo.deliveryDTOs.length > 0){
                    $.each(itemInfo.deliveryDTOs,function(index,item){
                        item.showFlag =false;
                    });
                }
            }
            this.portionDeliveryDialogUpdateShow = true;
            //赋值查看信息
            this.itemInfo = itemInfo;
        },


        //部分发货物流信息修改
         updatePortionDelivery:function(){
             $.jsonAjax(getUrl("order/updateDeliverOrderPortion"), {
                 deliverys:JSON.stringify(this.itemInfo.deliveryDTOs),
             }, function (data, status, xhr) {
                 if (data.success) {
                     popUp_auto(1000,'物流修改成功');
                     window.setTimeout(function () {
                         window.location = "../../html/18_maiJiaZhongXin/3_dingDan_woDedingDan.html";
                     }, 2000);
                 }else{
                     popUp_auto_false(1000, data.errorMessages);
                 }
             }, false);
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
                $('#confirm_deliver_notice').hide();
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
        //确认收到货款方式
        toReceivePay:function(order) {
            var temp = this;
            temp.$data.tempOrder = order;
            $("#receive_pay_method").show();
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
                $('#receive_pay_method').hide();
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
        //关闭确认收款窗口
        closeReceivePay:function() {
            $('#receive_pay_method').hide();
        },
        //订单评价
        toOrderEvaluate:function(orderId) {
            var paramData = {
                orderId:orderId
            };
            window.location = "../../html/18_maiJiaZhongXin/3_dingDan_dingDanPingJia.html?"+ $.assemblyRequestString(paramData);
        },
        //显示添加物流div
        showLogisticsDiv:function(orderItemId,itemId,orderId,shopFreightTemplateId) {
            var temp = this;
            var logisticsInfo = {
                orderItemId: orderItemId,
                itemId: itemId,
                orderId: orderId,
                shopFreightTemplateId: shopFreightTemplateId
            };
            temp.logisticsInfo = logisticsInfo;
            //加载数据
            var paramData = {
                orderItemId: orderItemId,
                itemId: itemId,
                orderId: orderId
            };
            $.jsonAjax(getUrl("delivery/toAddDelivery"), filterJSONNULL(paramData), function (data, status, xhr) {
                //页面数据填写
                temp.setLogisticsValue(data.deliveryDTO, orderId, itemId, orderItemId, shopFreightTemplateId);
            }, false);
            $("#logistics_div").show();
        },
        setLogisticsValue:function(deliveryDTO, orderId, itemId, orderItemId, shopFreightTemplateId) {
            var temp = this;
            temp.deliveryNumber = deliveryDTO.deliveryNumber;
            temp.deliveryCompanyCode = deliveryDTO.deliveryCompanyCode;
            temp.deliveryRemark = deliveryDTO.deliveryRemark;
            if(deliveryDTO.isSametemplate=="yes"){
                temp.isSametemplate = "yes";
                $(".xuanze img[isCheck='yes']").attr("src","../../img/yes-select.png");
                $(".xuanze img[isCheck='no']").attr("src","../../img/no-select.png");
            }else if(deliveryDTO.isSametemplate=="no"){
                temp.isSametemplate = "no";
                $(".xuanze img[isCheck='yes']").attr("src","../../img/no-select.png");
                $(".xuanze img[isCheck='no']").attr("src","../../img/yes-select.png");
            }
        },
        //关闭添加物流div
        closeLogisticsDiv:function() {
            $("#logistics_div").hide();
        },
        //添加物流信息
        addLogisticsInfo:function() {
            var temp = this;
            var deliveryNumber = temp.deliveryNumber;
            if(deliveryNumber == null || deliveryNumber == ""){
                popUp_auto_false(1000, "请填写物流编号！");
                return;
            }
            var deliveryCompanyCode = temp.deliveryCompanyCode;
            if(deliveryCompanyCode == null || deliveryCompanyCode == ""){
                popUp_auto_false(1000, "请选择物流公司！");
                return;
            }
            var deliveryRemark = temp.deliveryRemark;
            if(deliveryRemark == null || deliveryRemark == ""){
                deliveryRemark = " ";//偷个小懒，不用改dubbo啦^-^
            }
            var paramData = {
                orderItemId:temp.logisticsInfo.orderItemId,
                itemId:temp.logisticsInfo.itemId,
                orderId:temp.logisticsInfo.orderId,
                shopFreightTemplateId:temp.logisticsInfo.shopFreightTemplateId,
                deliveryNumber:deliveryNumber,
                deliveryCompanyCode:deliveryCompanyCode,
                deliveryRemark:deliveryRemark,
                isSametemplate:temp.isSametemplate
            };
            $.jsonAjax(getUrl("delivery/sendDeliberyMessage"), filterJSONNULL(paramData), function (data, status, xhr) {
                if (data.success) {
                    popUp_auto(1000,'提交成功');
                    window.setTimeout(function () {
                        window.location = "../../html/18_maiJiaZhongXin/3_dingDan_woDedingDan.html";
                    }, 2000);
                }else{
                    popUp_auto_false(1000, "提交失败");
                }
            }, false);
        },
        //是否将物流信息应用到该订单下相同运费模版的其他商品
        chooseSametemplate:function(e) {
            var temp = this;
            var isCheck = $(e.target).attr("isCheck");
            if(isCheck != null && isCheck == "yes"){
                temp.isSametemplate = "yes";
            }else{
                temp.isSametemplate = "no";
            }
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
        },
        //关闭订单改价div
        closeOrderChangePriceDiv:function() {
            $("#order_change_price_div").hide();
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
            //if(parseFloat(oldPrice) < parseFloat(newPrice)){
            //    popUp_auto_false(1000, "改价金额不允许大于原价!");
            //    return;
            //}
            if(parseFloat(newPrice) <= parseFloat(0.00)){
                popUp_auto_false(1000,"改价金额必须大于0!");
                return;
            }
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
            //if(parseFloat(oldPrice) < parseFloat(newPrice)){
            //    popUp_auto_false(1000, "改价金额不允许大于原价!");
            //    return;
            //}
            if(parseFloat(newPrice) <= parseFloat(0.00)){
                popUp_auto_false(1000,"改价金额必须大于0!");
                return;
            }
            var pay_price_total = parseFloat(temp.changePriceInfo.pay_price_total);
            var promotionDiscount = pay_price_total-parseFloat(newPrice);
            temp.changePriceInfo.promotionDiscount = parseFloat(promotionDiscount).toFixed(2);
        },
        //字符串截取
        intercept:intercept,
        //跳转店铺首页
        toShop:function(shopId) {
            var paramData = {
                shopId:shopId
            };
            window.location = "../../html/5_dianPuShouYe/dianPu_index.html?"+ $.assemblyRequestString(paramData);
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
                return;
            }
            Vue.set(temp.logisticsScheduleInfo,"deliveryNumber",deliveryDTO.deliveryNumber);
            Vue.set(temp.logisticsScheduleInfo,"deliveryCompanyName",deliveryDTO.deliveryCompanyName);
            Vue.set(temp.logisticsScheduleInfo,"logisticsSchedules",pushDelibery.lastResult.data);
            $("#logistics_information").show();
        },
        closeLogisticsInformationNoneWin:function() {
            $("#logistics_information_none").hide();
        },
        //关闭物流
        closeLogistic:function(){
            $("#logistics_information").hide();
        },
        //卖家还没有维护物流信息弹窗
        logisticsInformationNone2Win:function() {
            $("#logistics_information_none2").show();
        },
        //关闭卖家还没有维护物流信息弹窗
        closeLogisticsInformationNone2Win:function() {
            $("#logistics_information_none2").hide();
        },
        //根据订单jsonarray获取订单的json数据
        getOrderJsonData:function(orderId){
            var jsonOrder = "";
            $.each(this.jsonArray,function(index,item){
                if(item.orderId == orderId){
                    jsonOrder = item;
                    return false;
                }
            })
            return jsonOrder;
        },
    },
    beforeMount:function(){
        this.submitInfo = $.getUrlJson();

        this.initOrders();//初始化订单列表
    },
    mounted: function () {
        mountJQueryEvent();//初始化页面原有JQuery事件
        this.intercept(".leiXing",30);
        this.selectedBar();//根据状态选中不同导航条
        initPage();
    },
    updated:function () {
        this.intercept(".leiXing",30);
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
    }, 1000)
}
function Load() {
    setTimeout(function () {
        var nextPage = sellerOrderVue.$data.pager.nextPage;
        var thisPage = sellerOrderVue.$data.pager.page;
        if (nextPage == thisPage) {
            refresher.info.pullUpLable = "已经到底了";
        } else {
            var paramData = sellerOrderVue.$data.submitInfo;
            paramData.page = nextPage;
            if(sellerOrderVue.$data.orderState != null && sellerOrderVue.$data.orderState != ""){
                paramData.state = sellerOrderVue.$data.orderState;
            }
            $.jsonAjax(getUrl("order/querySeller"), paramData, function (data, status, xhr) {
                if (data.isSuccess) {
                    sellerOrderVue.$data.pager = data.resultData.pager;
                    sellerOrderVue.$data.orderList = sellerOrderVue.$data.orderList.concat(data.resultData.pager.records);
                    sellerOrderVue.$data.jsonArray = sellerOrderVue.$data.jsonArray.concat(data.resultData.jsonArray);
                }
            }, false);
            nextPage = sellerOrderVue.$data.pager.nextPage;
            thisPage = sellerOrderVue.$data.pager.page;
            if (nextPage == thisPage) {
                refresher.info.pullUpLable = "已经到底了";
            }
        }
        myScroll.refresh();
    }, 100);
};