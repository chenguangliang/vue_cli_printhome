/**
 * Created by cgl on 2017/12/5.
 * 发票管理
 */

var pagerOut='';
var invoiceListOut=[];
var queryDataAll = {
    orderId: $.getUrlParam("orderId"),
    orderTimeStart: $.getUrlParam("orderTimeStart") ? $.getUrlParam("orderTimeStart"):{},
    orderTimeEnd: $.getUrlParam("orderTimeEnd") ? $.getUrlParam("orderTimeEnd"):{} ,
    invState: $.getUrlParam("invState"),
    companyName: $.getUrlParam("companyName")
};//用来实现搜索跳页


var invoiceManageVM = new Vue({
    el:"#invoiceManageVM",
    data:{
        pager:'',
        invoiceList:[],
        beginTranY:'',
        invoiceInfo:{},
        img_url:img_url,
        picUrl:"",
        receivedInvoiceWinFlag:false,
        clickWhiceReceived:{},//用来记录点击确认收到发票的订单信息，点击弹框内的确定发送ajax时要挑着使用
    },
    methods:{
         goToTop: function () {
             $("#scroller").css("transform","translate(0px, -"+this.beginTranY+"px)");
             $("#top").hide();
        },
        queryInvoiceInfo:function (orderId) {
             var that=this;
            $.jsonAjax(getUrl("invoice/queryInvoiceInfo"), {orderId:orderId}, function (data, status, xhr) {
                if(data.isSuccess){
                   that.invoiceInfo=data.result;
                    console.log(that.invoiceInfo.invoice);
                }
            },false);
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
        //发票弹窗点击关闭图片
        closeIMG:function(){
            $('#enlargeImg').css("display", "none");
        },
        addInvoice: function (sellerId,orderId){
            window.location="../../html/16_dingDanHeDui/faPiaoXinXi_add.html?"+ $.assemblyRequestString({sellerId:sellerId,orderId:orderId});
        },
        receivedInvoice: function () {

            /*下面是clickWhiceReceived记录的所有参数，要挑着使用
            this.clickWhiceReceived.orderId=orderId;
            this.clickWhiceReceived.invoice=invoice;
            this.clickWhiceReceived.sellerId=sellerId;
            this.clickWhiceReceived.sign='recieve';
            this.clickWhiceReceived.state=1;
            this.clickWhiceReceived.invoiceId=invoiceId;
            this.clickWhiceReceived.orderType=orderType;
            this.clickWhiceReceived.id=id;
            this.clickWhiceReceived.invoiceTitle;*/

            var that=this;
                //判断是否是快速订单
                if(this.clickWhiceReceived.orderType == "-1"){//快速订单
                    var quickOrderSubmit={};
                    quickOrderSubmit.sign='recieve';
                    // quickOrderSubmit.state=1;
                    quickOrderSubmit.orderId=this.clickWhiceReceived.id;//快速下单要把id给orderId
                    quickOrderSubmit.orderNo=this.clickWhiceReceived.orderId;//快速下单要把orderId给orderNo
                    quickOrderSubmit.invoice=this.clickWhiceReceived.invoice-1;//快速下单的invoice类型是0，1，2
                    quickOrderSubmit.sellerId=this.clickWhiceReceived.sellerId;
                    quickOrderSubmit.invoiceId=this.clickWhiceReceived.invoiceId;
                    quickOrderSubmit.invoiceTitle=this.clickWhiceReceived.invoiceTitle;

                    $.jsonAjax(getUrl('quickor/master/updateQuickInvoice'),quickOrderSubmit,function(data, status, xhr){
                        if(data.success){//这里更新订单表
                            $.jsonAjax(getUrl('invoice/updateInvoiceState'),{orderId: that.clickWhiceReceived.orderId,state:1},function(data, status, xhr){
                                if(data.isSuccess){//这里更新发票表
                                    that.receivedInvoiceWinFlag=false;
                                    popUp_auto(1500,"操作成功");
                                    setTimeout(function () {
                                        window.location.reload();
                                    },1500)
                                }
                            });

                        }
                    });
                }
                else {
                    var commonOrderSubmit={};//组装ajax参数
                    commonOrderSubmit.sign='recieve';
                    commonOrderSubmit.state=1;
                    commonOrderSubmit.orderId=this.clickWhiceReceived.orderId;
                    commonOrderSubmit.invoice=this.clickWhiceReceived.invoice;
                    commonOrderSubmit.sellerId=this.clickWhiceReceived.sellerId;
                    commonOrderSubmit.invoiceId=this.clickWhiceReceived.invoiceId;
                    commonOrderSubmit.invoiceTitle=this.clickWhiceReceived.invoiceTitle;

                    $.jsonAjax(getUrl('order/updateOrderInvoice'),commonOrderSubmit,function(data, status, xhr){
                        if(data.isSuccess){//这里更新订单表
                            $.jsonAjax(getUrl('invoice/updateInvoiceState'),{orderId: that.clickWhiceReceived.orderId,state:1},function(data, status, xhr){
                                console.log(data);
                                if(data.isSuccess){//这里更新发票表
                                    that.receivedInvoiceWinFlag=false;
                                    popUp_auto(1500,"操作成功");
                                    setTimeout(function () {
                                        window.location.reload();
                                    },1500)
                                }
                            });

                        }
                    });
                }


        },
        receivedInvoiceWin: function (orderId,invoice,sellerId,invoiceId,orderType,id) {
            this.receivedInvoiceWinFlag=true;
            //记录点了那个订单
            this.clickWhiceReceived.orderId=orderId;
            this.clickWhiceReceived.invoice=invoice;
            this.clickWhiceReceived.sellerId=sellerId;
            this.clickWhiceReceived.sign='recieve';
            this.clickWhiceReceived.state=1;
            this.clickWhiceReceived.invoiceId=invoiceId;
            this.clickWhiceReceived.orderType=orderType;
            this.clickWhiceReceived.id=id;


            /*下面就是为了得到invoiceTitle，感觉后台不应该要这个参数*/
            var that=this;
            $.jsonAjax(getUrl("invoice/queryInvoiceInfo"), {orderId:orderId}, function (data, status, xhr) {
                if(data.isSuccess){

                    that.clickWhiceReceived.invoiceTitle = data.result.invoiceTitle? data.result.invoiceTitle:'';
                }
            },false);
            console.log(this.clickWhiceReceived);
        },
        orderDetile: function (orderId,orderType,passkey) {
            if(orderType == "-1"){//快速订单
                window.location.href='../21_quickOrder/3_quickOrderDetile.html?identity=1&orderId='+orderId;
            }
            else{
                if(orderId.indexOf("F") != -1){//分期订单 多加个参数orderType=periodOrder  用来显示分期信息
                    window.location.href='../12_maiJiaZhongXin/12_dingDan_dingDanXiangQing2.html?orderType=periodOrder&orderId='+orderId+"&passKey="+passkey;
                }
                else{//普通订单
                    window.location.href='../12_maiJiaZhongXin/12_dingDan_dingDanXiangQing2.html?orderId='+orderId+"&passKey="+passkey;

                }
            }
        }
    },
    beforeMount:function(){
        $.jsonAjax(getUrl("invoice/queryBuyerOrdersInvoices"), queryDataAll, function (data, status, xhr) {
            if(data.isSuccess){
                pagerOut = data.resultData.pager;
                invoiceListOut = data.resultData.pager.records;
            }
        },false);
        this.pager = pagerOut;
        this.invoiceList = invoiceListOut;
    },
    mounted:function(){
        //上拉刷新下拉加载
        if(this.invoiceList.length!=0){
            refresher.init({
                id: "wrapper",
                pullDownAction: Refresh,
                pullUpAction: Load
            });
            this.beginTranY=document.getElementById('pullDown').offsetHeight;
        }
        console.log(this.beginTranY);
    },
    updated:function(){
        myScroll.refresh();
    }
})

function Refresh() {
    setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
        myScroll.refresh();
        /****remember to refresh when you action was completed！！！****/
    }, 2000);
}

function Load() {
    setTimeout(function () {
        var nextPage = invoiceManageVM.$data.pager.nextPage;
        var thisPage = invoiceManageVM.$data.pager.page;
        if(nextPage == thisPage){
            refresher.info.pullUpLable = "我是有底线的~~";
        }else{
            queryDataAll.page = nextPage;
            $.jsonAjax(getUrl("invoice/queryBuyerOrdersInvoices"), queryDataAll, function (data, status, xhr) {
                if(data.isSuccess){
                    invoiceManageVM.$data.pager = data.resultData.pager;
                    invoiceManageVM.$data.invoiceList = invoiceManageVM.$data.invoiceList.concat(data.resultData.pager.records);
                }
            },false);
            nextPage = invoiceManageVM.$data.pager.nextPage;
            thisPage = invoiceManageVM.$data.pager.page;
            if(nextPage == thisPage){
                refresher.info.pullUpLable = "我是有底线的~~";
            }
            // myScroll.refresh();
            /****remember to refresh when you action was completed！！！****/
        }
        myScroll.refresh();
        /****remember to refresh when you action was completed！！！****/
    }, 1000);

}
