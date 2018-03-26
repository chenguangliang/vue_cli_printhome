/**
 *  买家中心---订单详情
 */
/**********************************************************************************************************************/
var orderDetail = new Vue({
    el:"#order_detail",
    data:{
        selBtnIndex:13,//选中第几期
        periodName:['首','二','三','四','五','六','七','八','九','十','十一','尾'],
        apInfo:{},//分期所有信息
        periodItemList:[],//分期详情
        shipmentType:'',//标识订单支付类型   <!-- shipmentType  1立即支付，2延期支付,3分期支付，4定金支付,5新延期支付,-->
        submitInfo:{},
        orderInfo:{},
        img_url:img_url,
        tempOrder:{},
        payPassword:"",
        picUrl:"",
        logisticsScheduleInfo:{},
        toPayParam:'',//临时储存去支付需要带的参数（为了逾期提示框）
        regularBuy:{
            orderId:'',
            itemId:'',
            skuId:''
        },
    },
    methods:{
        //去支付
        toPay:function (orderId) {
            var paramData = {
                orderNo:orderId
            };
          //判断下是否已经选择过转账支付
            $.jsonAjax(getUrl("order/checkOrderPayMethd"), filterJSONNULL(paramData), function (data, status, xhr) {
                if(data.result){
                    window.location = "../../html/16_dingDanHeDui/payLastPage.html?"+ $.assemblyRequestString(paramData);
                }else{
                    window.location = "../../html/16_dingDanHeDui/quZhiFu.html?"+ $.assemblyRequestString(paramData);
                }

            }, false);
            //window.location = "../../html/16_dingDanHeDui/quZhiFu.html?"+ $.assemblyRequestString(paramData);
        },
        //去支付-分期订单(除了必付的首期)
        toPayForAp: function ($event,orderId,orderApId,orderApItemId) {
            var paramData = {
                orderNo:orderId,
                orderApId:orderApId,
                orderApItemId:orderApItemId
            };
            if($event.target.attributes.apOverdueFee && $event.target.attributes.apOverdueFee.value>0){
                $("#payForPeriod").show();
                $("#overDueDay").html(' '+$event.target.attributes.overdueday.value);//弹窗里逾期的天数赋值
                $("#apOverdueFee").html($event.target.attributes.overduefee.value);//弹窗里逾期的手续费赋值
                $("#paytotal").html($event.target.attributes.paytotal.value);//弹窗里逾期的本金加手续费赋值
                this.toPayParam=$.assemblyRequestString(paramData);
            }else {
            	//判断下是否已经选择过转账支付
                $.jsonAjax(getUrl("order/checkOrderPayMethd"), filterJSONNULL(paramData), function (data, status, xhr) {
                    if(data.result){
                        window.location = "../../html/16_dingDanHeDui/payLastPage.html?"+ $.assemblyRequestString(paramData);
                    }else{
                        window.location = "../../html/16_dingDanHeDui/quZhiFu.html?"+ $.assemblyRequestString(paramData);
                    }

                }, false);
                //window.location = "../../html/16_dingDanHeDui/quZhiFu.html?"+ $.assemblyRequestString(paramData);
            }
        },
        toPayForApForOverDue: function () {
            window.location = "../../html/16_dingDanHeDui/quZhiFu.html?"+ this.toPayParam;
        },
        goToTop:goToTop,
        //选择要付款的期数
        selPeriod: function (index) {
            this.selBtnIndex=index;
        },
        //关闭跨期支付弹窗
        closeWin: function () {
            $("#crossPay").hide();
            this.selBtnIndex=13;
        },
        //点击顶部分期信息 请求分期信息
        getPeriodInfo: function (orderId) {
            var temp=this;
            $.jsonAjax(getUrl("periodorder/periodInfo"), {"orderId":orderId}, function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.periodItemList=data.apInfo.orderAccountPeriodItemDTOs;
                    temp.apInfo=data.apInfo;
                }else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
        },
        //跨期支付
        crossPay: function (orderId) {
            $("#crossPay").show();
            var temp=this;
            $.jsonAjax(getUrl("periodorder/periodInfo"), {"orderId":orderId}, function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.periodItemList=data.apInfo.orderAccountPeriodItemDTOs;
                }else {
                    popUp_auto_false(2500, '网络错误');
                }
            }, false);
        },
        //关闭删除订单提示
        closeDeleteOrderNotice:function() {
            $("#delete_order_notice").hide();
            unClockedBody();
        },
        //删除订单提示
        toDeleteOrder:function(order) {
            var temp = this;
            temp.$data.tempOrder = order;
            $("#delete_order_notice").show();
            clockedBody();
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
                    window.setTimeout(function () {
                        window.location = "../../html/12_maiJiaZhongXin/12_dingDan_woDedingDan.html";
                    }, 2000);
                }else{
                    popUp_auto_false(1000, data.errorMessages);
                }
            }, false);
        },
        //订单评价
        toOrderEvaluate:function(orderId) {
            var paramData = {
                orderId:orderId
            };
            window.location = "../../html/12_maiJiaZhongXin/12_dingDan_dingDanPingJia.html?"+ $.assemblyRequestString(paramData);
        },
        //关闭延迟收货提示
        closedelayReceiptNotice:function() {
            $("#delay_receipt_notice").hide();
            unClockedBody();
        },
        //延迟收货提示
        toDelayReceipt:function(order) {
            var temp = this;
            temp.$data.tempOrder = order;
            $("#delay_receipt_notice").show();
            clockedBody();
        },
        //延期收货
        delayReceipt:function() {
            var temp = this;
            var refund = temp.$data.tempOrder.refund;
            if(refund == 2){
                popUp_auto_false(1000, "该订单已延期收货");
                return;
            }
            var orderId = temp.$data.tempOrder.orderId;
            var paramData = {
                orderId:orderId
            };
            $.jsonAjax(getUrl("order/delayDelivery"), filterJSONNULL(paramData), function (data, status, xhr) {
                $('#delay_receipt_notice').hide();
                if (data.success) {
                    popUp_auto(1000,'延期收货成功');
                    window.setTimeout(function () {
                        window.location = "../../html/12_maiJiaZhongXin/12_dingDan_woDedingDan.html";
                    }, 2000);
                }else{
                    popUp_auto_false(1000, data.errorMessages);
                }
            }, false);
        },
        //关闭确认收货提示
        closeReceiptNotice:function() {
            $("#confirm_receipt_notice").hide();
            unClockedBody();
        },
        //确认收货提示
        toConfirmReceipt:function(order) {
            var temp = this;
            temp.$data.tempOrder = order;
            temp.$data.payPassword = "";
            var refund = temp.$data.tempOrder.refund;
            if (refund == 2) {
                clockedBody();
                printConfirm("您申请的退款/退货正在处理中，点击“确认收货”会关闭卖家未处理或拒绝退款的申请，请确认是否继续？", function () {
                    $("#confirm_receipt_notice").show();
                })
            } else {
                $("#confirm_receipt_notice").show();
                clockedBody();
            }
        },
        //确认收货
        confirmReceipt:function() {
            var temp = this;
            var orderId = temp.$data.tempOrder.orderId;
            if (orderId == null || $.trim(orderId) == "") {
                popUp_auto_false(1000, "请指定要操作的订单");
                return;
            }
            var paypwd = temp.$data.payPassword;
            if (paypwd == null || $.trim(paypwd) == "") {
                popUp_auto_false(1000, "请输入支付密码");
                return;
            }
            printConfirm("点击确定之后，您的付款将直接到卖家账户里，请务必收到货后再确定", function () {
                var paramData = {
                    orderId:orderId,
                    paypwd : paypwd
                };
                $.jsonAjax(getUrl("order/confirmReceipt"), filterJSONNULL(paramData), function (data, status, xhr) {
                    $('#confirm_receipt_notice').hide();
                    if (data.success) {
                        popUp_auto(1000,'确认收货成功');
                        window.setTimeout(function () {
                            window.location = "../../html/12_maiJiaZhongXin/12_dingDan_woDedingDan.html";
                        }, 2000);
                    }else{
                        popUp_auto_false(1000, data.errorMessages);
                    }
                }, false);
            })
        },
        //关闭取消订单提示
        closeCancleOrderWin:function () {
            $("#cancle_order_notice").hide();
            unClockedBody();
        },
        //取消订单提示
        toCancleOrder:function(order) {
            var temp = this;
            temp.$data.tempOrder = order;
            $("#cancle_order_notice").show();
            clockedBody();
        },
        //取消订单
        cancleOrder:function() {
            var temp = this;
            var orderId = temp.$data.tempOrder.orderId;
            var paramData = {
                orderId:orderId,
                orderStatus : 6
            };
            $.jsonAjax(getUrl("order/cancelOrder"), filterJSONNULL(paramData), function (data, status, xhr) {
                $('#cancle_order_notice').hide();
                if (data.success) {
                    popUp_auto(2000,'订单取消成功');
                    window.setTimeout(function () {
                        window.location = "../../html/12_maiJiaZhongXin/12_dingDan_woDedingDan.html";
                    }, 2000);
                }else{
                    popUp_auto_false(1000, data.errorMessages);
                }
            }, false);
        },
        //订单详情
        initOrderDetail:function() {
            var temp = this;
            var paramData = temp.submitInfo;
            $.jsonAjax(getUrl("order/queryOrderInfoBuyer"), filterJSONNULL(paramData), function (data, status, xhr) {
                if (data.isSuccess) {
                    temp.$data.orderInfo = data.resultData;
                    console.log(data.resultData);
                }
            }, false);
        },
        //跳转订单列表
        toOrderList:function() {
            //如果是分期订单就要跳到上一步，其他订单跳到全部订单列表
            if(this.shipmentType && this.shipmentType==3){
                // window.location = "../../html/12_maiJiaZhongXin/12_dingDan_fenQiDingDan.html";
                history.go(-1);location.reload();
            }else {
                window.location = "../../html/12_maiJiaZhongXin/12_dingDan_woDedingDan.html";
            }
            //直接跳转到订单列表可能会有问题，有的订单详情是从询价或者其他地方跳转过来的
            //history.go(-1);location.reload();
            //需求确定，不管哪个入口进入订单详情统一返回订单列表
        },
        //申请售后
        applySaleAfter:function(orderId,skuId) {
            var paramData = {
                orderId:orderId,
                skuId:skuId
            };
            window.location = "../../html/12_maiJiaZhongXin/12_dingDan_tiJiaoTuiKuan.html?"+ $.assemblyRequestString(paramData);
        },
        //查看售后的进度
        lookProgress:function(returnId,skuId) {
            var paramData = {
                returnId:returnId,
                skuId:skuId
            };
            window.location = "../../html/12_maiJiaZhongXin/12_dingDan_tuiKuanShouHouZhuangTai.html?"+ $.assemblyRequestString(paramData);
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
        // 加入常购列表
        add_order_list:function(orderId,itemId,skuId) {
            this.regularBuy.orderId = orderId;
            this.regularBuy.itemId = itemId;
            this.regularBuy.skuId = skuId;

            //判断常购列表是否已满
            $.jsonAjax(getUrl("buyercenter/checkRegularBuy"),{orderId : this.regularBuy.orderId,itemId : this.regularBuy.itemId,skuId : this.regularBuy.skuId} , function (data, status, xhr) {
                if(data.result == "yes"){//换最后一件商品
                    $("#change_list").show();
                }else{//加入常采购列表
                    $("#add_list").show();
                }
            }, true);

            //clockedBody();
        },
        //关闭加入常购列表
        closeAdd_order_list:function() {
            $(".add_list").hide();
            unClockedBody();
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
        addInvoice: function (sellerId,orderId){
            window.location="../../html/16_dingDanHeDui/faPiaoXinXi_add.html?"+ $.assemblyRequestString({sellerId:sellerId,orderId:orderId});
        },
        getInvoice: function () {
            var that=this;
            printConfirm("您确认已收到发票吗？", function () {
                var submitData={};
                submitData.orderId=that.orderInfo.tradeOrder.orderId;//这里用tradeOrder不用invoiceDTO，是因为invoiceDTO里的orderId是空的
                submitData.invoice=that.orderInfo.invoiceDTO.invoice;
                submitData.invoiceTitle = that.orderInfo.tradeOrder.invoiceTitle? that.orderInfo.tradeOrder.invoiceTitle:'';
                submitData.sellerId=that.orderInfo.tradeOrder.sellerId;
                submitData.sign='recieve';
                submitData.invoiceId=that.orderInfo.invoiceDTO.id;
                $.jsonAjax(getUrl('order/updateOrderInvoice'),submitData,function(data, status, xhr){
                    if(data.isSuccess){
                        $.jsonAjax(getUrl('invoice/updateInvoiceState'),{orderId: that.orderInfo.tradeOrder.orderId,state:1},function(data, status, xhr){
                            console.log(data);
                            if(data.isSuccess){//这里更新发票表
                                popUp_auto(1500,"操作成功");
                                setTimeout(function () {
                                    window.location.reload();
                                },1500)
                            }
                        });
                    }
                });
            });

        }
    },
    beforeMount:function(){
        this.submitInfo = $.getUrlJson();
        this.shipmentType=$.getUrlJson().shipmentType;
        this.initOrderDetail();//订单详情
    },
    mounted: function () {
        mountJQueryEvent();//初始化页面原有JQuery事件
    }
});


function addToReguBuyList (type) {
    $.jsonAjax(getUrl("buyercenter/addRegularBuy"),{orderId : orderDetail.$data.regularBuy.orderId,itemId : orderDetail.$data.regularBuy.itemId,skuId : orderDetail.$data.regularBuy.skuId,type : type} , function (data, status, xhr) {
        $(".add_list").hide();
        unClockedBody();
        if(data.result == "success"){
            popUp_auto(1500,"加入成功");
        }else{
            popUp_auto_false(1000,"加入失败");
        }
    }, false);

}