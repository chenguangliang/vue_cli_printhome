/**
 * 协议列表
 */
$(function(){
    var label = $.getUrlParam("label");
    if(label=="multiple"){
        getPiliangxunjiaList();
    }else{
        getDanyixunjiaList();
    }
})
/**
 * 单一询价
 */
function getDanyixunjiaList(){
    $("#danyiLi").attr('class','on');
    $("#piliangLi").attr('class','');
    $("#chuangJian").hide();
    xunjia.$data.lable = 'single';
    $.jsonAjax(getUrl("buyercenter/inquiry"),{},function(data,status,xhr){
        xunjia.$data.danyixunjia = data.pager.records;
        xunjia.$data.pager = data.pager;
    },false);
}
/**
 * 批量询价
 */
function getPiliangxunjiaList(){
    $("#danyiLi").attr('class','');
    $("#piliangLi").attr('class','on');
    $("#chuangJian").show();
    xunjia.$data.lable = 'multiple';
    $.jsonAjax(getUrl("requestPriceController/requestPrice"),{},function(data,status,xhr){
        xunjia.$data.piliangxunjia = data.pager.records;
        xunjia.$data.pager = data.pager;
    },false);
}
var xunjia = new Vue({
    el:'#xunjia',
    data:{
        lable:'single',
        danyixunjia:[],
        piliangxunjia:[],
        pager:'',
        oper:'',
        operText:'',
        operId:''
    },
    mounted:function(){
        // 上拉加载
        refresher.init({
            id: "wrapper",
            pullDownAction: Refresh,
            pullUpAction: Load
        });
        // initJS();
    },
    updated:function () {
        myScroll.refresh();
        changeLabel(this.$data.pager.nextPage,this.$data.pager.page);
    },
    methods:{
        subTime:function (value) {
            var retTime = '';
            function add0(m) {
                return m < 10 ? '0' + m : m
            }
            if(value){
                var time = new Date(parseInt(value));
                var y = time.getFullYear();
                var m = time.getMonth() + 1;
                var d = time.getDate();

                retTime =  y + '.' + add0(m) + '.' + add0(d);
            }
            return  retTime.substring(2,retTime.length);
        },
        //截取字符串
        getSubText:function (text,needLeng) {
            var retText =text;
            if (text.length > needLeng) {
                retText = text.substr(0, needLeng) + '...';
            }
            return retText;
        },
        time: function (value) {
            var retTime = '';
            function add0(m) {
                return m < 10 ? '0' + m : m
            }
            if(value){
                var time = new Date(value);
                var y = time.getFullYear();
                var m = time.getMonth() + 1;
                var d = time.getDate();

                retTime =  y + '.' + add0(m) + '.' + add0(d);
            }
            return retTime;
        },
        gotoGoods:function (item) {
            window.location = "../../html/13_shangPinXiangQing/shangPinYe.html?itemId="+item.itemId+"&skuId="+item.skuId;
        },
        showDiv:function (id,oper,operText) {
            $("#popWin").show();
            this.oper = oper;
            this.operText = operText;
            this.operId = id;
        },
        quxiao:function () {
            $("#popWin").hide();
            this.oper = '';
            this.operText = '';
            this.operId = '';
        },
        queding:function () {
            if(this.oper=="shanchu"){//删除
                this.deleteInquiry(this.operId);
            }else if(this.oper == 'recommit'){//重新询价
                this.requestInquiryRe(this.operId);
            }else if(this.oper == 'commit'){//发布询价
                this.requestInquiry(this.operId);
            }else if(this.oper == 'accept'){//接收报价
                this.acceptInquiry(this.operId);
            }
            $("#popWin").hide();
        },
        //删除
        deleteInquiry:function (ids) {
            $.jsonAjax(getUrl("requestPriceJavaController/deleteInquiry"),{ids:ids},function(data,status,xhr){
                popUp_auto(1000, data.msg);
                setTimeout(function () {
                    getPiliangxunjiaList();
                },1000)
            },false);
        },
        //重新报价
        requestInquiryRe:function (ids) {
            $.jsonAjax(getUrl("requestPriceJavaController/commitInquiryRe"),{ids:ids},function(data,status,xhr){
                popUp_auto(1000, data.msg);
                setTimeout(function () {
                    getPiliangxunjiaList();
                },1000)
            },false);
        },
        //发布询价
        requestInquiry:function (ids) {
            $.jsonAjax(getUrl("requestPriceJavaController/commitInquiry"), {ids: ids}, function (data, status, xhr) {
                popUp_auto(1000, data.msg);
                setTimeout(function () {
                    getPiliangxunjiaList();
                },1000)
            }, false);
        },
        //接收报价
        acceptInquiry:function (ids) {
            console.log(ids)
            var data = {
                inquiryNo:ids,
                flag:'request'
            }
            $.jsonAjax(getUrl("requestPriceJavaController/getDetaiInfoMap"), data, function (data, status, xhr) {
                if(data.status==200){
                    var resultDetail = data.data.resultDetail.result.rows;
                    for(var i=0;i<resultDetail.length;i++){
                        var dtoItems = resultDetail[i];
                        if(dtoItems.matPrice){
                            // ifPrice = "1";
                        }else{
                            popUp_auto_false(1000, "【"+dtoItems.itemName+"】还未报价，请等卖家报价后再接受!");
                            return;
                        }
                    }
                }
            }, false);
        },
        query:function (ids) {
            window.location.href="../18_maiJiaZhongXin/2_baoJiaGuanLi_xunJiaMingXi.html?inquiryNo="+ids;
        },
        //下单
        xiadan:function (inquiryNo) {
            var data = {
                inquiryNo:inquiryNo,
                flag:'request'
            }
            var ids = "";
            var nums = "";
            $.jsonAjax(getUrl("requestPriceJavaController/getDetaiInfoMap"), data, function (data, status, xhr) {
                if(data.status==200){
                    var resultDetail = data.data.resultDetail.result.rows;

                    for(var i=0;i<resultDetail.length;i++){
                        var dtoItems = resultDetail[i];
                        if(dtoItems.shopId&&dtoItems.status == '1'){//已接受
                            if(xunjia.time(new Date())<xunjia.time(dtoItems.beginDate)||xunjia.time(new Date())>xunjia.time(dtoItems.endDate)){
                                popUp_auto_false(1000, "物品【"+dtoItems.itemName+"】不在询价有效期内，无法下单!");
                                return;
                            }
                            if(!dtoItems.quantity||dtoItems.quantity<1){
                                popUp_auto_false(1000, "物品【"+dtoItems.itemName+"】下单数量必须大于0!");
                                return;
                            }
                            if(!dtoItems.matPrice){
                                popUp_auto_false(1000, "物品【"+dtoItems.itemName+"】商家未报价，无法下单!");
                                return;
                            }
                            if(nums == "") {
                                nums = dtoItems.quantity;
                                ids = dtoItems.id;
                            }else{
                                nums = nums +","+dtoItems.quantity;
                                ids = ids +","+dtoItems.id;
                            }
                            if(ids==""){
                                popUp_auto_false(1000, "请接收至少一条物品的报价才能下单！");
                                return;
                            }

                        }
                    }
                }
            }, false);
            if(nums){
                var data2={
                    inquiryNo : inquiryNo,
                    nums : nums,
                    detailIds :ids,
                    status :'3'
                }
                $.jsonAjax(getUrl("requestPriceJavaController/createOrderInfo"), data2, function (retData, status, xhr) {
                    console.log(retData)
                    if(retData.status=="200"){
                        window.location = "../../html/16_dingDanHeDui/dingDanHeDui.html?orderType=0&contractNo="+inquiryNo;
                    }else{
                        popUp_auto_false(1000, retData.msg);
                    }
                }, false);
            }
        }
    }
});

