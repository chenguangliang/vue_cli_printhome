/**
*@fileName:10_contractInfo.js
*@author:fdc
*@time:2017/4/28
*@disc:协议明细
*/

var baseInfoType = 1;//显示基本信息
var orderInfoType = 2;//显示订单信息
var contractInfo = new Vue({
    el:"#contractInfo",
    mixins:[common],
    data:{
        //浏览器参数
        serverUrl: server_url,
        imgUrl: img_url,
        baseInfoType: baseInfoType,
        orderInfoType: orderInfoType,
        params:"",
        contractId:"",
        contractInfo:{
            contract:"",
            publishedBy:"",
            approveBy:"",
            contractPayment:"",
            contractUrlShowList:"",
            seller:"",
            statusMap:"",
            buyer:"",
        },
        contractOrders:[],
        showtype:baseInfoType,
    },
    methods:{
        //获取用户信息
        getUserInfo:function(){
            var tmep = this;
            $.jsonAjax(getUrl("user/getUserInfo"), {}, function (data, status, xhr) {
                if (data.success) {
                    tmep.userInfo = data.result;
                    // console.log(data.result);
                    // console.log(vm.$data.userInfo);
                }
            }, false);
        },
        //初始化setSourcePage
        setSourcePage:function(){
            this.sourcePage = this.params.sourcePage;
            this.contractId = this.params.contractId;
            if(!isNotBlank(this.sourcePage) || !("seller" == this.sourcePage || "buyer" == this.sourcePage) ){
                popUp_auto_false(1500,"sourcePage类型不正确！");
                window.setInterval(function(){
                    window.history.back(-1);
                },1500);
            }
            if(!isNotBlank(this.contractId)){
                popUp_auto_false(1500,"contractId不能为空！");
                window.setInterval(function(){
                    window.history.back(-1);
                },1500);
            }
        },
        //获取协议信息
        getContractInfo:function(){
            var temp  = this;
            $.jsonAjax(getUrl("/contract/getDetailInfo"),{contractId:this.contractId},function(data,status,xhr){
                console.log(data);
                if(data.success){
                    temp.contractInfo  = data.result;
                }else{
                    popUp_auto_false(3000,data.errorMessages);
                }
            });
        },
        //获取协议订单信息
        getContractOrderInfo:function(){
            var temp  = this;
            $.jsonAjax(getUrl("/contract/getContractOrder"),this.params,function(data,status,xhr){
                console.log(data);
                if(data.success){
                    temp.contractOrders = data.result.orderPager.records;
                }else{
                    popUp_auto_false(3000,data.errorMessages);
                }
            });
        },
        //去订单详情页
        gotoOrderDetail:function(contractOrder){
            if(this.sourcePage == 'seller'){
                window.location.href="../../html/18_maiJiaZhongXin/3_dingDan_dingDanXiangQing2.html?orderId=" + contractOrder.orderId+ "&passKey=" + contractOrder.passKey ;
            }else {
                window.location.href = "../../html/12_maiJiaZhongXin/12_dingDan_dingDanXiangQing2.html?orderId=" + contractOrder.orderId + "&passKey=" + contractOrder.passKey;
            }

        },
        //商品详情页
        gotoGoods:function (item) {
            window.location = "../../html/13_shangPinXiangQing/shangPinYe.html?itemId="+item.itemId+"&skuId="+item.skuId;
        },
    },
    computed:{

    },
    beforeMount:function(){
        //获取浏览器参数
        this.params = $.getUrlJson();
        //初始化setSourcePage
        this.setSourcePage();
        //获取协议信息
        this.getContractInfo();
        //获取订单信息
        this.getContractOrderInfo();
    },
    mounted:function(){

    },
    watch:{

    }
});