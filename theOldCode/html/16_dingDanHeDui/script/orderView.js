/**
 * Created by Administrator on 2017/3/23 0023.
 */
/**
*@fileName:orderView.js
*@author:fdc
*@time:2017/3/23 0023
*@disc:订单核对页js
 *
 *
 * var keyName = this.userInfo.uid + "_Memo"
*/

var orderView = new Vue({
    el: "#orderView",
    mixins:[shop_coupon],
    data: {
        serverUrl:server_url,
        imgUrl:img_url,
        //用户信息
        userInfo:"",
        //订单类型
        orderType:"",
        //订单信息
        orderInfo:{
            //默认地址
            defAddress:"",
            //发票信息
            invoiceDTO:"",
            shipmentType:"",
            //订单备注
            memo:"",
            payPeriod:"7",
        },
        //审核人
        auditInfo:"",
        //toOrderDetail 信息
        submitInfo:{
            //订单类型
            orderType:"",
            //协议或者询价订单
            contractNo:"",
            //收货地址id
            address:"",
            //支付方式
            shipmentType:"",
            //延期数值
            payPeriod:"",
            //支付方法
            paymentMethod:"",
            //积分
            integral:"",
            //优惠卷
            couponUserId:"",
            //跳转类型
            gotoType:"",
            //发票id
            invoiceId:"",
            //审核人信息
            auditId:"",
            //配送方式
            freightDeliveryType:"",
            //是否改变数据需要重新请求
            changeFlag:true,
            //展会商品
          shopType:"",
        },
        //提交订单info
        tradeOrdersDTO:{},
        //订单核对要展示的数据信息默认显示3个
        showProducts:[],
        //支付方式隐藏跟显示
        payDiv:false,
        showCount:99,
    },
    methods: {
        //获取提交url
        getOrderViewUrl:function(submitInfo){
        
            if(submitInfo.orderType == 1 || submitInfo.orderType == 0){
                return "shopCart/toOrderDetail2";
            }else{
                return "shopCart/toOrderDetail";
            }
        },
        //获取订单信息
        getOrderView:function(asyncFlag){
            var temp = this;
            if(!isNotBlank(asyncFlag+"")){
                asyncFlag = true;
            }
            popUp_open();
            //如果需要改变数据那么重新请求 否则从缓存获取
            if(eval(this.submitInfo.changeFlag)){
                $.jsonAjaxPost(getUrl(this.getOrderViewUrl(this.submitInfo)),this.submitInfo,function(data, status, xhr){
                    popUp_close();
                    if(data.success){
                        //给订单信息赋值
                        temp.orderInfo = data.result;
                        //设置备注
                        temp.getMemoInfo();
                        //用户页面传值
                        temp.updateLocationStorage(temp.orderInfo);
                    }
                },asyncFlag);
            }else{
                //给订单信息赋值
                popUp_close();
                temp.orderInfo = StorageUtil.getItem(myCartKey + "_"+ temp.userInfo.uid);
            }
            if(asyncFlag){
                popUp_close();
            }


        },
        //获取订单信息
        getOrderViewNoFresh:function(){
            popUp_open();
            var temp = this;
            //如果需要改变数据那么重新请求 否则从缓存获取
            if(eval(this.submitInfo.changeFlag)){
                $.jsonAjaxPost(getUrl(this.getOrderViewUrl(this.submitInfo)),this.submitInfo,function(data, status, xhr){
                    popUp_close();
                    if(data.success){
                        //给订单信息赋值
                        temp.orderInfo = data.result;
                        //设置备注
                        temp.getMemoInfo();
                        //用户页面传值
                        temp.updateLocationStorage(temp.orderInfo);
                    }
                },false);
            }


        },
        //获取需要展示的商品信息
        getShowProducts:function(){
            var count = 0;
            var temp = this;
            $.each(this.orderInfo.myCart.shops,function(index,shop){
                if(shop.groupProducts != null){
                    $.each(shop.groupProducts,function(index,products){
                        $.each(products,function(index,product){
                            if(count >= temp.showCount){
                                return false;
                            }
                            if(product.checked){
                                temp.showProducts.push(product);
                                count = count + 1;
                            }
                        })
                    });
                }
            })

        },
        //获取用户保存的备注key的信息存到Storage
        setMemoInfo:function(){
            var keyName = this.userInfo.uid + "_Memo";
            var memo = "" ;
            if(isNotBlank(getJsonFiledValue(this.submitInfo,keyName))){
                memo = StorageUtil.getItemBytpe(getJsonFiledValue(this.submitInfo,keyName),valueTypeObject);
                if(memo == "undefined"){
                    memo = "";
                }
            }
            if(isNotBlank(memo)){
                this.orderInfo.memo = memo;
            }else{
                var ValueKey = StorageUtil.getRandom();
                this.submitInfo[""+keyName+""] = ValueKey;
            }
        },
        //获取备注
        getMemoInfo:function(){
            //备注信息
            var memo = StorageUtil.getItemBytpe(getJsonFiledValue(this.submitInfo,this.userInfo.uid + "_Memo"),valueTypeObject)
            if(memo == "undefined" || memo == "null" ||  !isNotBlank(memo)){
                memo = "";
            }
            Vue.set(this.orderInfo,"memo",memo);
        },
        //到收货地址页面
        gotoUpdateAddress :function(){
            var temp = this;
            this.submitInfo.gotoType = 'orderView';
            if(temp.orderInfo.defAddress){
                this.submitInfo.address = temp.orderInfo.defAddress.id;
            }
            window.location = "../../html/12_maiJiaZhongXin/04_deliveryAddress/4_shouHuoDiZhi_shouHuoDiZhi2.html?"+ $.assemblyRequestString(this.submitInfo);
        },
        //到发票信息页面
        gotoInvoice:function(invoiceDTO){
            if(invoiceDTO!=null && typeof(invoiceDTO) != undefined){
                this.submitInfo.invoiceId = invoiceDTO.id;
            }
            window.location = "faPiaoXinXi.html?"+ $.assemblyRequestString(this.submitInfo);
        },
        //到审核信息页面
        gotoSetAuth :function(){
            if(isNotBlank(this.orderInfo.auditInfo)){
                this.submitInfo.auditId = this.orderInfo.auditInfo.uid;
            }
            window.location = "shenHeXinXi.html?"+ $.assemblyRequestString(this.submitInfo);
        },
        //获取审核人信息
        getAuthInfo:function(){
            var temp = this;
            if(isNotBlank(this.submitInfo.authId)){
                $.jsonAjax(getUrl('user/getUserById'),{uid:this.submitInfo.authId},function(data, status, xhr){
                    if(data.success){
                        temp.auditInfo = data.result;
                    }
                });
            }
        },
        //进入到商品列表页面
        gotoProductList:function(){
            window.location = "shangPinQingDan.html?"+ $.assemblyRequestString(this.submitInfo);
        },
        //使用优惠卷
        useConpon:function(coupon){
            //选择的是别的优惠券  或者再次点击已选择的优惠券
            if(this.submitInfo.couponUserId == coupon.couponUserId){//再次点击已选择的优惠券
                this.submitInfo.couponUserId = '';
            }else{//选择的是别的优惠券
                this.submitInfo.couponUserId = coupon.couponUserId;

            }
            this.submitInfo.changeFlag = true;
            //初始化订单数据
            this.getOrderViewNoFresh();
            this.couponDialog = false;

        },
        //初始化订单数据
        initOrderView:function(){
                //延期支付看默认值是不是空如果是空那么默认值是7
                if(!this.orderInfo.payPeriod){
                    this.orderInfo.payPeriod = 7;
                }
                //如果支付周期 如果为空时 默认为1 立即支付
               if(!isNotBlank(this.orderInfo.shipmentType)){
                   //增加分期支付判断  2017年9月12日14:33:32
                   if(this.orderInfo.myCart.existCanAp){
                       Vue.set(this.orderInfo,"shipmentType",3);
                       return;
                   }
                   if(this.orderType == 1){
                       Vue.set(this.orderInfo,"shipmentType",2);
                   }else{
                       Vue.set(this.orderInfo,"shipmentType",1);
                   }
               }
        },
        //获取提交订单的用户选择的运费信息
        getCartDeliverys :function(){
            var temp = this;
            var deliveryTypes = [];
            $.each(this.orderInfo.myCart.shops,function(index,shop){
                if(isNotBlank(shop.groupProducts)){
                    $.each(shop.groupProducts,function(key,products){
                        $.each(shop.groupDeliveryTypes[key],function(index,shopDeliveryType){
                            if(temp.orderInfo.freightDeliveryType[key] == shopDeliveryType.deliveryType){
                                deliveryTypes.push(shopDeliveryType.templateId + '-' + shopDeliveryType.deliveryType);
                                return false;
                            }
                        })
                    })
                }
            });

            return deliveryTypes.join(",");
        },
        //更新本地缓存订单信息
        updateLocationStorage:function(data){
            StorageUtil.setItem(myCartKey + "_"+ this.userInfo.uid,data);
        },
        
        //普通订单提交
        orderSubmit:function(){
        	
            //准备订单数据
            //订单类型
            this.tradeOrdersDTO.orderType = this.submitInfo.orderType;
            var sitecollection=$("#sitecollection").val();
            //如果订单类型为 0 或者1 时
            // 协议订单/询价订单
            if(this.tradeOrdersDTO.orderType == 1||this.tradeOrdersDTO.orderType == 0){
                this.tradeOrdersDTO.contractNo = this.submitInfo.contractNo;
            }
            if(this.orderInfo.shopType == 2 && sitecollection == 0){
            	 popUp_auto_false(2500,"请选择收货方式");
            	 return false;
            }
            //收货地址
            if(this.orderInfo.defAddress){
                this.tradeOrdersDTO.address = this.orderInfo.defAddress.id;
            }else{
            	if(sitecollection != 2){
            		popUp_auto_false(2500,"请设置收货地址");
            		return false;
            	}
            }
            //运费信息
            this.tradeOrdersDTO.freightDeliveryType = this.getCartDeliverys();
            //发票信息
            if(this.orderInfo.invoiceDTO){
                this.tradeOrdersDTO.invoice = this.orderInfo.invoiceDTO.invoice;
                this.tradeOrdersDTO.invoiceTitle = this.orderInfo.invoiceDTO.invoiceTitle;
                this.tradeOrdersDTO.invoiceId = this.orderInfo.invoiceDTO.id;
            }
            //优惠卷id
            this.tradeOrdersDTO.couponUserId = this.submitInfo.couponUserId;

            //支付方式
            this.tradeOrdersDTO.paymentMethod =   this.orderInfo.paymentMethod;
            this.tradeOrdersDTO.shipmentType =   this.orderInfo.shipmentType;
            if(this.tradeOrdersDTO.shipmentType == 1){//立即支付
                this.tradeOrdersDTO.payPeriod =   null;
            }
            if(this.tradeOrdersDTO.shipmentType == 2){//延期支付
                this.tradeOrdersDTO.payPeriod =   this.orderInfo.payPeriod;
                if(!isNotBlank(this.tradeOrdersDTO.payPeriod)){
                    popUp_auto_false(2500,"延期支付请设置账期");
                    return false;
                }
            }
            if(this.tradeOrdersDTO.shipmentType == 3){//分期支付
                this.tradeOrdersDTO.payPeriod =   null;
            }
            /*陈广良 定金和延期 需求新增start*/
            // 王冠需要shipmentPayTypes字段，填充每个店铺的支付方式，格式为 FENQI_$shop.shopId,YANQI_$shop.shopId,DINGJIN_$shop.shopId,LIJI_$shop.shopId
            var shops=this.orderInfo.myCart.shops;
            this.tradeOrdersDTO.shipmentPayTypes='';
                for(var shop in shops){
                    if(shops[shop].shopId != 0){
                        if(shops[shop].temTypes != null){ //如果去商品清单里改过支付方式temTypes就不是null，就要取temTypes，
                            if(shops[shop].temTypes == 0){ //立即支付
                                this.tradeOrdersDTO.shipmentPayTypes +="LIJI_"+shops[shop].shopId+',';
                            }else if(shops[shop].temTypes == 1){ //分期支付
                                this.tradeOrdersDTO.shipmentPayTypes +="FENQI_"+shops[shop].shopId+',';
                            }else if(shops[shop].temTypes == 2){ //延期支付
                                this.tradeOrdersDTO.shipmentPayTypes +="YANQI_"+shops[shop].shopId+',';
                            }else if(shops[shop].temTypes == 3){ //定金支付
                                this.tradeOrdersDTO.shipmentPayTypes +="DINGJIN_"+shops[shop].shopId+',';
                            }
                        }else { // 如果没去商品清单里改过支付方式就取temType——null是立即 1分期2延期3定金
                            if(shops[shop].temType == null){ //立即支付
                                this.tradeOrdersDTO.shipmentPayTypes +="LIJI_"+shops[shop].shopId+',';
                            }else if(shops[shop].temType == 1){ //分期支付
                                this.tradeOrdersDTO.shipmentPayTypes +="FENQI_"+shops[shop].shopId+',';
                            }else if(shops[shop].temType == 2){ //延期支付
                                this.tradeOrdersDTO.shipmentPayTypes +="YANQI_"+shops[shop].shopId+',';
                            }else if(shops[shop].temType == 3){ //定金支付
                                this.tradeOrdersDTO.shipmentPayTypes +="DINGJIN_"+shops[shop].shopId+',';
                            }
                        }
                    }
                }
            /*陈广良 定金和延期 需求新增end*/

            //审核信息
            this.tradeOrdersDTO.auditorId = this.auditInfo.uid;
            //买家留言
            this.tradeOrdersDTO.memo = this.orderInfo.memo;

            var temp = this;
            this.tradeOrdersDTO.sitecollection = sitecollection;
            this.tradeOrdersDTO.shopType = this.orderInfo.shopType;

            //锁价
            if(this.orderInfo.lockSellerIdList){
                temp.tradeOrdersDTO.lockSellerIdList = this.orderInfo.lockSellerIdList.join(",");
            }

            filterJSONNULL(this.tradeOrdersDTO);
            $.jsonAjaxPost(getUrl('shopCart/validate'),this.tradeOrdersDTO,function(data, status, xhr){
                if(data.success){
                    if(data.result.myCart.lockSellerIdList){
                        temp.tradeOrdersDTO.lockSellerIdList = data.result.myCart.lockSellerIdList.join(",");
                    }
                    if(isNotBlank(temp.tradeOrdersDTO.auditorId)){
                        $.jsonAjaxPost(getUrl('shopCart/orderApproveSubmit'),temp.tradeOrdersDTO,function(data, status, xhr){
                            popUp_close();
                            if(data.success){
                                //审核订单跳转审核订单结果页
                                window.location = "../../html/16_dingDanHeDui/orderSubmitResultForAuth.html?orderNo="+data.result;
                            }else{
                                popUp_auto_false('1500',data.errorMessages);
                            }
                        },false);
                    }else{
                        if(temp.orderInfo.defAddress){
                            $.jsonAjaxPost(getUrl('shopCart/checkArea'),{receivedAddrId:temp.orderInfo.defAddress.id},function(data, status, xhr){
                                if(data.isSuccess){
                                    $.jsonAjaxPost(getUrl('shopCart/orderSubmit'),temp.tradeOrdersDTO,function(data, status, xhr){
                                        popUp_close();
                                        if(data.success){
                                            if(temp.tradeOrdersDTO.shipmentType == 1){
                                                window.location = "../../html/16_dingDanHeDui/quZhiFu.html?orderNo="+ data.result.parentOrder.orderId;
                                            }
                                            if(temp.tradeOrdersDTO.shipmentType == 2){
                                                //延期支付订单到订单提交结果页
                                                window.location = "../../html/16_dingDanHeDui/orderSubmitResult.html";
                                            }
                                            if(temp.tradeOrdersDTO.shipmentType == 3 || temp.tradeOrdersDTO.shipmentType == 4 || temp.tradeOrdersDTO.shipmentType == 5){
                                                if(data.result.existApNoPay){
                                                    //分期不需要付款
                                                    window.location = "../../html/16_dingDanHeDui/orderSubmitResult.html";
                                                }else{
                                                    window.location = "../../html/16_dingDanHeDui/quZhiFu.html?orderNo="+ data.result.parentOrder.orderId;
                                                }

                                            }
                                        }else{
                                            popUp_auto_false('1500',data.errorMessages);
                                        }
                                    },false);
                                }else{
                                    popUp_close();
                                    popUp_auto_false('2500',data.msg);
                                }
                            },false);
                        }else{
                            $.jsonAjaxPost(getUrl('shopCart/orderSubmit'),temp.tradeOrdersDTO,function(data, status, xhr){
                                popUp_close();
                                if(data.success){
                                    if(temp.tradeOrdersDTO.shipmentType == 1){
                                        window.location = "../../html/16_dingDanHeDui/quZhiFu.html?orderNo="+ data.result.parentOrder.orderId;
                                    }
                                    if(temp.tradeOrdersDTO.shipmentType == 2){
                                        //延期支付订单到订单提交结果页
                                        window.location = "../../html/16_dingDanHeDui/orderSubmitResult.html";
                                    }
                                    if(temp.tradeOrdersDTO.shipmentType == 3 || temp.tradeOrdersDTO.shipmentType == 4 || temp.tradeOrdersDTO.shipmentType == 5){
                                        if(data.result.existApNoPay){
                                            //分期不需要付款
                                            window.location = "../../html/16_dingDanHeDui/orderSubmitResult.html";
                                        }else{
                                            window.location = "../../html/16_dingDanHeDui/quZhiFu.html?orderNo="+ data.result.parentOrder.orderId;
                                        }

                                    }
                                }else{
                                    popUp_auto_false('1500',data.errorMessages);
                                }
                            },false);
                        }
                    }
                }else{
                    popUp_close();
                    popUp_auto_false('1500',data.errorMessages);
                }
            },false);

        }
    },
    computed:{

    },
    beforeMount:function(){
        //用户信息
        this.userInfo = StorageUtil.getUserInfo();
        //从浏览器获取提交订单信息
        this.submitInfo = $.getUrlJson();
        //如果地址存在修改，那么此处不应该保存此值，删除它
        deleteJSONFiled(this.submitInfo,"updateAddressId");
        if( typeof(this.submitInfo.changeFlag) ==  "undefined"){
            this.submitInfo.changeFlag = true;
        }
        //获取订单信息
        this.getOrderView(false);
        //初始化订单数据
        this.initOrderView();
        //获取审核人信息
        this.getAuthInfo();
        //获取需要展示的商品信息
        this.getShowProducts();
        //获取保存用户备注的key信息
        this.setMemoInfo();

    },
    mounted:function(){
       //判断展会商品进入
       if(this.submitInfo.tradeMark == 1){
    	   receiptCheck();
       }
    },
    beforeUpdate:function(){

    },
    updated:function(){
        popUp_close();
    },
    watch:{
        'orderInfo.paymentMethod':function(newValue,oldValue){
            this.updateLocationStorage(this.orderInfo);
            this.submitInfo.paymentMethod = newValue;
        },
        'orderInfo.shipmentType':function(newValue,oldValue){
            this.updateLocationStorage(this.orderInfo);
            this.submitInfo.shipmentType = newValue;
        },
        'orderInfo.payPeriod':function(newValue,oldValue){
            this.updateLocationStorage(this.orderInfo);
            this.submitInfo.payPeriod = newValue;
        },
        'orderInfo.memo':function(newValue,oldValue){
            var key  = getJsonFiledValue(this.submitInfo,this.userInfo.uid + "_Memo")
            StorageUtil.setItem(key,newValue);
        },

    }


});
//展会商品(现场领取)王冠
function sceneCheck(){
	$("#sitecollection").val("2");
	$("#addressRadio").attr("style","display: none;");
	$("#imgscene").attr("src","../../img/yes-select.png");
	$("#imgreceipt").attr("src","../../img/no-select.png");
}
//展会商品(收货地址领取)王冠
function receiptCheck(){
	$("#sitecollection").val("1");
	$("#addressRadio").attr("style","display: block;");
	$("#imgscene").attr("src","../../img/no-select.png");
	$("#imgreceipt").attr("src","../../img/yes-select.png");
}
