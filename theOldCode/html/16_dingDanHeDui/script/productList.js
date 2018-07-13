/**
 * Created by Administrator on 2017/3/30 0030.
 */
/**
*@fileName:productList.js
*@author:fdc
*@time:2017/3/30 0030
*@disc:显示商品列表
*/

var productList = new Vue({

    el: "#productList",
    data:{
        serverUrl:server_url,
        imgUrl:img_url,
        //用户信息
        userInfo:"",
        //订单信息
        submitInfo:{
            changeFlag:false,
        },
        orderInfo:"",
        shopIds:"",
        temTypes:""
    },
    methods:{
        //获取订单信息 changeTarget 1  //修改运费方式  2//修改支付方式
        getOrderView:function(asyncFlag,changeTarget){
            var temp = this;
            if(!isNotBlank(asyncFlag+"")){
                asyncFlag = true;
            }
            //this.submitInfo.changeFlag = true;
            if(this.submitInfo.changeFlag){

                if(changeTarget==1){
                    //修改运费方式
                    this.submitInfo.freightDeliveryType = "";
                    $("select[name='freightDeliveryType']").each(function(index,type){
                        temp.submitInfo.freightDeliveryType = temp.submitInfo.freightDeliveryType + $(type).val() + ",";
                    });

                }
                if(changeTarget==2){
                    //修改支付方式
                    /*传给后台所有店铺的支付方式*/
                    this.submitInfo.shipmentTypes = '';
                    $("select[name='pay_type']").each(function(index,type){
                        temp.submitInfo.shipmentTypes = temp.submitInfo.shipmentTypes + $(type).val() + ",";
                    });

                }


                if(this.orderInfo.lockSellerIdList){ //锁价
                    //非第一次进入锁价
                    temp.submitInfo.lockFisrtFlag="1";
                    temp.submitInfo.lockSellerIdList = this.orderInfo.lockSellerIdList.join(",");
                }

                $.jsonAjaxPost(getUrl('shopCart/toOrderDetail'),this.submitInfo,function(data, status, xhr){
                    if(data.success){
                        temp.orderInfo  = data.result;
                        //用户页面传值
                        StorageUtil.setItem(myCartKey + "_"+ temp.userInfo.uid,data.result);
                        popUp_close();
                        $(".confirmWrap_pay_popup").hide();
                    }
                },asyncFlag);
            }else{
                //获取信息
                temp.orderInfo =   StorageUtil.getItem(myCartKey + "_"+ temp.userInfo.uid);
                console.log(temp.orderInfo);
                popUp_close();
            }
            if(asyncFlag){
                popUp_close();
            }
        },
        divide_PayPopups:function (e,shopId,temType) {
        	 var obj = e.target;
        	 var newPayType = "LIJI_"+shopId;
        	 var str ='';
	       	 if(obj.value == newPayType){
	       		 if(temType == 1){
	           		 str = str + "选择立即支付后分期商品将不具备分期性质,<br/>支付时需要立即全款支付，您确定使用立即支付吗？"
	           	 }
	           	 if(temType == 2){
	           		 str = str + "选择立即支付后延期商品将不具备延期性质,<br/>支付时需要立即全款支付，您确定使用立即支付吗？"
	           	 }
	           	 if(temType == 3){
	           		 str = str + "选择立即支付后定金商品将不具备定金性质,<br/>支付时需要立即全款支付，您确定使用立即支付吗？"
	           	 }
	           	 $("#confirm_msg").html(str);
	           	 $(".pay_popup").css("display", "block");
	           	 this.shopIds = shopId;
	           	 this.temTypes = temType;
	       	 }else{
	       	    $(".confirmWrap_pay_popup").show(); 
	       		$(".payTypeImg_"+shopId).show();
	      	    $(".delay_info_"+shopId).show();
	      	    var that=this;
	     	    setTimeout(function(){
	     		
	     		 that.getOrderView(false,2);
	     	     },100);
	       	 }
       },
       apJsCancle:function (shopId,temType) {
    	   if(temType == 1){
    		   $("#pay_type_"+shopId).val("FENQI_"+shopId);
    	   }
    	   if(temType == 2){
    		   $("#pay_type_"+shopId).val("YANQI_"+shopId);
    	   }
    	   if(temType == 3){
    		   $("#pay_type_"+shopId).val("DINGJIN_"+shopId);
    	   }
       },
       chanGeOrderView:function(){
    	   $(".confirmWrap_pay_popup").show();
    	   $(".payTypeImg_"+this.shopIds).hide();
     	   $(".delay_info_"+this.shopIds).hide();
     	   $(".pay_popup").css("display", "none");
     	   var that=this;
	       setTimeout(function(){
	     	  that.getOrderView(false,2);
	       },100);
       },
        //此页面由订单核对页跳转而来将此返回回去
        orderChecked:function(){
            window.location = "../../html/16_dingDanHeDui/dingDanHeDui.html?"+ $.assemblyRequestString(this.submitInfo);
        },

        //获取店铺运费模板优惠方式
        getShopDeliveryPreferentialWay :function(shop,deliveryId,freightDeliveryType){
            var deliveryTypePreferentialWay = "" ;
            if(shop.groupDeliveryTypes && shop.groupDeliveryTypes[deliveryId] && shop.groupDeliveryTypes[deliveryId].length >0){
                deliveryTypePreferentialWay = shop.groupDeliveryTypes[deliveryId][0].deliveryTypePreferentialWayDTO;
            }


            $.each(shop.groupDeliveryTypes[deliveryId],function(index,shopDeliveryType){
                if(freightDeliveryType[deliveryId] == shopDeliveryType.deliveryType){
                    deliveryTypePreferentialWay = shopDeliveryType.deliveryTypePreferentialWayDTO;
                    return false;
                }

            });
            return deliveryTypePreferentialWay;
        },
        //去订单详情页
        gotoOrderView :function(){
            //deleteJSONFiled(this.submitInfo,'freightDeliveryType');
            Vue.set(this.submitInfo,'changeFlag',false);
            this.orderChecked();
        },
        //计算商品延期手续费
        computeItemsApOverFee:function(shop){
            var result = (shop.currentApFirstItem.apFee + shop.currentApFirstItem.payFee)* shop.currentApTemplate.apOverdueFee /100;
            return result.toFixed(2);
        },
        //锁价
        checkCanLock:function (sellerId) {
            var canLock = false;
            if(this.orderInfo.fareLockList){
                for(var i=0;i<this.orderInfo.fareLockList.length;i++){
                    var fareLock = this.orderInfo.fareLockList[i];
                    if(fareLock.sellerId==sellerId){
                        canLock = true;
                        break;
                    }
                }
            }
            return canLock;
        },
        checkIsLocked:function (sellerId) {
            var isLocked = false;
            if(this.orderInfo.lockSellerIdList){
                for(var i=0;i<this.orderInfo.lockSellerIdList.length;i++){
                    var lockedSellerId = this.orderInfo.lockSellerIdList[i];
                    if(lockedSellerId==sellerId){
                        isLocked = true;
                        break;
                    }
                }
            }
            return isLocked;
        },
        changeIsLocked:function (sellerId) {
            var lockedSellerId = this.orderInfo.lockSellerIdList;
            var doAdd = true;
            if(lockedSellerId==null){
                lockedSellerId = new Array();
            }
            for (var i = 0; i < lockedSellerId.length; i++) {
                if (lockedSellerId[i] == sellerId) {
                    lockedSellerId[i] = "";
                    // lockedSellerId.splice(i, 1);
                    doAdd = false;
                    break;
                }
            }
            if (doAdd) {
                lockedSellerId.push(sellerId+"");
            }
            this.orderInfo.lockSellerIdList = lockedSellerId;
            this.getOrderView();
        }
    },
    computed:{

    },
    beforeMount:function(){
        //用户信息
        this.userInfo = StorageUtil.getUserInfo();
        //从浏览器获取提交订单信息
        this.submitInfo = $.getUrlJson();
        //默认初始化时数据不改动不加载数据
        Vue.set(this.submitInfo,'changeFlag',false);
        //获取商品数据
        //this.orderInfo =  StorageUtil.getItem('productListKey');
        this.getOrderView();
    },
    mounted:function(){
    // 选择支付类型
        $('#pay_type').change(function () {
            if (this.value == 1) {
                $(".pay_popup").css("display", "block");
                $('.stageImg,.stageRooler,.delayImg,.delay_info').hide();
            }
            if(this.value == 2){
                $('.delay_info,.delayImg').show();
                $('.stageImg,.stageRooler').hide();
            }
            if(this.value == 3){
                $('.stageImg,.stageRooler').show();
                $('.delay_info,.delayImg').hide();
            }
        });
        // 关闭弹窗
        $('.confirmBtn').click(function () {
            $(".pay_popup").css("display", "none");
        })
    },
    breforeUpdate:function(){

    },
    updated:function(){
        popUp_close();
    },
    watch:{
    }

});