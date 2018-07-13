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
        confirmInvoiceWinFlag:false,
        clickWhiceConfirm:{},//用来记录点击确认开票的订单信息，点击弹框内的确定发送ajax
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
        confirmInvoice: function () {
            var that=this;
                $.jsonAjax(getUrl('invoice/updateInvoiceState'),that.clickWhiceConfirm,function(data, status, xhr){
                    if(data.isSuccess){
                        window.location.reload();
                    }
                });
        },
        confirmInvoiceWin: function (orderId,buyerId,invoiceId) {
            this.confirmInvoiceWinFlag=true;
            //记录点了那个订单
            this.clickWhiceConfirm.orderId=orderId;
            this.clickWhiceConfirm.buyerId=buyerId;
            this.clickWhiceConfirm.id=invoiceId;
            this.clickWhiceConfirm.sign='agree';
            this.clickWhiceConfirm.state=3;
        },
        orderDetile: function (orderId,orderType,passkey) {
            if(orderType == "-1"){//快速订单
                window.location.href='../21_quickOrder/3_quickOrderDetile.html?identity=2&orderId='+orderId;
            }
            else{
                if(orderId.indexOf("F") != -1){//分期订单 多加个参数orderType=periodOrder  用来显示分期信息
                    window.location.href='../18_maiJiaZhongXin/3_dingDan_dingDanXiangQing2.html?orderType=periodOrder&orderId='+orderId+"&passKey="+passkey;
                }
                else{//普通订单
                    window.location.href='../18_maiJiaZhongXin/3_dingDan_dingDanXiangQing2.html?orderId='+orderId+"&passKey="+passkey;

                }
            }
        }
    },
    beforeMount:function(){
        $.jsonAjax(getUrl("invoice/querySellerOrdersInvoices"), queryDataAll, function (data, status, xhr) {
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
            // refresher.info.pullUpLable = "已经到底了";
        }else{
            queryDataAll.page = nextPage;
            $.jsonAjax(getUrl("invoice/querySellerOrdersInvoices"), queryDataAll, function (data, status, xhr) {
                if(data.isSuccess){
                    invoiceManageVM.$data.pager = data.resultData.pager;
                    invoiceManageVM.$data.invoiceList = invoiceManageVM.$data.invoiceList.concat(data.resultData.pager.records);
                }
            },false);
            nextPage = invoiceManageVM.$data.pager.nextPage;
            thisPage = invoiceManageVM.$data.pager.page;
            if(nextPage == thisPage){
                refresher.info.pullUpLable = "已经到底了";
            }
            // myScroll.refresh();
            /****remember to refresh when you action was completed！！！****/
        }
        myScroll.refresh();
        /****remember to refresh when you action was completed！！！****/
    }, 1000);

}