//原生js
function initJS() {
    //选项卡切换
    $(".xuanXiangKa ul li").click(function(){
        $(this).addClass("on").siblings().removeClass("on"); //切换选中的按钮高亮状态
        var index=$(this).index(); //获取被按下按钮的索引值，需要注意index是从0开始的
        $(".tab_box > div").eq(index).show().siblings().hide(); //在按钮选中时在下面显示相应的内容，同时隐藏不需要的框架内容
        $(".caoZuoAnNiu a").eq(index).show().siblings().hide();//促销管理
    });
}
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
        var nextPage = xunjia.$data.pager.nextPage;
        var thisPage = xunjia.$data.pager.page;
        if(nextPage == thisPage){
            refresher.info.pullUpLable = "已经到底了";
        }else{
            refresher.info.pullUpLable = "上拉加载...";
            var data = {
                page:nextPage,
                searchName:$("#searchName").val()
            }
            if(xunjia.$data.lable=="single"){
                $.jsonAjax(getUrl("buyercenter/inquiry"),data,function(data,status,xhr){
                    xunjia.$data.danyixunjia = xunjia.$data.danyixunjia.concat(data.pager.records);
                    xunjia.$data.pager = data.pager;
                },false);
            }else if(xunjia.$data.lable=="multiple"){
                $.jsonAjax(getUrl("requestPriceController/requestPrice"),data,function(data,status,xhr){
                    xunjia.$data.piliangxunjia = xunjia.$data.piliangxunjia.concat(data.pager.records);
                    xunjia.$data.pager = data.pager;
                },false);
            }
            changeLabel(xunjia.$data.pager.nextPage,xunjia.$data.pager.page);
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
//以下搜索方法
function showList(){
    $("#xunjia_sousuo").hide();
    $("#xunjia").show();
};
function showSouSuo(){
    var label = "名称:";
    if(xunjia.$data.lable=="single"){
        label = "商品名称:";
    }else if(xunjia.$data.lable=="multiple"){
        label = "询价名称:";
    }
    $("#souSuoLabel").html(label);
    $("#xunjia_sousuo").show();
    $("#xunjia").hide();
}
function reset() {
    $("#searchName").val("");
}
function dosearch () {
    var inData = {
        searchName:$("#searchName").val()
    }
    if(xunjia.$data.lable=="single"){
        $.jsonAjax(getUrl("buyercenter/inquiry"),inData,function(data,status,xhr){
            // if(data.pager.records.length>0){
                xunjia.$data.danyixunjia = data.pager.records;
                xunjia.$data.pager = data.pager;
                showList();
            // }else{
            //     showWujieguo();
            // }
        },false);
    }else if(xunjia.$data.lable=="multiple"){
        $.jsonAjax(getUrl("requestPriceController/requestPrice"),inData,function(data,status,xhr){
            // if(data.pager.records.length>0){
                xunjia.$data.piliangxunjia = data.pager.records;
                xunjia.$data.pager = data.pager;
                showList();
            // }else{
            //     showWujieguo();
            // }

        },false);
    }
}