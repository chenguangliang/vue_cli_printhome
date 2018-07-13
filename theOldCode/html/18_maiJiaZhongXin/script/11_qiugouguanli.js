$(function () {
    
})

//我的求购列表
var pager = '';
var qiugoulist={};
var shopId='';
var shopName='';
 var qiugouList = new Vue({
     el:"#qiugouList",
     data:{
         pager:'',
         qiugoulist:{},
     },
     beforeCreate: function () {
         $.jsonAjax(getUrl("askItemInfoController/repAskItemList"),{},function(data,status,xhr){
             if(data.status=="200"){
                 pager = data.data.pager;
                 qiugoulist = data.data.pager.records;
                 shopId = data.data.shopId;
                 shopName = data.data.shopName;
                 // console.log(categoryes);
             }else{
                 printAlert(data.msg);
                 window.location = '../../html/2_login_sign/login_common.html';
             }
         },false);
     },
     created: function () {
         this.$data.pager = pager;
         this.$data.qiugoulist = qiugoulist;
     },
     mounted: function () {
         refresher.init({
             id: "wrapper",
             pullDownAction: Refresh,
             pullUpAction: Load
         });
         changeLabel(this.$data.pager.nextPage,this.$data.pager.page);
     },
     updated:function () {
         myScroll.refresh();
     },
     methods: {
         //截取字符串
         getSubText:function (text,needLeng) {
             var retText =text;
             if (text.length > needLeng) {
                 retText = text.substr(0, needLeng) + '...';
             }
             return retText;
         },
         statusText:function (status){
             var retText = "";
             if(status=='0'){
                 retText = "待提交";
             }else if(status=='1'){
                 retText = "待审核";
             }else if(status=='2'){
                 retText = "待报价";
             }else if(status=='3'){
                 retText = "已确认";
             }else if(status=='4'){
                 retText = "已驳回";
             }
             return retText;
         },
         validity:function (createDate,endDate) {
             var retText = this.time(createDate)+"-"+this.time(endDate);
             return retText;
         },
         time: function (value) {
             function add0(m) {
                 return m < 10 ? '0' + m : m
             }
             var time = new Date(value);
             var y = time.getFullYear();
             y = y < 2000 ? y + 1900 : y
             var m = time.getMonth() + 1;
             var d = time.getDate();

             return y.toString().substr(2, 2) + '.' + add0(m) + '.' + add0(d);
         },
         quote:function (page) {
             var endDate = page.endDate;
             //超时
             if(this.time(endDate)<this.time(new Date())){
                 $("#zhizhao").show();
             }else{
                 window.location = '../../html/18_maiJiaZhongXin/11_qiuGouGuanLi_baoJia.html?translationNo='+page.translationNo+'&flag=response';
             }
         }
     }
 });


//上拉刷新下拉加载
var generatedCount = 0;
function Refresh() {
    // setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
    myScroll.refresh();
    //     /****remember to refresh when you action was completed！！！****/
    // }, 2000);
}
function Load() {
    setTimeout(function () {
        var nextPage = qiugouList.$data.pager.nextPage;
        var thisPage = qiugouList.$data.pager.page;
        if(nextPage == thisPage){
            refresher.info.pullUpLable = "已经到底了";
        }else{
            refresher.info.pullUpLable = "上拉加载...";
            var data = {
                translationNo: $("#translationNo").val(),
                supplierName:shopName,
                supplierId: shopId,
                sellerFlag: 1,
                matCd: $("#matCd").val(),
                page:nextPage
            }
            $.jsonAjax(getUrl("askItemInfoController/queryAskItemList"),data,function(data,status,xhr){
                if(data.status=="200"){
                    qiugouList.$data.pager = data.data;
                    qiugouList.$data.qiugoulist = qiugouList.$data.qiugoulist.concat(data.data.records);
                    // console.log(data.data.records);
                    // console.log(qiugouList.$data.qiugoulist);
                }else{
                    printAlert(data.msg);
                    window.location = '../2_login_sign/login_common.html';
                }
            },false);
            changeLabel(qiugouList.$data.pager.nextPage,qiugouList.$data.pager.page);
            // myScroll.refresh();
            /****remember to refresh when you action was completed！！！****/
        }
        myScroll.refresh();
    }, 100);
}
function changeLabel(nextPage,thisPage) {
    if(nextPage <= thisPage){
        refresher.info.pullUpLable = "已经到底了";
    }else {
        refresher.info.pullUpLable = "上拉加载...";
    }
    document.querySelector('.pullUpLabel').innerHTML =refresher.info.pullUpLable;
}
//上拉刷新下拉加载

function showList(){
    $("#qiugou_sousuo").hide();
    $("#wujieguo").hide();
    $("#qiugouList").show();
};
function showSouSuo(){
    $("#qiugou_sousuo").show();
    $("#wujieguo").hide();
    $("#qiugouList").hide();
}
function reset() {
    $("#translationNo").val("");
    $("#matCd").val("");
}
function dosearch () {
    var data = {
        translationNo: $("#translationNo").val(),
        supplierName:shopName,
        supplierId: shopId,
        sellerFlag: 1,
        matCd: $("#matCd").val(),
    }
    $.jsonAjaxPost(getUrl("askItemInfoController/queryAskItemList"),data,function(data,status,xhr){
        if(data.status=="200"){
            if(data.data.records.length>0){
                qiugouList.$data.pager = data.data;
                qiugouList.$data.qiugoulist = data.data.records;
                changeLabel(qiugouList.$data.pager.nextPage,qiugouList.$data.pager.page);
                showList();
            }else{
                showWujieguo();
            }
        }else{
            printAlert(data.msg);
            window.location = '../2_login_sign/login_common.html';
        }
    },false);
}
function showWujieguo(){
    $("#qiugou_sousuo").hide();
    $("#wujieguo").show();
    $("#qiugouList").hide();
}