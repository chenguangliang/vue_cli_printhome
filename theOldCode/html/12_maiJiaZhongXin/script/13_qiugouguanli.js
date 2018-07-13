
/**
 * 求购管理
 */
$(function(){
})

//我的求购列表
var pager = '';
var qiugoulist={};
var itemCategoryLevelOneMap = '';
var itemCategoryLevelTwoMap = '';
var itemCategoryLevelThreeMap = '';
var itemCateMap = '';
var uid = '';
var qiugouList = new Vue({
    el:"#qiugouList",
    data:{
        pager:'',
        qiugoulist:{},
        showDiv1:false,
        translationNo:'',
        func:''
    },

    beforeCreate: function () {
       $.jsonAjax(getUrl("askItemInfoController/askItemList"),{},function(data,status,xhr){
            if(data.status=="200"){
                pager = data.data.pager;
                qiugoulist = data.data.pager.records;
                itemCategoryLevelOneMap = data.data.itemCategoryLevelOneMap;
                itemCategoryLevelTwoMap = data.data.itemCategoryLevelTwoMap;
                itemCategoryLevelThreeMap = data.data.itemCategoryLevelThreeMap;
                itemCateMap = data.data.itemCateMap;
                uid = data.data.uid;
                // console.log(itemCateMap);
                // window.location = '../12_maiJiaZhongXin/13_woDeQiuGou_wuJieGuo.html';
            }else{
                printAlert(data.msg);
                window.location = '../../html/12_maiJiaZhongXin/2_maiJiaZhongXin_maiJiaZhongXin.html';
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
        //截取字符串
        getSubText:function (text,needLeng) {
            var retText =text;
            if (text.length > needLeng) {
                retText = text.substr(0, needLeng) + '...';
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
            var time = new Date(parseInt(value));
            var y = time.getFullYear();
            y = y < 2000 ? y + 1900 : y
            var m = time.getMonth() + 1;
            var d = time.getDate();

            return y.toString().substr(2, 2) + '.' + add0(m) + '.' + add0(d);
        },
        // queding:function () {
        //     if(this.$data.func=="delete"){
        //         $.jsonAjax(getUrl("askItemInfoJavaController/deleteTranslation"),{ids:this.$data.translationNo},function(data,status,xhr){
        //             if(data.status = "200"){
        //                 printAlert('保存成功！');
        //                 location.reload();
        //                 console.log(data);
        //             }else{
        //                 popUp_auto_false(1000, data.msg);
        //             }
        //         },false);
        //     }else if(this.$data.func=="submit"){
        //         $.jsonAjax(getUrl("askItemInfoJavaController/commitTranslation"),{ids:this.$data.translationNo},function(data,status,xhr){
        //             if(data.status = "200"){
        //                 printAlert('保存成功！');
        //                 location.reload();
        //                 console.log(data);
        //             }else{
        //                 popUp_auto_false(1000, data.msg);
        //             }
        //         },false);
        //     }else if(this.$data.func=="reCommit"){
        //         $.jsonAjax(getUrl("askItemInfoJavaController/commitTranslationRe"),{ids:this.$data.translationNo},function(data,status,xhr){
        //             if(data.status = "200"){
        //                 printAlert('保存成功！');
        //                 location.reload();
        //                 console.log(data);
        //             }else{
        //                 popUp_auto_false(1000, data.msg);
        //             }
        //         },false);
        //     }else if(this.$data.func=="accept"){
        //         var detailId = '';
        //         var isTrue = true;
        //         $.jsonAjax(getUrl("askItemInfoController/askItemInfoMap"),{translationNo:this.$data.translationNo},function(data,status,xhr){
        //             if(data.status=="200"){
        //                 var details = data.data.details;
        //                 for(var i=0;i<details.length;i++){
        //                     if(!details[i].matPrice){
        //                         popUp_auto_false(1000, "【"+details[i].matDesc+"】还未报价，请等卖家报价后再接受!");
        //                         isTrue = false;
        //                         return;
        //                     }
        //                     detailId+=details[i].id+",";
        //                 }
        //                 if(detailId.length>1){
        //                     detailId = detailId.substring(0,detailId.length-1);
        //                 }
        //             }else{
        //                 printAlert(data.msg);
        //                 window.location = '../2_login_sign/login_common.html';
        //             }
        //         },false);
        //         if(isTrue){
        //             $.jsonAjax(getUrl("askItemInfoJavaController/acceptTranslationInfo"),{ids:this.$data.translationNo,detailId:detailId},function(data,status,xhr){
        //                 if(data.status = "200"){
        //                     printAlert('保存成功！');
        //                     location.reload();
        //                     console.log(data);
        //                 }else{
        //                     popUp_auto_false(1000, data.msg);
        //                 }
        //             },false);
        //         }
        //     }
        // },
        submit:function (translationNo) {
            printConfirm("您确定要进行提交吗？",function () {
                $.jsonAjax(getUrl("askItemInfoJavaController/commitTranslation"),{ids:translationNo},function(data,status,xhr){
                    if(data.status = "200"){
                        printAlert('提交成功！');
                        location.reload();
                        console.log(data);
                    }else{
                        popUp_auto_false(1000, data.msg);
                    }
                },false);
            });
        },
        del:function (translationNo) {
            printConfirm("您确定要进行删除吗？",function () {
                $.jsonAjax(getUrl("askItemInfoJavaController/deleteTranslation"),{ids:translationNo},function(data,status,xhr){
                    if(data.status = "200"){
                        printAlert('删除成功！');
                        location.reload();
                        console.log(data);
                    }else{
                        popUp_auto_false(1000, data.msg);
                    }
                },false);
            });
        },
        reCommit:function (translationNo) {
            printConfirm("您确定要重新求购吗？",function () {
                $.jsonAjax(getUrl("askItemInfoJavaController/commitTranslationRe"),{ids:translationNo},function(data,status,xhr){
                    if(data.status = "200"){
                        printAlert('操作成功！');
                        location.reload();
                        console.log(data);
                    }else{
                        popUp_auto_false(1000, data.msg);
                    }
                },false);
            });
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
                translationName: $("#translationName").val(),
                supplierName: $("#supplierName").val(),
                createBy: uid,
                matCd: $("#matCd").val(),
                itemCategoryLevelOne: $("#itemCategoryLevelOne").val(),
                itemCategoryLevelTwo: $("#itemCategoryLevelTwo").val(),
                itemCategoryLevelThree: $("#itemCategoryLevelThree").val(),
                itemCateMap: itemCateMap,
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

//搜索
var qiugou_sousuo = new Vue({
    el:"#qiugou_sousuo",
    data:{
        itemCategoryLevelOneMap:'',
        itemCategoryLevelTwoMap:'',
        itemCategoryLevelThreeMap:'',
    },
    beforeCreate: function () {

    },
    created: function () {
        this.$data.itemCategoryLevelOneMap = itemCategoryLevelOneMap;
        this.$data.itemCategoryLevelTwoMap = itemCategoryLevelTwoMap;
        this.$data.itemCategoryLevelThreeMap = itemCategoryLevelThreeMap;
    },
    methods: {
        doCatLevelchange:function (lev) {
            //一级类目改变
            if (lev == 'itemCategoryLevelOne') {
                $("#itemCategoryLevelTwo").val("");
                $("#itemCategoryLevelThree").val("");
                var data = {
                    itemCateMap: JSON.stringify(itemCateMap),
                    cid1: $("#itemCategoryLevelOne").val(),
                    cid2: null
                }
                $.jsonAjaxPost(getUrl("askItemInfoController/showItemCategory"),data,function(data,status,xhr){
                    if(data.status=="200"){
                        qiugou_sousuo.$data.itemCategoryLevelTwoMap = data.data.itemCategoryLevelTwoMap;
                        qiugou_sousuo.$data.itemCategoryLevelThreeMap = data.data.itemCategoryLevelThreeMap;
                    }else{
                        printAlert(data.msg);
                        window.location = '../2_login_sign/login_common.html';
                    }
                },false);
            }
            //二级类目改变
            else if (lev == 'itemCategoryLevelTwo') {
                $("#itemCategoryLevelThree").val("");
                var data = {
                    itemCateMap: JSON.stringify(itemCateMap),
                    cid1: $("#itemCategoryLevelOne").val(),
                    cid2: $("#itemCategoryLevelTwo").val()
                }
                $.jsonAjax(getUrl("askItemInfoController/showItemCategory"),data,function(data,status,xhr){
                    if(data.status=="200"){
                        qiugou_sousuo.$data.itemCategoryLevelThreeMap = data.data.itemCategoryLevelThreeMap;
                    }else{
                        printAlert(data.msg);
                        window.location = '../2_login_sign/login_common.html';
                    }
                },false);
            }

        },
        reset:function () {
            $("#translationNo").val("");
            $("#translationName").val("");
            $("#supplierName").val("");
            $("#matCd").val("");
            $("#itemCategoryLevelOne").val("");
            $("#itemCategoryLevelTwo").val("");
            $("#itemCategoryLevelThree").val("");
            qiugou_sousuo.doCatLevelchange('itemCategoryLevelOne');
        },
        search:function () {
            var data = {
                translationNo: $("#translationNo").val(),
                translationName: $("#translationName").val(),
                supplierName: $("#supplierName").val(),
                createBy: uid,
                matCd: $("#matCd").val(),
                itemCategoryLevelOne: $("#itemCategoryLevelOne").val(),
                itemCategoryLevelTwo: $("#itemCategoryLevelTwo").val(),
                itemCategoryLevelThree: $("#itemCategoryLevelThree").val(),
                itemCateMap: JSON.stringify(itemCateMap),
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
    }
});
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
function showWujieguo(){
    $("#qiugou_sousuo").hide();
    $("#wujieguo").show();
    $("#qiugouList").hide();
}
